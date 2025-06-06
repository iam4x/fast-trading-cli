import { printBalanceCommand } from "./commands/balance.command";
import {
  longCommand,
  printMarketOrderHelp,
  shortCommand,
} from "./commands/market.command";
import {
  cancelOrderCommand,
  cancelOrderHelp,
  limitOrderCommand,
  limitOrderHelp,
} from "./commands/order.command";
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
    method: Commands.Balance,
    description: "Print the balance of accounts",
    exec: printBalanceCommand,
  },
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
  {
    method: Commands.Order,
    description: "Place a limit order",
    alias: Commands.OrderAlias,
    help: limitOrderHelp,
    exec: limitOrderCommand,
  },
  {
    method: Commands.CancelOrder,
    alias: Commands.CancelOrderAlias,
    description: "Cancel one or multiple orders",
    help: cancelOrderHelp,
    exec: cancelOrderCommand,
  },
];
