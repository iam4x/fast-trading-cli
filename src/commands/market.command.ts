import { OrderSide, OrderType } from "fast-trading-api/types";

import { checkAccount, checkSymbol, checkUSDAmount } from "~/checks";
import { type ExecParams } from "~/types";

export const longCommand = ({ api, onMessage, args }: ExecParams) => {
  const [accountId, symbol, amountString] = args;

  const account = checkAccount({ accountId, api, onMessage });
  if (!account) return;

  const ticker = checkSymbol({ symbol, account, api, onMessage });
  if (!ticker) return;

  const amount = checkUSDAmount({ amountString, onMessage, ticker });
  if (!amount) return;

  api.placeOrder({
    accountId: account.id,
    priority: true,
    order: {
      symbol: ticker.symbol,
      amount,
      type: OrderType.Market,
      side: OrderSide.Buy,
      reduceOnly: false,
    },
  });
};

export const shortCommand = ({ api, onMessage, args }: ExecParams) => {
  const [accountId, symbol, amountString] = args;

  const account = checkAccount({ accountId, api, onMessage });
  if (!account) return;

  const ticker = checkSymbol({ symbol, account, api, onMessage });
  if (!ticker) return;

  const amount = checkUSDAmount({ amountString, onMessage, ticker });
  if (!amount) return;

  api.placeOrder({
    accountId: account.id,
    priority: true,
    order: {
      symbol: ticker.symbol,
      amount,
      type: OrderType.Market,
      side: OrderSide.Sell,
      reduceOnly: false,
    },
  });
};

export const printMarketOrderHelp = (verb: "long" | "short") => {
  return `
    Execute ${verb} order

    Usage:
      ${verb} [accountId] [symbol] [amount]

    Examples:
      ${verb} sub btc 0.1
      ${verb} sub btc $500
      ${verb} main btc $100k
  `;
};
