import { InvalidArgumentError } from './error';

const camelcase = (str: string): string => str.split('-').reduce((str, word) => `${str}${word[0].toUpperCase()}${word.slice(1)}`);
const splitOptionFlags = (flags: string) => {
  let shortFlag;
  // Use original very loose parsing to maintain backwards compatibility for now,
  // which allowed for example unintended `-sw, --short-word` [sic].
  const flagParts = flags.split(/[ |,]+/);
  if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
  let longFlag: (string|undefined) = <string>flagParts.shift();
  // Add support for lone short flag without significantly changing parsing!
  if (!shortFlag && /^-[^-]$/.test(longFlag)) {
    shortFlag = longFlag;
    longFlag = undefined;
  }
  return { shortFlag, longFlag };
};
//  Option
class Option {
  public flags: string;
  public description: string;
  public required: boolean; // A value must be supplied when the option is specified.
  public optional: boolean; // A value is optional when the option is specified.
  public variadic: boolean;
  public mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
  public optionFlags = '';
  public short?: string;
  public long?: string;
  public negate: boolean;
  public defaultValue?: any = undefined;
  public defaultValueDescription?: string = undefined;
  public parseArg?: (value: string, previous: any) => any = undefined;
  public hidden = false;
  public argChoices?: string[] = undefined;
  constructor(flags: string, description?: string) {
    this.flags = flags;
    this.description = description || '';
    this.required = flags.includes('<'); // A value must be supplied when the option is specified.
    this.optional = flags.includes('['); // A value is optional when the option is specified.
    // variadic test ignores <value,...> et al which might be used to describe custom splitting of single argument
    this.variadic = /\w\.\.\.[>\]]$/.test(flags); // The option can take multiple values.
    const optionFlags = splitOptionFlags(flags);
    this.short = optionFlags.shortFlag;
    this.long = optionFlags.longFlag;
    this.negate = this.long ? this.long.startsWith('--no-') : false;
  }
  default(value: any, description?: string): Option {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }
  argParser(fn: (value: string, previous: any) => any): Option {
    this.parseArg = fn;
    return this;
  }
  makeOptionMandatory(mandatory = true): Option {
    this.mandatory = !!mandatory;
    return this;
  }
  hideHelp(hide = true): Option {
    this.hidden = !!hide;
    return this;
  }
  _concatValue(value: any, previous: any) {
    return (previous === this.defaultValue || !Array.isArray(previous)) ? [value] : previous.concat(value);
  }
  choices(values: string[]): Option {
    this.argChoices = values;
    this.parseArg = (arg, previous) => {
      if (!values.includes(arg)) {
        throw new InvalidArgumentError(`Allowed choices are ${values.join(', ')}.`);
      }
      return this.variadic ? this._concatValue(arg, previous) : arg;
    };
    return this;
  }
  name(): string {
    //@ts-ignore
    return this.long ? this.long.replace(/^--/, '') : this.short.replace(/^-/, '');
  }
  attributeName(): string {
    return camelcase(this.name().replace(/^no-/, ''));
  }
  is(arg: string): boolean {
    return this.short === arg || this.long === arg;
  }
}

export { Option, splitOptionFlags };