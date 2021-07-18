import { InvalidArgumentError } from './error.js';

class Argument {
  public description: string;
  public required: boolean;
  public variadic = false;
  public parseArg: (((arg: string, previous: any) => any)|undefined) = undefined;
  public defaultValue: any = undefined;
  public defaultValueDescription: (string|undefined) = undefined;
  public argChoices: string[] = [];
  public _name: string;
  /**
   * Initialize a new command argument with the given name and description.
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   */
  constructor(name: string, description?: string) {
    this.description = description || '';
    if (name[0] == '<' || name[0] == '[') {
      this.required = (name[0] == '<');
      this._name = name.slice(1, -1);
    } else {
      this.required = true;
      this._name = name;
    }
    if (this._name.length > 3 && this._name.slice(-3) === '...') {
      this.variadic = true;
      this._name = this._name.slice(0, -3);
    }
  }
  /**
   * Return argument name.
   */
  name(): string {
    return this._name;
  }
  private _concatValue(value: any, previous: any) {
    if (previous === this.defaultValue || !Array.isArray(previous)) return [value];
    return previous.concat(value);
  }
  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   */
  default(value: (value: string, previous: any) => any, description?: string): Argument {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }
  /**
   * Set the custom handler for processing CLI command arguments into argument values.
   */
  argParser(fn: <T>(value: string, previous: T) => T): Argument {
    this.parseArg = fn;
    return this;
  }
  /**
   * Only allow option value to be one of choices.
   */
  choices(values: string[]): Argument {
    this.argChoices = values;
    this.parseArg = (arg, previous) => {
      if (!values.includes(arg)) {
        throw new InvalidArgumentError(`Allowed choices are ${values.join(', ')}.`);
      }
      if (this.variadic) return this._concatValue(arg, previous);
      return arg;
    };
    return this;
  }
}
/**
 * Takes an argument and returns its human readable equivalent for help usage.
 */
const humanReadableArgName = (arg: Argument): string => {
  const nameOutput = `${arg.name()}${arg.variadic ? '...' : ''}`;
  return arg.required ? `<${nameOutput}>` : `[${nameOutput}]`;
};
export { Argument, humanReadableArgName };