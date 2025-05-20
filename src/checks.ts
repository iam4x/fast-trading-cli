import type { FastTradingApi } from "fast-trading-api";
import type { Account, Ticker } from "fast-trading-api/types";

import { Severity, type OnMessage } from "./types";
import { pFloat } from "./utils/p-float.utils";

export const checkAccount = ({
  accountId,
  api,
  onMessage,
}: {
  accountId: string;
  api: FastTradingApi;
  onMessage: OnMessage;
}) => {
  if (!accountId) {
    onMessage("Account ID is required", Severity.Error);
    return;
  }

  const account = api.accounts.find((a) => a.id === accountId);

  if (!account) {
    onMessage("Account not found", Severity.Error);
    return;
  }

  return account;
};

export const checkSymbol = ({
  symbol,
  account,
  api,
  onMessage,
}: {
  symbol: string;
  account: Account;
  api: FastTradingApi;
  onMessage: OnMessage;
}) => {
  if (!symbol) {
    onMessage("Symbol is required", Severity.Error);
    return;
  }

  const ticker = Object.values(
    api.store.memory[account.exchange].public.tickers,
  ).find(
    (t) =>
      t.symbol === symbol.toUpperCase() ||
      t.cleanSymbol === symbol.toUpperCase(),
  );

  if (!ticker) {
    onMessage(`Ticker ${symbol} not found`, Severity.Error);
    return;
  }

  return ticker;
};

export const checkUSDAmount = ({
  amountString,
  onMessage,
  ticker,
}: {
  ticker: Ticker;
  amountString: string;
  onMessage: OnMessage;
}) => {
  if (!amountString) {
    onMessage("Amount is required", Severity.Error);
    return;
  }

  let amount = pFloat(amountString.replace(/\$|k/g, ""));

  if (amountString.startsWith("$") && amountString.endsWith("k")) {
    amount = (amount * 1000) / ticker.last;
  } else if (amountString.startsWith("$")) {
    amount = amount / ticker.last;
  }

  if (isNaN(amount)) {
    onMessage(`Invalid amount: ${amountString}`, Severity.Error);
    return;
  }

  return amount;
};

export const checkPosition = ({
  ticker,
  account,
  api,
  onMessage,
}: {
  ticker: Ticker;
  account: Account;
  api: FastTradingApi;
  onMessage: OnMessage;
}) => {
  const position = api.store.memory[account.exchange].private[
    account.id
  ].positions.find((p) => p.symbol === ticker.symbol && p.contracts > 0);

  if (!position) {
    onMessage(`Position not found: ${ticker.symbol}`, Severity.Error);
    return;
  }

  return position;
};

export const checkPercent = ({
  percentString,
  onMessage,
}: {
  percentString: string;
  onMessage: OnMessage;
}) => {
  const percent = parseInt(percentString, 10);

  if (isNaN(percent)) {
    onMessage(`Invalid percentage: ${percentString}`, Severity.Error);
    return;
  }

  return percent;
};
