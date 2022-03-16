import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("approve", "Give permission for third side")
  .addParam("spender", "Third side address")
  .addParam("value", "Value of tokens")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { spender, value } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const Token: Contract = await ethers.getContractAt("Token", parsedAddress.address);

      await Token.approve(spender, value);
    }
  });
