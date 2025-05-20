import type { FastTradingApi } from "fast-trading-api";

export enum Severity {
  Warning = "warning",
  Error = "error",
  Info = "info",
}

export interface ExecArgs {
  value: string;
  method: string;
  isSubMethodHelp: boolean;
  args: string[];
}

export type OnMessage = (message: string, severity: Severity) => void;

export interface ExecParams {
  api: FastTradingApi;
  args: string[];
  onMessage: OnMessage;
}

export interface Command {
  method: string;
  description?: string;
  alias?: string;
  help?: string;
  exec: (cmd: ExecParams) => Promise<void> | void;
}

export enum Commands {
  Help = "help",
  HelpAlias = "h",
  Long = "long",
  LongAlias = "l",
  Short = "short",
  ShortAlias = "s",
  Close = "close",
  Increase = "increase",
  Reduce = "reduce",
  Order = "order",
  OrderAlias = "o",
  CancelOrder = "cancel",
  CancelOrderAlias = "x",
}
