# Texas Coin (TEXAS)

A simple ERC-20 cryptocurrency token built on Ethereum, featuring a comprehensive web interface for deployment tracking, wallet management, and token transfers.

## Project Overview

**Texas Coin (TEXAS)** is a fixed-supply ERC-20 token with 1,000,000 total tokens. It includes:

- Smart contract deployed with OpenZeppelin standards
- Comprehensive test suite (19 tests, 100% passing)
- Automated deployment scripts with status tracking
- Modern Next.js web interface with Web3 integration
- Real-time deployment monitoring
- Wallet connection and token management

## Token Details

- **Name**: Texas Coin
- **Symbol**: TEXAS
- **Decimals**: 18
- **Total Supply**: 1,000,000 TEXAS (fixed, no minting/burning)
- **Standard**: ERC-20 (OpenZeppelin)

## Project Structure

```
texas-coin/
├── contracts/           # Solidity smart contracts
│   └── TexasCoin.sol   # Main ERC-20 token contract
├── test/               # Contract test suite
│   └── TexasCoin.test.js
├── scripts/            # Deployment and utility scripts
│   ├── deploy.js       # Main deployment script with status tracking
│   └── verify.js       # Etherscan verification script
├── website/            # Next.js frontend application
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   └── public/        # Static assets
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Project dependencies
```

## Prerequisites

- Node.js v18+ and npm
- MetaMask or another Web3 wallet
- Ethereum testnet or mainnet RPC URL (for deployment)
- Etherscan API key (for contract verification)

## Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install smart contract dependencies**:
   ```bash
   npm install
   ```

3. **Install website dependencies**:
   ```bash
   cd website
   npm install
   cd ..
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add:
   ```
   PRIVATE_KEY=your_wallet_private_key
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   MAINNET_RPC_URL=https://eth.llamarpc.com
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

## Usage

### Running Tests

Run the complete test suite:

```bash
npx hardhat test
```

Expected output: 19 passing tests covering deployment, transfers, allowances, and ERC-20 compliance.

### Local Development

1. **Start a local Hardhat node**:
   ```bash
   npx hardhat node
   ```

2. **Deploy to local network** (in another terminal):
   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```

3. **Start the website**:
   ```bash
   cd website
   npm run dev
   ```

4. **Open browser**: Navigate to `http://localhost:3000`

### Deploying to Testnet (Sepolia)

1. **Ensure you have Sepolia ETH** in your wallet for gas fees

2. **Run deployment**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Verify on Etherscan** (optional):
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

### Deploying to Mainnet

⚠️ **Warning**: Deploying to mainnet requires real ETH and is irreversible!

1. **Double-check configuration** and ensure you have sufficient ETH

2. **Run deployment**:
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

3. **Verify on Etherscan**:
   ```bash
   npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
   ```

## Website Features

The Next.js website provides:

- **Deployment Tracking**: Real-time monitoring of deployment progress
- **Token Information**: Display of token stats (name, symbol, supply)
- **Wallet Connection**: MetaMask integration via Web3
- **Balance Display**: View your TEXAS token balance
- **Transfer Function**: Send TEXAS to other addresses
- **Network Detection**: Automatic detection and validation of correct network
- **Responsive Design**: Mobile-friendly Tailwind CSS styling

### Running the Website

**Development mode**:
```bash
cd website
npm run dev
```

**Production build**:
```bash
cd website
npm run build
npm start
```

## Smart Contract Details

### TexasCoin.sol

The contract inherits from OpenZeppelin's `ERC20` and `Ownable`:

- **Constructor**: Mints 1,000,000 TEXAS to deployer
- **No Minting**: Fixed supply, no additional tokens can be created
- **No Burning**: Tokens cannot be destroyed
- **Standard ERC-20**: All standard functions (transfer, approve, transferFrom)

### Security Considerations

- Uses OpenZeppelin battle-tested contracts
- No admin functions to mint/burn tokens
- Fixed supply prevents inflation
- All transfers validated by ERC-20 standard checks

## Development

### Compile Contracts

```bash
npx hardhat compile
```

### Clean Build Artifacts

```bash
npx hardhat clean
```

### Run Specific Test

```bash
npx hardhat test --grep "Should transfer tokens"
```

## Deployment Status Tracking

The deployment script creates `deployment-status.json` which the website polls for real-time updates:

- **Step 1**: Getting deployer account
- **Step 2**: Checking balance
- **Step 3**: Deploying contract
- **Step 4**: Waiting for confirmation
- **Step 5**: Verifying deployment
- **Step 6**: Deployment complete ✅

## Troubleshooting

### "Deployer has no ETH" Error
- Fund your wallet with testnet/mainnet ETH before deploying

### Website Can't Connect to Wallet
- Install MetaMask browser extension
- Ensure you're on the correct network
- Check browser console for errors

### Contract Verification Fails
- Ensure ETHERSCAN_API_KEY is set correctly
- Wait a minute after deployment before verifying
- Check that you're using the correct network

### Wrong Network Warning
- Switch MetaMask to the network where the contract is deployed
- The website will show your balance only on the correct chain

## Networks Configuration

The project supports:

- **Hardhat Local** (Chain ID: 31337) - For local testing
- **Sepolia Testnet** (Chain ID: 11155111) - For testnet deployment
- **Ethereum Mainnet** (Chain ID: 1) - For production deployment

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure they pass
5. Submit a pull request

## Support

For issues or questions:
- Review the test suite for usage examples
- Check Hardhat documentation: https://hardhat.org
- Check OpenZeppelin docs: https://docs.openzeppelin.com

---

**Built for Texans, by Texans** 🤠
