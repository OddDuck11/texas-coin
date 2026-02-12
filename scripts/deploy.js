const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Status file for website to poll
const STATUS_FILE = path.join(__dirname, "../deployment-status.json");

function updateStatus(step, message, data = {}) {
  const status = {
    step,
    message,
    timestamp: new Date().toISOString(),
    ...data
  };
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📍 STEP ${step}: ${message}`);
  console.log(`${"=".repeat(60)}\n`);
}

async function main() {
  try {
    // Step 1: Get deployer account
    updateStatus(1, "Getting deployer account...");
    const [deployer] = await hre.ethers.getSigners();
    const deployerAddress = await deployer.getAddress();

    console.log(`Deployer address: ${deployerAddress}`);

    // Step 2: Check balance
    updateStatus(2, "Checking deployer balance...");
    const balance = await hre.ethers.provider.getBalance(deployerAddress);
    const balanceInEth = hre.ethers.formatEther(balance);

    console.log(`Balance: ${balanceInEth} ETH`);

    if (balance === 0n) {
      throw new Error("Deployer account has no ETH! Please fund the account first.");
    }

    // Step 3: Get network info
    const network = await hre.ethers.provider.getNetwork();
    console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);

    // Step 4: Deploy contract
    updateStatus(3, "Deploying Texas Coin contract...", {
      deployer: deployerAddress,
      network: network.name,
      chainId: Number(network.chainId)
    });

    const TexasCoin = await hre.ethers.getContractFactory("TexasCoin");
    const texasCoin = await TexasCoin.deploy();

    console.log(`Transaction sent: ${texasCoin.deploymentTransaction().hash}`);

    // Step 5: Wait for deployment
    updateStatus(4, "Waiting for deployment confirmation...", {
      transactionHash: texasCoin.deploymentTransaction().hash
    });

    await texasCoin.waitForDeployment();
    const contractAddress = await texasCoin.getAddress();

    console.log(`✅ Texas Coin deployed to: ${contractAddress}`);

    // Step 6: Verify deployment
    updateStatus(5, "Verifying contract deployment...", {
      contractAddress,
      transactionHash: texasCoin.deploymentTransaction().hash
    });

    // Get token details
    const name = await texasCoin.name();
    const symbol = await texasCoin.symbol();
    const decimals = await texasCoin.decimals();
    const totalSupply = await texasCoin.totalSupply();
    const deployerBalance = await texasCoin.balanceOf(deployerAddress);

    console.log(`\nToken Details:`);
    console.log(`- Name: ${name}`);
    console.log(`- Symbol: ${symbol}`);
    console.log(`- Decimals: ${decimals}`);
    console.log(`- Total Supply: ${hre.ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
    console.log(`- Deployer Balance: ${hre.ethers.formatUnits(deployerBalance, decimals)} ${symbol}`);

    // Step 7: Deployment complete
    updateStatus(6, "Deployment successful! 🚀", {
      contractAddress,
      transactionHash: texasCoin.deploymentTransaction().hash,
      deployer: deployerAddress,
      network: network.name,
      chainId: Number(network.chainId),
      token: {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: hre.ethers.formatUnits(totalSupply, decimals)
      },
      blockExplorer: network.chainId === 1n
        ? `https://etherscan.io/address/${contractAddress}`
        : network.chainId === 11155111n
        ? `https://sepolia.etherscan.io/address/${contractAddress}`
        : `https://etherscan.io/address/${contractAddress}`
    });

    // Save deployment data to file
    const deploymentData = {
      network: network.name,
      chainId: Number(network.chainId),
      contractAddress,
      deployer: deployerAddress,
      transactionHash: texasCoin.deploymentTransaction().hash,
      timestamp: new Date().toISOString(),
      token: {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: hre.ethers.formatUnits(totalSupply, decimals)
      }
    };

    const deploymentFile = path.join(__dirname, `../deployments/${network.name}-deployment.json`);
    fs.mkdirSync(path.dirname(deploymentFile), { recursive: true });
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));

    console.log(`\n✅ Deployment data saved to: ${deploymentFile}`);
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🎉 TEXAS COIN IS LIVE!`);
    console.log(`${"=".repeat(60)}`);
    console.log(`\nContract Address: ${contractAddress}`);
    console.log(`Block Explorer: ${deploymentData.blockExplorer}`);
    console.log(`\nNext steps:`);
    console.log(`1. Verify contract on Etherscan: npx hardhat verify --network ${network.name} ${contractAddress}`);
    console.log(`2. Add token to MetaMask using contract address`);
    console.log(`3. Share with TBA members!`);
    console.log(`${"=".repeat(60)}\n`);

  } catch (error) {
    updateStatus(-1, `Deployment failed: ${error.message}`, {
      error: error.message
    });
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
