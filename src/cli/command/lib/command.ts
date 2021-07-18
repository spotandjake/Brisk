import { EventEmitter } from 'events';
import path from 'path';
import { Argument, humanReadableArgName } from './argument';
import { CommanderError } from './error';
import { Help } from './help';
import { Option, splitOptionFlags } from './option';

interface CommandOptions {
  hidden?: boolean;
  isDefault?: boolean;
  noHelp?: boolean;
}
interface ExecutableCommandOptions extends CommandOptions {
  executableFile?: string;
}
export interface HelpContext { // optional parameter for .help() and .outputHelp()
  error: boolean;
}

class Command extends EventEmitter {
  public commands: Command[] = [];
  public options: Option[] = [];
  public parent: (Command|null) = null;
  private _allowExcessArguments = true;
  public _args: Argument[] = [];
  public args: string[] = [];
  private rawArgs: string[] = [];
  private processedArgs: any = []; // like .args but after custom processing and collecting variadic
  private _scriptPath: (string|null) = null;
  public _name: string;
  private _optionValues: any = {};
  private _storeOptionsAsProperties = false;
  private _actionHandler: any = null;
  private _executableHandler = false;
  private _executableFile: (string|null) = null; // custom name for executable
  private _defaultCommandName: any = null;
  private _exitCallback: any = null;
  public _aliases: string[] = [];
  private _combineFlagAndOptionalValue = true;
  private _description = '';
  public _argsDescription: any = undefined; // legacy
  private _enablePositionalOptions = false;
  private _lifeCycleHooks: any = {}; // a hash of arrays
  private _showHelpAfterError: (boolean | string) = false; // a hash of arrays
  // see .configureOutput() for docs
  private _outputConfiguration: any = {
    writeOut: (str: string): boolean => process.stdout.write(str),
    writeErr: (str: string): boolean => process.stderr.write(str),
    getOutHelpWidth: (): (number|undefined) => process.stdout.isTTY ? process.stdout.columns : undefined,
    getErrHelpWidth: (): (number|undefined) => process.stderr.isTTY ? process.stderr.columns : undefined,
    outputError: (str: string, write: any) => write(str)
  };
  public _hidden = false;
  public _hasHelpOption = true;
  public _helpFlags = '-h, --help';
  public _helpDescription = 'display help for command';
  public _helpShortFlag = '-h';
  public _helpLongFlag = '--help';
  private _addImplicitHelpCommand: (boolean|undefined) = undefined; // Deliberately undefined, not decided whether true or false
  private _helpCommandName = 'help';
  public _helpCommandnameAndArgs = 'help [command]';
  public _helpCommandDescription = 'display help for command';
  private _helpConfiguration: any = {};
  private _usage: (string|undefined) = undefined;
  private _version: (string|undefined) = undefined;
  private _versionOptionName: (string|undefined) = undefined;
  constructor(name = '') {
    super();
    this._name = name;
  }
  command(nameAndArgs: string, actionOptsOrExecDesc?: string, execOpts?: ExecutableCommandOptions): Command {
    let desc: (string|undefined) = actionOptsOrExecDesc;
    let opts = execOpts;
    if (typeof desc === 'object' && desc !== undefined) {
      opts = desc;
      desc = undefined;
    }
    opts = opts || {};
    const [, name, args] = <RegExpMatchArray>nameAndArgs.match(/([^ ]+) *(.*)/);
    const cmd = new Command(name);
    if (desc) {
      cmd.description(desc);
      cmd._executableHandler = true;
    }
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    cmd._outputConfiguration = this._outputConfiguration;
    cmd._hidden = !!(opts.noHelp || opts.hidden); // noHelp is deprecated old name for hidden
    cmd._hasHelpOption = this._hasHelpOption;
    cmd._helpCommandName = this._helpCommandName;
    cmd._helpCommandnameAndArgs = this._helpCommandnameAndArgs;
    cmd._helpCommandDescription = this._helpCommandDescription;
    cmd._helpConfiguration = this._helpConfiguration;
    cmd._exitCallback = this._exitCallback;
    cmd._storeOptionsAsProperties = this._storeOptionsAsProperties;
    cmd._combineFlagAndOptionalValue = this._combineFlagAndOptionalValue;
    cmd._allowExcessArguments = this._allowExcessArguments;
    cmd._enablePositionalOptions = this._enablePositionalOptions;
    cmd._showHelpAfterError = this._showHelpAfterError;
    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
    if (args) cmd.arguments(args);
    this.commands.push(cmd);
    cmd.parent = this;
    if (desc) return this;
    return cmd;
  }
  createHelp(): Help {
    return Object.assign(new Help(), this.configureHelp());
  }
  configureHelp(configuration?: any): (Command|any) {
    if (configuration === undefined) return this._helpConfiguration;
    this._helpConfiguration = configuration;
    return this;
  }
  createArgument(name: string, description: string): Argument {
    return new Argument(name, description);
  }
  argument(name: string, description?: string, fn?: any, defaultValue?: any): Command {
    const argument = this.createArgument(name, <string>description);
    if (typeof fn === 'function') argument.default(defaultValue).argParser(fn);
    else argument.default(fn);
    this.addArgument(argument);
    return this;
  }
  arguments(names: string): Command {
    names.split(/ +/).forEach((detail) => this.argument(detail));
    return this;
  }
  addArgument(argument: Argument): Command {
    const previousArgument = this._args.slice(-1)[0];
    if (previousArgument && previousArgument.variadic) {
      throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
    }
    if (argument.required && argument.defaultValue !== undefined && argument.parseArg === undefined) {
      throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
    }
    this._args.push(argument);
    return this;
  }
  _hasImplicitHelpCommand(): boolean {
    if (this._addImplicitHelpCommand === undefined) {
      return !!this.commands.length && !this._actionHandler && !this._findCommand('help');
    }
    return this._addImplicitHelpCommand;
  }
  _exit(exitCode: number, code: string, message: string): never {
    if (this._exitCallback) this._exitCallback(new CommanderError(exitCode, code, message));
    process.exit(exitCode);
  }
  action(fn: any): Command {
    const listener = (args: any): any => {
      // The .action callback takes an extra parameter which is the command or options.
      const expectedArgsCount = this._args.length;
      const actionArgs = args.slice(0, expectedArgsCount);
      if (this._storeOptionsAsProperties) actionArgs[expectedArgsCount] = this; // backwards compatible "options"
      else actionArgs[expectedArgsCount] = this.opts();
      actionArgs.push(this);
      return fn.apply(this, actionArgs);
    };
    this._actionHandler = listener;
    return this;
  }
  createOption(flags: string, description: string): Option {
    return new Option(flags, description);
  }
  addOption(option: Option): Command {
    const oname = option.name();
    const name = option.attributeName();
    let defaultValue = option.defaultValue;
    // preassign default value for --no-*, [optional], <required>, or plain flag if boolean value
    if (option.negate || option.optional || option.required || typeof defaultValue === 'boolean') {
      // when --no-foo we make sure default is true, unless a --foo option is already defined
      if (option.negate) {
        //@ts-ignore
        const positiveLongFlag = option.long.replace(/^--no-/, '--');
        defaultValue = this._findOption(positiveLongFlag) ? this.getOptionValue(name) : true;
      }
      // preassign only if we have a default
      if (defaultValue !== undefined) this.setOptionValue(name, defaultValue);
    }
    // register the option
    this.options.push(option);
    // when it's passed assign the value
    // and conditionally invoke the callback
    this.on(`option:${oname}`, (val) => {
      const oldValue = this.getOptionValue(name);
      // custom processing
      if (val !== null && option.parseArg) {
        try {
          val = option.parseArg(val, oldValue === undefined ? defaultValue : oldValue);
        } catch (err) {
          if (err.code === 'brisk.invalidArgument') {
            const message = `error: option '${option.flags}' argument '${val}' is invalid. ${err.message}`;
            this._displayError(err.exitCode, err.code, message);
          }
          throw err;
        }
      } else if (val !== null && option.variadic) {
        val = option._concatValue(val, oldValue);
      }
      // unassigned or boolean value
      if (typeof oldValue === 'boolean' || typeof oldValue === 'undefined') {
        // if no value, negate false, and we have a default, then use it!
        if (val == null) this.setOptionValue(name, option.negate ? false : defaultValue || true);
        else this.setOptionValue(name, val);
      } else if (val !== null) this.setOptionValue(name, option.negate ? false : val);
    });
    return this;
  }
  _optionEx(config: any, flags: string, description: string, fn: any, defaultValue: (string|boolean)): Command {
    const option = this.createOption(flags, description);
    option.makeOptionMandatory(!!config.mandatory);
    if (typeof fn === 'function') {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      // deprecated
      const regex = fn;
      fn = (val: any, def: any) => {
        const m = regex.exec(val);
        return m ? m[0] : def;
      };
      option.default(defaultValue).argParser(fn);
    } else option.default(fn);
    return this.addOption(option);
  }
  option(flags: string, description: string, fn?: any, defaultValue?: (string|boolean)): Command {
    //@ts-ignore
    return this._optionEx({}, flags, description, fn, defaultValue);
  }
  getOptionValue(key: string) {
    //@ts-ignore
    return this._storeOptionsAsProperties ? this[key] : this._optionValues[key];
  }
  setOptionValue(key: string, value: any): Command {
    //@ts-ignore
    if (this._storeOptionsAsProperties) this[key] = value;
    else this._optionValues[key] = value;
    return this;
  }
  _prepareUserArgs(argv: string[], parseOptions: any): string[] {
    if (argv !== undefined && !Array.isArray(argv)) {
      throw new Error('first parameter to parse must be array or undefined');
    }
    parseOptions = parseOptions || {};
    // Default to using process.argv
    if (argv === undefined) {
      argv = process.argv;
      console.log(process.versions);
      if (process.versions && process.versions.electron) parseOptions.from = 'electron';
    }
    this.rawArgs = argv.slice();
    // make it a little easier for callers by supporting various argv conventions
    let userArgs: string[];
    switch (parseOptions.from) {
      case undefined:
      case 'node':
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
        break;
      case 'electron':
        //@ts-ignore
        if (process.defaultApp) {
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
        } else {
          userArgs = argv.slice(1);
        }
        break;
      case 'user':
        userArgs = argv.slice(0);
        break;
      default:
        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
    }
    if (!this._scriptPath && require.main) this._scriptPath = require.main.filename;
    // Guess name, used in usage in help.
    this._name = <string>(this._name || (this._scriptPath && path.basename(this._scriptPath, path.extname(this._scriptPath))));
    return userArgs;
  }
  parse(argv: string[], parseOptions?: any): Command {
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    this._parseCommand([], userArgs);
    return this;
  }
  _dispatchSubcommand(commandName: string, operands: string[], unknown: string[]): any {
    const subCommand = this._findCommand(commandName);
    if (!subCommand) this.help({ error: true });
    else return subCommand._parseCommand(operands, unknown);
  }
  _checkNumberOfArguments(): void {
    // too few
    this._args.forEach((arg: Argument, i: number) => {
      if (arg.required && this.args[i] == null) this.missingArgument(arg.name());
    });
    // too many
    if (this._args.length > 0 && this._args[this._args.length - 1].variadic) return;
    if (this.args.length > this._args.length) this._excessArguments(this.args);
  }
  _processArguments(): void {
    const myParseArg = (argument: Argument, value: any, previous: any): void => {
      // Extra processing for nice error message on parsing failure.
      let parsedValue = value;
      if (value !== null && argument.parseArg) {
        try {
          parsedValue = argument.parseArg(value, previous);
        } catch (err) {
          if (err.code === 'brisk.invalidArgument') {
            const message = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'. ${err.message}`;
            this._displayError(err.exitCode, err.code, message);
          }
          throw err;
        }
      }
      return parsedValue;
    };
    this._checkNumberOfArguments();
    const processedArgs: any[] = [];
    this._args.forEach((declaredArg: Argument, index: number): void => {
      let value = declaredArg.defaultValue;
      if (declaredArg.variadic) {
        // Collect together remaining arguments for passing together as an array.
        if (index < this.args.length) {
          value = this.args.slice(index);
          if (declaredArg.parseArg) {
            value = value.reduce((processed: any, v: number) => myParseArg(declaredArg, v, processed), declaredArg.defaultValue);
          }
        } else if (value === undefined) value = [];
      } else if (index < this.args.length) {
        value = this.args[index];
        if (declaredArg.parseArg) value = myParseArg(declaredArg, value, declaredArg.defaultValue);
      }
      processedArgs[index] = value;
    });
    this.processedArgs = processedArgs;
  }
  _chainOrCall(promise: (Promise<any>|undefined), fn: any): (Promise<any>|undefined) {
    // thenable
    if (promise && promise.then && typeof promise.then === 'function') {
      // already have a promise, chain callback
      return promise.then(() => fn());
    }
    // callback might return a promise
    return fn();
  }
  _chainOrCallHooks(promise: (Promise<any>|undefined), event: string): (Promise<any>|undefined) {
    let result = promise;
    const hooks: { hookedCommand: Command; callback: any; }[] = [];
    getCommandAndParents(this)
      .reverse()
      .filter(cmd => cmd._lifeCycleHooks[event] !== undefined)
      .forEach(hookedCommand => {
        hookedCommand._lifeCycleHooks[event].forEach((callback: any) => {
          hooks.push({ hookedCommand, callback });
        });
      });
    if (event === 'postAction') hooks.reverse();
    hooks.forEach((hookDetail) => {
      result = this._chainOrCall(result, () => hookDetail.callback(hookDetail.hookedCommand, this));
    });
    return result;
  }
  _parseCommand(operands: string[], unknown: string[]): any {
    const parsed = this.parseOptions(unknown);
    operands = operands.concat(parsed.operands);
    unknown = parsed.unknown;
    this.args = operands.concat(unknown);
    if (operands && this._findCommand(operands[0])) {
      return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
    }
    if (this._hasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
      if (operands.length === 1) this.help();
      return this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
    }
    if (this._defaultCommandName) {
      outputHelpIfRequested(this, unknown); // Run the help for default command from parent rather than passing to default command
      return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
    }
    if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
      // probably missing subcommand and no handler, user needs help (and exit)
      this.help({ error: true });
    }
    outputHelpIfRequested(this, parsed.unknown);
    this._checkForMissingMandatoryOptions();
    // We do not always call this check to avoid masking a "better" error, like unknown command.
    const checkForUnknownOptions = () => {
      if (parsed.unknown.length > 0) this.unknownOption(parsed.unknown[0]);
    };
    const commandEvent = `command:${this.name()}`;
    if (this._actionHandler) {
      checkForUnknownOptions();
      this._processArguments();
      let actionResult;
      actionResult = this._chainOrCallHooks(actionResult, 'preAction');
      actionResult = this._chainOrCall(actionResult, () => this._actionHandler(this.processedArgs));
      if (this.parent) this.parent.emit(commandEvent, operands, unknown); // legacy
      actionResult = this._chainOrCallHooks(actionResult, 'postAction');
      return actionResult;
    }
    if (this.parent && this.parent.listenerCount(commandEvent)) {
      checkForUnknownOptions();
      this._processArguments();
      this.parent.emit(commandEvent, operands, unknown); // legacy
    } else if (operands.length) {
      if (this._findCommand('*')) { // legacy default command
        return this._dispatchSubcommand('*', operands, unknown);
      }
      if (this.listenerCount('command:*')) {
        // skip option check, emit event for possible misspelling suggestion
        this.emit('command:*', operands, unknown);
      } else if (this.commands.length) {
        this.unknownCommand();
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    } else if (this.commands.length) {
      // This command has subcommands and nothing hooked up at this level, so display help (and exit).
      this.help({ error: true });
    } else {
      checkForUnknownOptions();
      this._processArguments();
      // fall through for caller to handle after calling .parse()
    }
  }
  _findCommand(name: string): Command {
    return <Command>(!name ? undefined : this.commands.find((cmd: Command) => cmd._name === name || cmd._aliases.includes(name)));
  }
  _findOption(arg: string): Option {
    return <Option>this.options.find(option => option.is(arg));
  }
  _checkForMissingMandatoryOptions(): void {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    for (let cmd: Command = <Command>this; cmd; cmd = <Command>cmd.parent) {
      cmd.options.forEach((anOption) => {
        if (anOption.mandatory && (cmd.getOptionValue(anOption.attributeName()) === undefined)) {
          cmd.missingMandatoryOptionValue(anOption);
        }
      });
    }
  }
  parseOptions(argv: string[]): { operands: string[], unknown: string[] } {
    const operands: string[] = []; // operands, not options or values
    const unknown: string[] = []; // first unknown option and remaining unknown args
    let dest = operands;
    const args = argv.slice();
    const maybeOption = (arg: string) =>  arg.length > 1 && arg[0] === '-';
    // parse options
    let activeVariadicOption = null;
    while (args.length) {
      const arg = <string>args.shift();
      // literal
      if (arg === '--') {
        if (dest === unknown) dest.push(arg);
        dest.push(...args);
        break;
      }
      if (activeVariadicOption && !maybeOption(arg)) {
        this.emit(`option:${activeVariadicOption.name()}`, arg);
        continue;
      }
      activeVariadicOption = null;
      if (maybeOption(arg)) {
        const option = this._findOption(arg);
        // recognised option, call listener to assign value with possible custom processing
        if (option) {
          if (option.required) {
            const value = args.shift();
            if (value === undefined) this.optionMissingArgument(option);
            this.emit(`option:${option.name()}`, value);
          } else if (option.optional) {
            let value = null;
            // historical behaviour is optional value is following arg unless an option
            if (args.length > 0 && !maybeOption(args[0])) {
              value = args.shift();
            }
            this.emit(`option:${option.name()}`, value);
          } else { // boolean flag
            this.emit(`option:${option.name()}`);
          }
          activeVariadicOption = option.variadic ? option : null;
          continue;
        }
      }
      // Look for combo options following single dash, eat first one if known.
      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
        const option = this._findOption(`-${arg[1]}`);
        if (option) {
          if (option.required || (option.optional && this._combineFlagAndOptionalValue)) {
            // option with value following in same argument
            this.emit(`option:${option.name()}`, arg.slice(2));
          } else {
            // boolean option, emit and put back remainder of arg for further processing
            this.emit(`option:${option.name()}`);
            args.unshift(`-${arg.slice(2)}`);
          }
          continue;
        }
      }
      // Look for known long flag with value, like --foo=bar
      if (/^--[^=]+=/.test(arg)) {
        const index = arg.indexOf('=');
        const option = this._findOption(arg.slice(0, index));
        if (option && (option.required || option.optional)) {
          this.emit(`option:${option.name()}`, arg.slice(index + 1));
          continue;
        }
      }
      // Not a recognized option by this command.
      // Might be a command-argument, or subcommand option, or unknown option, or help command or option.
      // An unknown option means further arguments also classified as unknown so can be reprocessed by sub commands.
      if (maybeOption(arg)) dest = unknown;
      // If using positionalOptions, stop processing our options at subcommand.
      if (this._enablePositionalOptions && operands.length === 0 && unknown.length === 0) {
        if (this._findCommand(arg)) {
          operands.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        } else if (arg === this._helpCommandName && this._hasImplicitHelpCommand()) {
          operands.push(arg);
          if (args.length > 0) operands.push(...args);
          break;
        } else if (this._defaultCommandName) {
          unknown.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        }
      }
      // add arg
      dest.push(arg);
    }
    return { operands, unknown };
  }
  opts() {
    if (this._storeOptionsAsProperties) {
      // Preserve original behaviour so backwards compatible when still using properties
      const result: { [key: string]: any } = {};
      const len = this.options.length;
      for (let i = 0; i < len; i++) {
        const key = this.options[i].attributeName();
        //@ts-ignore
        result[key] = key === this._versionOptionName ? this._version : this[key];
      }
      return result;
    }
    return this._optionValues;
  }
  _displayError(exitCode: number, code: string, message: string): void {
    this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
    if (typeof this._showHelpAfterError === 'string') {
      this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
    } else if (this._showHelpAfterError) {
      this._outputConfiguration.writeErr('\n');
      this.outputHelp({ error: true });
    }
    this._exit(exitCode, code, message);
  }
  missingArgument(name: string): void {
    this._displayError(1, 'brisk.missingArgument', `error: missing required argument '${name}'`);
  }
  optionMissingArgument(option: Option): void {
    this._displayError(1, 'brisk.optionMissingArgument', `error: option '${option.flags}' argument missing`);
  }
  missingMandatoryOptionValue(option: Option): void {
    this._displayError(1, 'brisk.missingMandatoryOptionValue', `error: required option '${option.flags}' not specified`);
  }
  unknownOption(flag: string): void {
    this._displayError(1, 'brisk.unknownOption', `error: unknown option '${flag}'`);
  }
  _excessArguments(receivedArgs: string[]): void {
    if (this._allowExcessArguments) return;
    const expected = this._args.length;
    const s = (expected === 1) ? '' : 's';
    const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
    this._displayError(1, 'brisk.excessArguments', message);
  }
  unknownCommand(): void {
    this._displayError(1, 'brisk.unknownCommand', `error: unknown command '${this.args[0]}'`);
  }
  version(str: string, flags?: string, description?: string): (Command|string) {
    if (str === undefined) return <string>this._version;
    this._version = str;
    flags = flags || '-V, --version';
    description = description || 'output the version number';
    const versionOption = this.createOption(flags, description);
    this._versionOptionName = versionOption.attributeName();
    this.options.push(versionOption);
    this.on(`option:${versionOption.name()}`, () => {
      this._outputConfiguration.writeOut(`${str}\n`);
      this._exit(0, 'brisk.version', str);
    });
    return this;
  }
  description(str: string, argsDescription?: any): Command {
    if (str === undefined && argsDescription === undefined) return this;
    this._description = str;
    if (argsDescription) {
      this._argsDescription = argsDescription;
    }
    return this;
  }
  alias(alias: string): (string|Command) {
    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility
    let command: Command = <Command>this;
    if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
      // assume adding alias for last added executable subcommand, rather than this
      command = this.commands[this.commands.length - 1];
    }
    if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');
    command._aliases.push(alias);
    return this;
  }
  usage(str?: string): (string|Command) {
    if (str === undefined) {
      if (this._usage) return this._usage;
      const args = this._args.map((arg) => humanReadableArgName(arg));
      return [].concat(
        //@ts-ignore
        (this.options.length || this._hasHelpOption ? '[options]' : []),
        (this.commands.length ? '[command]' : []),
        (this._args.length ? args : [])
      ).join(' ');
    }
    this._usage = str;
    return this;
  }
  name(str?: string): (string|Command) {
    if (str === undefined) return this._name;
    this._name = str;
    return this;
  }
  helpInformation(contextOptions: HelpContext): string {
    const helper = this.createHelp();
    if (helper.helpWidth === undefined) {
      helper.helpWidth = (contextOptions && contextOptions.error) ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
    }
    return helper.formatHelp(this, helper);
  }
  _getHelpContext(contextOptions: any): any {
    contextOptions = contextOptions || {};
    const context: { error: boolean, write?: any, command?: Command } = { error: !!contextOptions.error };
    let write;
    if (context.error) {
      write = (arg: any) => this._outputConfiguration.writeErr(arg);
    } else {
      write = (arg: any) => this._outputConfiguration.writeOut(arg);
    }
    context.write = contextOptions.write || write;
    context.command = this;
    return context;
  }
  outputHelp(contextOptions?: any): void {
    let deprecatedCallback;
    if (typeof contextOptions === 'function') {
      deprecatedCallback = contextOptions;
      contextOptions = undefined;
    }
    const context = this._getHelpContext(contextOptions);
    const groupListeners = [];
    let command: Command = <Command>this;
    while (command) {
      groupListeners.push(command); // ordered from current command to root
      command = <Command>command.parent;
    }
    groupListeners.slice().reverse().forEach(command => command.emit('beforeAllHelp', context));
    this.emit('beforeHelp', context);
    let helpInformation = this.helpInformation(context);
    if (deprecatedCallback) {
      helpInformation = deprecatedCallback(helpInformation);
      if (typeof helpInformation !== 'string' && !Buffer.isBuffer(helpInformation)) {
        throw new Error('outputHelp callback must return a string or a Buffer');
      }
    }
    context.write(helpInformation);
    this.emit(this._helpLongFlag); // deprecated
    this.emit('afterHelp', context);
    groupListeners.forEach(command => command.emit('afterAllHelp', context));
  }
  helpOption(flags?: (string|boolean), description?: string): Command {
    if (typeof flags === 'boolean') {
      this._hasHelpOption = flags;
      return this;
    }
    this._helpFlags = flags || this._helpFlags;
    this._helpDescription = description || this._helpDescription;
    const helpFlags = splitOptionFlags(this._helpFlags);
    this._helpShortFlag = <string>helpFlags.shortFlag;
    this._helpLongFlag = <string>helpFlags.longFlag;
    return this;
  }
  help(contextOptions?: { error: boolean }): void {
    this.outputHelp(contextOptions);
    let exitCode = process.exitCode || 0;
    if (exitCode === 0 && contextOptions && typeof contextOptions !== 'function' && contextOptions.error) exitCode = 1;
    // message: do not have all displayed text available so only passing placeholder.
    this._exit(exitCode, 'brisk.help', '(outputHelp)');
  }
}
function outputHelpIfRequested(cmd: Command, args: string[]): void {
  const helpOption = cmd._hasHelpOption && args.find(arg => arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
  if (helpOption) {
    cmd.outputHelp();
    cmd._exit(0, 'brisk.helpDisplayed', '(outputHelp)');
  }
}
function getCommandAndParents(startCommand: Command): Command[] {
  const result = [];
  for (let command = startCommand; command; command = <Command>command.parent) {
    result.push(command);
  }
  return result;
}
export { Command };