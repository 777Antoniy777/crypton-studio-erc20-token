import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import fs from "fs";

const saveContractAddress = (contract: Contract): void => {
  const contractsDir = __dirname + "/../contracts";

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ address: contract.address }, undefined, 2)
  );
};

const main = async (): Promise<void> => {
  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Token: ContractFactory = await ethers.getContractFactory("Token");
  const tokenContract: Contract = await Token.deploy();

  await tokenContract.deployed();
  console.log("Contract address:", tokenContract.address);

  saveContractAddress(tokenContract);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
