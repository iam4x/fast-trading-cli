import type { FastTradingApi } from "fast-trading-api";
import { OrderSide, type Account, type Ticker } from "fast-trading-api/types";

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
  amountStr,
  onMessage,
  price,
}: {
  price: number;
  amountStr: string;
  onMessage: OnMessage;
}) => {
  if (!amountStr) {
    onMessage("Amount is required", Severity.Error);
    return;
  }

  let amount = pFloat(amountStr.replace(/\$|k/g, ""));

  if (amountStr.startsWith("$") && amountStr.endsWith("k")) {
    amount = (amount * 1000) / price;
  } else if (amountStr.startsWith("$")) {
    amount = amount / price;
  }

  if (isNaN(amount)) {
    onMessage(`Invalid amount: ${amountStr}`, Severity.Error);
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
  percentStr,
  onMessage,
}: {
  percentStr: string;
  onMessage: OnMessage;
}) => {
  const percent = parseInt(percentStr, 10);

  if (isNaN(percent)) {
    onMessage(`Invalid percentage: ${percentStr}`, Severity.Error);
    return;
  }

  return percent;
};

export const checkSide = ({
  sideStr,
  onMessage,
}: {
  sideStr: string;
  onMessage: OnMessage;
}) => {
  if (!sideStr) {
    onMessage("Side is required", Severity.Error);
    return;
  }

  if (sideStr !== "buy" && sideStr !== "sell") {
    onMessage(`Invalid side: ${sideStr}`, Severity.Error);
    return;
  }

  return sideStr === "buy" ? OrderSide.Buy : OrderSide.Sell;
};

export const checkPrice = ({
  priceStr,
  onMessage,
}: {
  priceStr: string;
  onMessage: OnMessage;
}) => {
  const price = pFloat(priceStr);

  if (isNaN(price)) {
    onMessage(`Invalid price: ${priceStr}`, Severity.Error);
    return;
  }

  return price;
};
