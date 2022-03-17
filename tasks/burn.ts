import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("burn", "Burn some tokens count")
  .addParam("owner", "Owner address")
  .addParam("amount", "Burning amount")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { owner, amount } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const Token: Contract = await ethers.getContractAt("Token", parsedAddress.address);

      await Token.burn(owner, amount);
    }
  });
