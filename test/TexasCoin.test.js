const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TexasCoin", function () {
  let texasCoin;
  let owner;
  let addr1;
  let addr2;

  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18); // 1 million tokens

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const TexasCoin = await ethers.getContractFactory("TexasCoin");
    texasCoin = await TexasCoin.deploy();
    await texasCoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name", async function () {
      expect(await texasCoin.name()).to.equal("Texas Coin");
    });

    it("Should set the correct symbol", async function () {
      expect(await texasCoin.symbol()).to.equal("TEXAS");
    });

    it("Should set the correct decimals", async function () {
      expect(await texasCoin.decimals()).to.equal(18);
    });

    it("Should mint initial supply to the owner", async function () {
      const ownerBalance = await texasCoin.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the total supply correctly", async function () {
      const totalSupply = await texasCoin.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the deployer as owner", async function () {
      expect(await texasCoin.owner()).to.equal(owner.address);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("1000", 18);

      // Transfer from owner to addr1
      await texasCoin.transfer(addr1.address, transferAmount);
      expect(await texasCoin.balanceOf(addr1.address)).to.equal(transferAmount);

      // Transfer from addr1 to addr2
      await texasCoin.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await texasCoin.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await texasCoin.balanceOf(addr1.address)).to.equal(0);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await texasCoin.balanceOf(owner.address);
      const excessiveAmount = initialOwnerBalance + 1n;

      await expect(
        texasCoin.connect(addr1).transfer(owner.address, excessiveAmount)
      ).to.be.reverted;
    });

    it("Should update balances after transfers", async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      const initialOwnerBalance = await texasCoin.balanceOf(owner.address);

      await texasCoin.transfer(addr1.address, transferAmount);
      await texasCoin.transfer(addr2.address, transferAmount);

      const finalOwnerBalance = await texasCoin.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - (transferAmount * 2n));

      const addr1Balance = await texasCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);

      const addr2Balance = await texasCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should emit Transfer event", async function () {
      const transferAmount = ethers.parseUnits("50", 18);

      await expect(texasCoin.transfer(addr1.address, transferAmount))
        .to.emit(texasCoin, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });
  });

  describe("Allowances", function () {
    it("Should approve and check allowance", async function () {
      const approveAmount = ethers.parseUnits("500", 18);

      await texasCoin.approve(addr1.address, approveAmount);
      expect(await texasCoin.allowance(owner.address, addr1.address)).to.equal(approveAmount);
    });

    it("Should transfer tokens using transferFrom", async function () {
      const transferAmount = ethers.parseUnits("100", 18);

      // Owner approves addr1 to spend tokens
      await texasCoin.approve(addr1.address, transferAmount);

      // addr1 transfers from owner to addr2
      await texasCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);

      expect(await texasCoin.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if trying to transfer more than allowance", async function () {
      const approveAmount = ethers.parseUnits("100", 18);
      const transferAmount = ethers.parseUnits("200", 18);

      await texasCoin.approve(addr1.address, approveAmount);

      await expect(
        texasCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount)
      ).to.be.reverted;
    });

    it("Should emit Approval event", async function () {
      const approveAmount = ethers.parseUnits("250", 18);

      await expect(texasCoin.approve(addr1.address, approveAmount))
        .to.emit(texasCoin, "Approval")
        .withArgs(owner.address, addr1.address, approveAmount);
    });
  });

  describe("Supply", function () {
    it("Should have fixed supply (no minting)", async function () {
      const totalSupply = await texasCoin.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);

      // Transfer some tokens
      await texasCoin.transfer(addr1.address, ethers.parseUnits("1000", 18));

      // Total supply should remain the same
      const newTotalSupply = await texasCoin.totalSupply();
      expect(newTotalSupply).to.equal(INITIAL_SUPPLY);
    });

    it("Should not allow burning (no burn function)", async function () {
      // TexasCoin doesn't have a burn function
      // This test just verifies the interface
      expect(texasCoin.burn).to.be.undefined;
    });
  });

  describe("ERC-20 Compliance", function () {
    it("Should return correct balance of account", async function () {
      const balance = await texasCoin.balanceOf(owner.address);
      expect(balance).to.equal(INITIAL_SUPPLY);

      const zeroBalance = await texasCoin.balanceOf(addr1.address);
      expect(zeroBalance).to.equal(0);
    });

    it("Should return correct total supply", async function () {
      expect(await texasCoin.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should handle zero address checks", async function () {
      await expect(
        texasCoin.transfer(ethers.ZeroAddress, ethers.parseUnits("1", 18))
      ).to.be.reverted;
    });
  });
});
