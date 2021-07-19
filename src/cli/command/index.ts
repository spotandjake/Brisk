// Types
interface Command {
  name: string;
  syntax: (string|string[]);
  description: string;
  action: (commands: Command[], options: string[], args: any) => (void|Promise<void>);
}
interface compiledCommand {
  name: string;
  match: RegExp;
  action: (commands: Command[], options: string[], args: { [key: string]: string }) => (any|Promise<any>);
}
// Commander
const Commander = (commands: Command[]): ((args: string[]) => void) => {
  // TODO: add options in
  const compiledCommands: compiledCommand[] = [];
  // Compile the commands
  commands.forEach((command: Command) => {
    let match = '';
    const compile = (syntax: string) => 
      syntax.replace(/<(?<name>[^ <>\n]+)>/g, '(?<$<name>>[^ ]+)').replace(/ ?\[(?<name>[^ [\]\n]+)\]/g, '( (?<$<name>>[^ \n]+))?');
    if (Array.isArray(command.syntax)) match = command.syntax.map(syntax => `(${compile(syntax)})`).join('|');
    else match = compile(command.syntax);
    compiledCommands.push({ name: command.name, match: new RegExp(`^${match}`), action: command.action });
  });
  // Compile the options
  // return a function that can parse and match
  const parse = (args: string[]): void => {
    // Shift off node part and the file part
    const cliArgs = args.slice(2).join(' ');
    // Match command
    const matches = compiledCommands.map(command => ({ name: command.name, match: command.match.exec(cliArgs), command: command }));
    let matchCmd: { name: (string|null); match: (RegExpExecArray|null); length: number, command?: compiledCommand } = {
      name: null,
      match: null,
      length: 0
    };
    matches.forEach(({ name, match, command }) => {
      if (match && match[0].length > matchCmd.length)
        matchCmd = { name: name, match: match, length: match[0].length, command: command };
    });
    if (matchCmd.name == null) {
      console.log('the command you entered is not valid try -h for help');
    } else {
      //@ts-ignore
      matchCmd.command.action(commands, [], matchCmd.match?.groups);
    }
    return;
  };
  return parse;
};
// Exports
export default Commander;
export {
  Commander,
  Command
};