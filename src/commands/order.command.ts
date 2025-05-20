import { OrderSide, PositionSide, OrderType } from "fast-trading-api/types";

import {
  checkAccount,
  checkPercent,
  checkPosition,
  checkPrice,
  checkSide,
  checkSymbol,
  checkUSDAmount,
} from "~/checks";
import { Commands, Severity, type ExecParams } from "~/types";

export const limitOrderCommand = ({ api, onMessage, args }: ExecParams) => {
  const [accountId, symbol, sideStr, amountStr, priceStr, reduceOnly] = args;

  const account = checkAccount({ accountId, api, onMessage });
  if (!account) return;

  const ticker = checkSymbol({ symbol, account, api, onMessage });
  if (!ticker) return;

  const position = checkPosition({ ticker, account, api, onMessage });
  if (!position) return;

  const side = checkSide({ sideStr, onMessage });
  if (!side) return;

  const price = checkPrice({ priceStr, onMessage });
  if (!price) return;

  if (
    reduceOnly === "true" &&
    position.side ===
      (side === OrderSide.Buy ? PositionSide.Long : PositionSide.Short)
  ) {
    onMessage(
      `Can't reduce a ${position.side} position with a ${side} order`,
      Severity.Error,
    );
    return;
  }

  if (amountStr.endsWith("%") && reduceOnly !== "true") {
    onMessage("Can't use % for amount when not reduceOnly", Severity.Error);
    return;
  }

  let amount: number;
  if (amountStr.endsWith("%")) {
    const percent = checkPercent({ percentStr: amountStr, onMessage });
    if (!percent) return;

    amount = position.contracts * (percent / 100);
  } else {
    const usdAmount = checkUSDAmount({ amountStr, onMessage, price });
    if (!usdAmount) return;

    amount = usdAmount;
  }

  api.placeOrder({
    accountId: account.id,
    order: {
      symbol: ticker.symbol,
      amount,
      type: OrderType.Limit,
      price,
      side,
      reduceOnly: reduceOnly === "true" ? true : false,
    },
  });
};

const getOrderSide = (sideString: string) => {
  return sideString === "buy" ? OrderSide.Buy : OrderSide.Sell;
};

export const cancelOrderCommand = ({ api, onMessage, args }: ExecParams) => {
  const [accountId, symbol, sideStr] = args;

  const account = checkAccount({ accountId, api, onMessage });
  if (!account) return;

  const accountOrders =
    api.store.memory[account.exchange].private[account.id].orders;

  if (sideStr && sideStr !== "buy" && sideStr !== "sell") {
    onMessage(`Invalid side: ${sideStr}`, Severity.Error);
    return;
  }

  if (symbol === "all") {
    const orders = sideStr
      ? accountOrders.filter((o) => o.side === getOrderSide(sideStr))
      : accountOrders;

    api.cancelOrders({
      accountId: account.id,
      orderIds: orders.map((o) => o.id),
    });

    return;
  }

  const ticker = checkSymbol({ symbol, account, api, onMessage });
  if (!ticker) return;

  const orders = sideStr
    ? accountOrders.filter(
        (o) => o.symbol === ticker.symbol && o.side === getOrderSide(sideStr),
      )
    : accountOrders.filter((o) => o.symbol === ticker.symbol);

  api.cancelOrders({
    accountId: account.id,
    orderIds: orders.map((o) => o.id),
  });
};

export const limitOrderHelp = `
Place a limit order

Usage:
  ${Commands.Order} [accountId] [symbol] [buy | sell] [amount] [price] [reduceOnly]

Examples:
  ${Commands.Order} main btc buy 0.1 90000
  ${Commands.Order} main btc sell $100 95000
  ${Commands.Order} sub btc sell $100 95000 true
  ${Commands.Order} sub btc sell 100% 95000 true

Alias:
  ${Commands.OrderAlias}
`;

export const cancelOrderHelp = `
Cancel orders

Usage:
  ${Commands.CancelOrder} [accountId] [symbol | all] [side]

Examples:
  ${Commands.CancelOrder} main btc
  ${Commands.CancelOrder} sub all buy

Alias:
  ${Commands.CancelOrderAlias}
`;
