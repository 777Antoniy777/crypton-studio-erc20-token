import { ethers } from "hardhat";
import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Donation__factory, Donation } from "../typechain";

describe("Donation contract", () => {
  let Donation: Donation__factory;
  let hardhatDonation: Donation;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async () => {
    Donation = (await ethers.getContractFactory("Donation")) as Donation__factory;
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatDonation = await Donation.deploy();
    await hardhatDonation.deployed();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await hardhatDonation.owner()).to.equal(owner.address);
    });
  });

  const insertDonationFromAnotherAddress = async (
    addr: SignerWithAddress = addr1,
    receivedValue: number = 10
  ): Promise<number> => {
    await hardhatDonation.connect(addr).insertDonation({ value: receivedValue });

    return receivedValue;
  };

  describe("insertDonation", () => {
    it("Should insert donation at owner address from any address", async () => {
      const value = await insertDonationFromAnotherAddress();

      const ownerBalance = await hardhatDonation.balanceOf();
      expect(ownerBalance).to.equal(value);
    });

    it("Should insert donation at allDonation map for current address", async () => {
      const value = await insertDonationFromAnotherAddress();

      const donationFromAnotherAddress = await hardhatDonation.allDonations(addr1.address);
      expect(donationFromAnotherAddress).to.equal(value);
    });

    it("Should insert donor address at donors array", async () => {
      await insertDonationFromAnotherAddress();

      const currentAddress = await hardhatDonation.donors([0]);
      expect(currentAddress).to.equal(addr1.address);
    });
  });

  describe("sendDonation", () => {
    const checkTotalBalance = async (receivedValue: number): Promise<void> => {
      const totalBalance = await hardhatDonation.balanceOf();
      expect(totalBalance).to.equal(receivedValue);
    };

    it("Should owner to send donation to any another address", async () => {
      // insert donation from addr1
      const receivedValue = await insertDonationFromAnotherAddress();
      await checkTotalBalance(receivedValue);

      // send donation from owner
      const sentValue = 5;
      await hardhatDonation.sendDonation(addr2.address, sentValue);

      // check balances
      const totalBalance = await hardhatDonation.balanceOf();
      expect(totalBalance).to.equal(receivedValue - sentValue);
    });

    it("Should reject sending donation if sender is not owner", async () => {
      // insert donation from addr1
      const receivedValue = await insertDonationFromAnotherAddress();
      await checkTotalBalance(receivedValue);

      // send donation from another address
      const sentValue = 5;
      await expect(hardhatDonation.connect(addr1).sendDonation(addr2.address, sentValue)).to.be.revertedWith(
        "You are not owner"
      );

      // check balances
      const totalBalance = await hardhatDonation.balanceOf();
      expect(totalBalance).to.equal(receivedValue);
    });

    it("Should reject sending if balance less than needle", async () => {
      // insert donation from addr1
      const receivedValue = await insertDonationFromAnotherAddress();
      await checkTotalBalance(receivedValue);

      // send donation from another address
      const sentValue = 15;
      await expect(hardhatDonation.sendDonation(addr2.address, sentValue)).to.be.revertedWith(
        "Not enough amount of ether"
      );

      // check balances
      const totalBalance = await hardhatDonation.balanceOf();
      expect(totalBalance).to.equal(receivedValue);
    });
  });

  describe("getAllDonors", () => {
    it("Should return all donors that inserted donations", async () => {
      addrs.length = 5;

      // add unique address on every iteration
      for (let value of addrs) {
        await insertDonationFromAnotherAddress(value);
      }

      // add repeated addresses for testing function
      await insertDonationFromAnotherAddress(addrs[0]);
      await insertDonationFromAnotherAddress(addrs[0]);

      const donors = await hardhatDonation.getAllDonors();
      expect(donors.length).to.equal(addrs.length);
    });
  });

  describe("getAllDonationsOfCurrentDonor", () => {
    it("Should return all donation for current donor", async () => {
      const allDonationValues = [5, 10, 15];

      for (let value of allDonationValues) {
        await insertDonationFromAnotherAddress(addr1, value);
      }

      const allDonation = await hardhatDonation.getAllDonationsOfCurrentDonor(addr1.address);
      const reducedValues = allDonationValues.reduce((acc, elem) => acc + elem);
      expect(allDonation).to.equal(reducedValues);
    });

    it("Should return 0 if no donors exist", async () => {
      const allDonation = await hardhatDonation.getAllDonationsOfCurrentDonor(addr1.address);
      expect(allDonation).to.equal(0);
    });
  });
});
