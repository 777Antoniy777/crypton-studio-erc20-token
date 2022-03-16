import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "hardhat-deploy";
import "solidity-coverage";
import "@typechain/hardhat";

import { HardhatUserConfig } from "hardhat/config";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const { FIRST_PRIVATE_KEY, SECOND_PRIVATE_KEY, ALCHEMY_API_KEY, ETHERSCAN_API_KEY } = process.env;

// задачи
import "./tasks/transfer";
import "./tasks/approve";
import "./tasks/transfer-from";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [FIRST_PRIVATE_KEY || "", SECOND_PRIVATE_KEY || ""],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
