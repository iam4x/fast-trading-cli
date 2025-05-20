import { FastTradingApi } from "fast-trading-api";
import { times } from "fast-trading-api/utils";

import {
  Commands,
  Severity,
  type Command,
  type ExecArgs,
  type OnMessage,
} from "./types";
import { splitCommands } from "./utils/split-commands.utils";

export class CLI {
  api: FastTradingApi;
  commands: Command[];
  onMessage: OnMessage;

  constructor({
    api,
    commands,
    onMessage,
  }: {
    api: FastTradingApi;
    commands: Command[];
    onMessage: OnMessage;
  }) {
    this.api = api;
    this.commands = commands;
    this.onMessage = onMessage;
  }

  run(value: string) {
    for (const command of splitCommands(value)) {
      this._executeCommand(this._parseCommand(command));
    }
  }

  _parseCommand(value: string): ExecArgs {
    const cmd = value.trim();
    const [method, ...args] = cmd.split(" ");

    const isSubMethodHelp = args.includes("--help") || args.includes("-h");

    return {
      value,
      method,
      isSubMethodHelp,
      args,
    };
  }

  _executeCommand({ value, method, isSubMethodHelp, args }: ExecArgs) {
    for (const command of this.commands) {
      if (
        command.method === method ||
        ("alias" in command && command.alias === method)
      ) {
        if (isSubMethodHelp && "help" in command) {
          return this.onMessage(
            command.help ?? `No help available for ${method}`,
            Severity.Info,
          );
        } else {
          return command.exec({
            args,
            onMessage: this.onMessage,
            api: this.api,
          });
        }
      }
    }

    if (method === Commands.Help || method === Commands.HelpAlias) {
      const commandsList = this.commands
        .map((c) => {
          const spaces = times(
            20 - (c.method.length + (c.alias ? 3 : 0)),
            () => " ",
          );

          return `${c.method}${c.alias ? `, ${c.alias}` : ""}${c.description ? `${spaces.join("")}${c.description}` : ""}`;
        })
        .join("\n  ");

      const help = `
Available Commands:
  ${commandsList}

Chain commands:
  You can execute multiple commands by separating them with a semicolon (;)
  Example: command1 arg1 arg2; command2 arg1 arg2

Flags:
  -h, --help      Help for commands
      `;

      return this.onMessage(help, Severity.Info);
    }

    const error = `
Command not found: ${value}
To see a list of supported commans, run: help
    `;

    this.onMessage(error, Severity.Error);
  }
}
