import { PositionSide, OrderSide, OrderType } from "fast-trading-api/types";

import {
  checkAccount,
  checkPercent,
  checkPosition,
  checkSymbol,
} from "~/checks";
import { Commands, type ExecParams } from "~/types";
import { capitalize } from "~/utils/capitalize.utils";

export const closePositionCommand = ({ api, onMessage, args }: ExecParams) => {
  const [accountId, symbol] = args;

  const account = checkAccount({ accountId, api, onMessage });
  if (!account) return;

  if (symbol === "all") {
    const orders = api.store.memory[account.exchange].private[
      account.id
    ].positions
      .filter((p) => p.contracts > 0)
      .map((p) => ({
        symbol: p.symbol,
        side: p.side === PositionSide.Long ? OrderSide.Sell : OrderSide.Buy,
        type: OrderType.Market,
        amount: p.contracts,
        reduceOnly: true,
      }));

    api.placeOrders({
      accountId: account.id,
      orders,
    });

    return;
  }

  const ticker = checkSymbol({ symbol, account, api, onMessage });
  if (!ticker) return;

  const position = checkPosition({ ticker, account, api, onMessage });
  if (!position) return;

  api.placeOrder({
    accountId: account.id,
    order: {
      symbol: position.symbol,
      side:
        position.side === PositionSide.Long ? OrderSide.Sell : OrderSide.Buy,
      type: OrderType.Market,
      amount: position.contracts,
      reduceOnly: true,
    },
  });
};

export const increasePositionCommand = ({
  api,
  onMessage,
  args,
}: ExecParams) => {
  const [accountId, symbol, percentStr] = args;

  const account = checkAccount({ accountId, api, onMessage });
  if (!account) return;

  const percent = checkPercent({ percentStr, onMessage });
  if (!percent) return;

  if (symbol === "all") {
    const orders = api.store.memory[account.exchange].private[
      account.id
    ].positions
      .filter((p) => p.contracts > 0)
      .map((p) => ({
        symbol: p.symbol,
        side: p.side === PositionSide.Long ? OrderSide.Buy : OrderSide.Sell,
        type: OrderType.Market,
        amount: p.contracts * (percent / 100),
        reduceOnly: false,
      }));

    api.placeOrders({
      accountId: account.id,
      orders,
    });

    return;
  }

  const ticker = checkSymbol({ symbol, account, api, onMessage });
  if (!ticker) return;

  const position = checkPosition({ ticker, account, api, onMessage });
  if (!position) return;

  api.placeOrder({
    accountId: account.id,
    order: {
      symbol: position.symbol,
      side:
        position.side === PositionSide.Long ? OrderSide.Buy : OrderSide.Sell,
      type: OrderType.Market,
      amount: position.contracts * (percent / 100),
      reduceOnly: false,
    },
  });
};

export const reducePositionCommand = ({ api, onMessage, args }: ExecParams) => {
  const [accountId, symbol, percentStr] = args;

  const account = checkAccount({ accountId, api, onMessage });
  if (!account) return;

  const percent = checkPercent({ percentStr, onMessage });
  if (!percent) return;

  if (symbol === "all") {
    const orders = api.store.memory[account.exchange].private[
      account.id
    ].positions
      .filter((p) => p.contracts > 0)
      .map((p) => ({
        symbol: p.symbol,
        side: p.side === PositionSide.Long ? OrderSide.Sell : OrderSide.Buy,
        type: OrderType.Market,
        amount: p.contracts * (percent / 100),
        reduceOnly: true,
      }));

    api.placeOrders({
      accountId: account.id,
      orders,
    });

    return;
  }

  const ticker = checkSymbol({ symbol, account, api, onMessage });
  if (!ticker) return;

  const position = checkPosition({ ticker, account, api, onMessage });
  if (!position) return;

  api.placeOrder({
    accountId: account.id,
    order: {
      symbol: position.symbol,
      side:
        position.side === PositionSide.Long ? OrderSide.Sell : OrderSide.Buy,
      type: OrderType.Market,
      amount: position.contracts * (percent / 100),
      reduceOnly: true,
    },
  });
};

export const closePositionHelp = `
Close a position

Usage:
  ${Commands.Close} [accountId] [symbol | all]

Examples:
  ${Commands.Close} main btc
  ${Commands.Close} sub all
`;

export const printManagePositionHelp = (verb: string) => {
  return `
${capitalize(verb)} a position

Usage:
  ${verb} [accountId] [symbol | all] [percentage]

Examples:
  ${verb} main btc 50%
  ${verb} sub eth 25%
  ${verb} main all 10%
  `;
};
