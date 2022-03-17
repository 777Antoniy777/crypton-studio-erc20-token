import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("mint", "Mint new tokens count")
  .addParam("owner", "Owner address")
  .addParam("amount", "Minting amount")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { owner, amount } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const Token: Contract = await ethers.getContractAt("Token", parsedAddress.address);

      await Token.mint(owner, amount);
    }
  });