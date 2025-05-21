import { PositionSide } from "fast-trading-api/types";
import { sumBy, toUSD } from "fast-trading-api/utils";

import { Severity, type ExecParams } from "~/types";

export const printBalanceCommand = ({ api, onMessage }: ExecParams) => {
  let total = 0;
  let free = 0;
  let upnl = 0;
  let totalLongExposure = 0;
  let totalShortExposure = 0;

  for (const account of api.accounts) {
    const balance =
      api.store.memory[account.exchange].private[account.id].balance;
    const positions =
      api.store.memory[account.exchange].private[account.id].positions;

    const longExposure = sumBy(
      positions.filter((p) => p.side === PositionSide.Long),
      (p) => p.notional,
    );

    const shortExposure = sumBy(
      positions.filter((p) => p.side === PositionSide.Short),
      (p) => p.notional,
    );

    const upnlPercent = (balance.upnl / balance.total) * 100;
    const accountLeverage = (longExposure + shortExposure) / balance.total;

    total += balance.total;
    free += balance.free;
    upnl += balance.upnl;
    totalLongExposure += longExposure;
    totalShortExposure += shortExposure;

    const accountBalance = `
${account.id} (${account.exchange})

Balance: $${toUSD(balance.total)}
Free margin: $${toUSD(balance.free)}
Unrealized PNL: $${toUSD(balance.upnl)} (${upnlPercent.toFixed(2)}%)

Long exposure: $${toUSD(longExposure)}
Short exposure: $${toUSD(shortExposure)}

Account leverage: ${accountLeverage.toFixed(2)}x
-------------------------
    `;

    onMessage(accountBalance, Severity.Info);
  }

  if (api.accounts.length > 1) {
    const totalUpnlPercent = (upnl / total) * 100;
    const totalLeverage = (totalLongExposure + totalShortExposure) / free;

    const totalBalance = `
All accounts combined

Total: $${toUSD(total)}
Free margin: $${toUSD(free)}
Unrealized PNL: $${toUSD(upnl)} (${totalUpnlPercent.toFixed(2)}%)

Long exposure: $${toUSD(totalLongExposure)}
Short exposure: $${toUSD(totalShortExposure)}

Total leverage: ${totalLeverage.toFixed(2)}x
    `;

    onMessage(totalBalance, Severity.Info);
  }
};
