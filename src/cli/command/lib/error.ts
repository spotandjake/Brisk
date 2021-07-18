class CommanderError extends Error {
  private code: string;
  private exitCode: number;
  public nestedError: any = undefined;
  constructor(exitCode: number, code: string, message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
  }
}
class InvalidArgumentError extends CommanderError {
  constructor(message: string) {
    super(1, 'brisk.invalidArgument', message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}
export { CommanderError, InvalidArgumentError };