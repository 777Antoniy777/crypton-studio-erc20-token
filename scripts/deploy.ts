import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { saveContractAddress } from "../utils/save-contract-address";

const main = async (): Promise<void> => {
  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Token: ContractFactory = await ethers.getContractFactory("Token");
  const tokenContract: Contract = await Token.deploy(1000);

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
