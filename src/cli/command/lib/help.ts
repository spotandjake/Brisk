import { humanReadableArgName } from './argument.js';
// Import Types
import { Argument } from './argument';
import { Command } from './command';
import { Option } from './option';
// Although this is a class, methods are static in style to allow override using subclass or just functions.
class Help {
  public helpWidth?: number;
  public sortSubcommands: boolean;
  public sortOptions: boolean;
  constructor() {
    this.helpWidth = undefined;
    this.sortSubcommands = false;
    this.sortOptions = false;
  }
  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   */
  visibleCommands(cmd: Command): Command[] {
    const visibleCommands = cmd.commands.filter(cmd => !cmd._hidden);
    if (cmd._hasImplicitHelpCommand()) {
      // Create a command matching the implicit help command.
      //@ts-ignore
      const [, helpName, helpArgs] = cmd._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);
      const helpCommand = new Command(helpName).helpOption(false);
      helpCommand.description(cmd._helpCommandDescription);
      if (helpArgs) helpCommand.arguments(helpArgs);
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        // @ts-ignore: overloaded return type
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }
  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   */
  visibleOptions(cmd: Command): Option[] {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    // Implicit help
    const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
    const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
    if (showShortHelpFlag || showLongHelpFlag) {
      let helpOption;
      if (!showShortHelpFlag) {
        helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
      } else if (!showLongHelpFlag) {
        helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
      } else {
        helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
      }
      visibleOptions.push(helpOption);
    }
    if (this.sortOptions) {
      //@ts-ignore
      const getSortKey = (option: Option) => option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
      visibleOptions.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));
    }
    return visibleOptions;
  }
  /**
   * Get an array of the arguments if any have a description.
   */
  visibleArguments(cmd: Command): Argument[] {
    // Side effect! Apply the legacy descriptions before the arguments are displayed.
    if (cmd._argsDescription) {
      cmd._args.forEach(argument => {
        argument.description = argument.description || cmd._argsDescription[argument.name()] || '';
      });
    }
    // If there are any arguments with a description then return all the arguments.
    if (cmd._args.find(argument => argument.description)) return cmd._args;
    return [];
  }
  /**
   * Get the command term to show in the list of subcommands.
   */
  subcommandTerm(cmd: Command): string {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd._args.map(arg => humanReadableArgName(arg)).join(' ');
    return cmd._name +
      (cmd._aliases[0] ? `|${cmd._aliases[0]}` : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ` ${args}` : '');
  }
  /**
   * Get the option term to show in the list of options.
   */
  optionTerm(option: Option): string {
    return option.flags;
  }
  /**
   * Get the argument term to show in the list of arguments.
   */
  argumentTerm(argument: Argument): string {
    return argument.name();
  }
  /**
   * Get the longest command term length.
   */
  longestSubcommandTermLength(cmd: Command, helper: Help): number {
    return helper.visibleCommands(cmd).reduce((max, command) => Math.max(max, helper.subcommandTerm(command).length), 0);
  }
  /**
   * Get the longest option term length.
   */
  longestOptionTermLength(cmd: Command, helper: Help): number {
    return helper.visibleOptions(cmd).reduce((max, option) => Math.max(max, helper.optionTerm(option).length), 0);
  }
  /**
   * Get the longest argument term length.
   */
  longestArgumentTermLength(cmd: Command, helper: Help): number {
    return helper.visibleArguments(cmd).reduce((max, argument) => Math.max(max, helper.argumentTerm(argument).length), 0);
  }
  /**
   * Get the command usage to be displayed at the top of the built-in help.
   */
  commandUsage(cmd: Command): string {
    // Usage
    let cmdName = cmd._name;
    if (cmd._aliases[0]) cmdName = `${cmdName}|${cmd._aliases[0]}`;
    let parentCmdNames = '';
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      parentCmdNames = `${parentCmd.name()} ${parentCmdNames}`;
    }
    return `${parentCmdNames}${cmdName} ${cmd.usage()}`;
  }
  /**
   * Get the description for the command.
   */
  commandDescription(cmd: Command): string {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }
  /**
   * Get the command description to show in the list of subcommands.
   */
  subcommandDescription(cmd: Command): string {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }
  /**
   * Get the option description to show in the list of options.
   */
  optionDescription(option: Option): string {
    if (option.negate) return option.description;
    const extraInfo = [];
    if (option.argChoices) {
      extraInfo.push(`choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (option.defaultValue !== undefined) {
      extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
    }
    if (extraInfo.length > 0) return `${option.description} (${extraInfo.join(', ')})`;
    return option.description;
  }
  /**
   * Get the argument description to show in the list of arguments.
   */
  argumentDescription(argument: Argument): string {
    const extraInfo = [];
    if (argument.argChoices) {
      extraInfo.push(`choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (argument.defaultValue !== undefined) {
      extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
    }
    if (extraInfo.length > 0) {
      const extraDescripton = `(${extraInfo.join(', ')})`;
      if (argument.description) return `${argument.description} ${extraDescripton}`;
      return extraDescripton;
    }
    return argument.description;
  }
  /**
   * Generate the built-in help text.
   */
  formatHelp(cmd: Command, helper: Help): string {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth || 80;
    const itemIndentWidth = 2;
    const itemSeparatorWidth = 2; // between term and description
    const formatItem = (term: any, description: any) => {
      if (description) {
        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
      }
      return term;
    };
    const formatList = (textArray: any[]) => textArray.join('\n').replace(/^/gm, ' '.repeat(itemIndentWidth));
    // Usage
    let output = [`Usage: ${helper.commandUsage(cmd)}`, ''];
    // Description
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) output = output.concat([commandDescription, '']);
    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
    });
    if (argumentList.length > 0) output = output.concat(['Arguments:', formatList(argumentList), '']);
    // Options
    const optionList = helper.visibleOptions(cmd).map((option) => formatItem(helper.optionTerm(option), helper.optionDescription(option)));
    if (optionList.length > 0) output = output.concat(['Options:', formatList(optionList), '']);
    // Commands
    const commandList = helper.visibleCommands(cmd).map((cmd) => formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd)));
    if (commandList.length > 0) output = output.concat(['Commands:', formatList(commandList), '']);
    return output.join('\n');
  }
  /**
   * Calculate the pad width from the maximum term length.
   */
  padWidth(cmd: Command, helper: Help): number {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper)
    );
  }
  /**
   * Wrap the given string to width characters per line, with lines after the first indented.
   * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
   */
  wrap(str: string, width: number, indent: number, minColumnWidth = 40): string {
    // Detect manually wrapped and indented strings by searching for line breaks
    // followed by multiple spaces/tabs.
    if (str.match(/[\n]\s+/)) return str;
    // Do not wrap if not enough room for a wrapped column of text (as could end up with a word per line).
    const columnWidth = width - indent;
    if (columnWidth < minColumnWidth) return str;
    const leadingStr = str.substr(0, indent);
    const columnText = str.substr(indent);
    const indentString = ' '.repeat(indent);
    const regex = new RegExp(`.{1,${columnWidth - 1}}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)`, 'g');
    const lines = columnText.match(regex) || [];
    return leadingStr + lines.map((line, i) => {
      if (line.slice(-1) === '\n') line = line.slice(0, line.length - 1);
      return ((i > 0) ? indentString : '') + line.trimRight();
    }).join('\n');
  }
}

export { Help };