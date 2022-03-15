import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("transferFrom", "Transfer value from sender to receiver by third side")
  .addParam("senderAddress", "Sender address")
  .addParam("receiverAddress", "Receiver address")
  .addParam("value", "Value of tokens")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { senderAddress, receiverAddress, value } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const Token: Contract = await ethers.getContractAt("Token", parsedAddress.address);

      await Token.transferFrom(senderAddress, receiverAddress, value);
    }
  });
