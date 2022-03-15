import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("approve", "Give permission for third side")
  .addParam("spenderAddress", "Third side address")
  .addParam("value", "Value of tokens")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { spenderAddress, value } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const Token: Contract = await ethers.getContractAt("Token", parsedAddress.address);

      await Token.approve(spenderAddress, value);
    }
  });
