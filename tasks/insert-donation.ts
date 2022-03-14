import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("insertDonation", "Insert any value donation")
  .addParam("amount", "Value of donation")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { amount } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const hardhatDonation: Contract = await ethers.getContractAt("Token", parsedAddress.address);

      await hardhatDonation.insertDonation({
        value: ethers.utils.parseEther(amount),
      });
    }
  });
