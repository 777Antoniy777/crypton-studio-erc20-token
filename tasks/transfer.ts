import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("transfer", "Transfer value to receiver address")
  .addParam("receiverAddress", "Receiver address")
  .addParam("value", "Value of tokens")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { receiverAddress, value } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const Token: Contract = await ethers.getContractAt("Token", parsedAddress.address);

      await Token.transfer(receiverAddress, value);
    }
  });