import { useCallback } from "react";
import { Principal } from "@dfinity/principal";

const getckUsdcBalance = async (ckUSDCActor, userPrincipal) => {
  try {
    const balanceResult = await ckUSDCActor?.icrc1_balance_of({
      owner: Principal.fromText(userPrincipal),
      subaccount: [],
    });

    console.log("User token balance:", {
      rawBalance: balanceResult.toString(),
      balance: Number(balanceResult) / 1000000,
    });

    return balanceResult;
  } catch (error) {
    console.error("Error getting user balance:", error);
    throw error;
  }
};

export default getckUsdcBalance;
