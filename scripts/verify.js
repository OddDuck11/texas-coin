const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the contract address from command line args or deployment file
  const contractAddress = process.argv[2];

  if (!contractAddress) {
    console.error("❌ Please provide the contract address as an argument");
    console.log("Usage: npx hardhat run scripts/verify.js --network <network> <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔍 Verifying Texas Coin Contract on Etherscan`);
  console.log(`${"=".repeat(60)}\n`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${hre.network.name}\n`);

  try {
    // Verify the contract on Etherscan
    // No constructor arguments for TexasCoin
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log(`\n✅ Contract verified successfully on Etherscan!`);
    console.log(`${"=".repeat(60)}\n`);

  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log(`\n✅ Contract is already verified on Etherscan!`);
      console.log(`${"=".repeat(60)}\n`);
    } else {
      console.error(`\n❌ Verification failed:`, error.message);
      console.log(`\nNote: You need to set ETHERSCAN_API_KEY in your .env file`);
      console.log(`Get your API key from: https://etherscan.io/myapikey`);
      console.log(`${"=".repeat(60)}\n`);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
