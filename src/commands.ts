import {
  longCommand,
  printMarketOrderHelp,
  shortCommand,
} from "./commands/market.command";
import {
  closePositionCommand,
  closePositionHelp,
  increasePositionCommand,
  printManagePositionHelp,
  reducePositionCommand,
} from "./commands/position.command";

import { Commands, type Command } from "~/types";

export const DEFAULT_CLI_COMMANDS: Command[] = [
  {
    method: Commands.Long,
    alias: Commands.LongAlias,
    description: "Execute a long/buy order",
    help: printMarketOrderHelp(Commands.Long),
    exec: longCommand,
  },
  {
    method: Commands.Short,
    alias: Commands.ShortAlias,
    description: "Execute a short/sell order",
    help: printMarketOrderHelp(Commands.Short),
    exec: shortCommand,
  },
  {
    method: Commands.Close,
    description: "Close a position",
    help: closePositionHelp,
    exec: closePositionCommand,
  },
  {
    method: Commands.Increase,
    description: "Increase a position",
    help: printManagePositionHelp("increase"),
    exec: increasePositionCommand,
  },
  {
    method: Commands.Reduce,
    description: "Reduce a position",
    help: printManagePositionHelp("reduce"),
    exec: reducePositionCommand,
  },
];
