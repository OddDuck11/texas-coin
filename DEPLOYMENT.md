# Texas Coin Deployment Guide

## 🎯 Quick Start - Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub repository (✅ Already created: https://github.com/OddDuck11/texas-coin)
- Vercel account (free) - Sign up at https://vercel.com

### Step 1: Connect to Vercel

**Option A: Using Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `OddDuck11/texas-coin`
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `website`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click "Deploy"
6. Wait 2-3 minutes for deployment to complete
7. Your site will be live at: `https://texas-coin-[random].vercel.app`

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to website directory
cd /home/vboxuser/texas-coin/website

# Login to Vercel
vercel login

# Deploy (preview)
vercel

# Deploy to production
vercel --prod
```

### Step 2: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., texascoin.com)
4. Update DNS records as instructed by Vercel

---

## 🚀 Deploy Smart Contract to Sepolia Testnet

### Prerequisites
1. **Get Sepolia ETH** (for gas fees):
   - Faucet 1: https://sepoliafaucet.com
   - Faucet 2: https://www.alchemy.com/faucets/ethereum-sepolia
   - Request 0.5 ETH minimum

2. **Get Etherscan API Key** (for verification):
   - Go to https://etherscan.io/myapikey
   - Create new API key (free)

3. **Configure Environment**:
   ```bash
   cd /home/vboxuser/texas-coin
   cp .env.example .env
   nano .env
   ```

   Add your credentials:
   ```
   PRIVATE_KEY=your_wallet_private_key_here
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

### Deploy Contract

```bash
# From project root directory
cd /home/vboxuser/texas-coin

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Expected output:
# ========================================
# TEXAS COIN DEPLOYMENT
# ========================================
# Step 1/6: Getting deployer account...
# Deploying from: 0x...
# Step 2/6: Checking balance...
# Account balance: 0.5 ETH
# Step 3/6: Deploying TexasCoin contract...
# Step 4/6: Waiting for confirmation...
# Step 5/6: Verifying deployment...
# Step 6/6: Deployment complete!
# ========================================
# DEPLOYMENT SUCCESSFUL
# Contract address: 0x...
# Transaction hash: 0x...
# Network: Sepolia (11155111)
# Block explorer: https://sepolia.etherscan.io/address/0x...
```

### Verify Contract on Etherscan

```bash
# Replace CONTRACT_ADDRESS with your deployed address
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

## 🌐 How the Website Works

### Architecture

```
┌─────────────────┐
│  User Browser   │
│   (MetaMask)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Website (Vercel/Netlify)      │
│   - Next.js Frontend            │
│   - Web3.js Integration         │
│   - No Backend Required         │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Ethereum Network              │
│   - Smart Contract              │
│   - Token Balances              │
│   - Transactions                │
└─────────────────────────────────┘
```

### Features Walkthrough

1. **Homepage** (`http://localhost:3000`)
   - Shows deployment status
   - Displays token information (name, symbol, supply)
   - "Connect Wallet" button in header

2. **Wallet Connection**
   - User clicks "Connect Wallet"
   - MetaMask popup appears
   - User approves connection
   - Website shows connected address and network

3. **View Balance**
   - After connecting, website automatically fetches token balance
   - Displays balance in TEXAS tokens
   - Updates in real-time after transfers

4. **Transfer Tokens**
   - Enter recipient address (0x...)
   - Enter amount in TEXAS
   - Click "Send TEXAS"
   - MetaMask popup confirms transaction
   - Transaction hash displayed on success
   - Balance updates automatically

5. **Network Detection**
   - Website detects which network you're on
   - Shows warning if wrong network
   - Prompts to switch to correct network

### Testing Locally

```bash
# Terminal 1: Start local Hardhat node
cd /home/vboxuser/texas-coin
npx hardhat node

# Terminal 2: Deploy contract to local network
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start website
cd website
npm run dev

# Open browser: http://localhost:3000
# Configure MetaMask to connect to localhost:8545
# Import test account from Hardhat node output
```

---

## 📊 Deployment Checklist

### Pre-Deployment
- [x] All tests passing (19/19)
- [x] Code pushed to GitHub
- [x] Smart contract code reviewed
- [x] Website tested locally
- [ ] .env configured with real credentials
- [ ] Sepolia ETH obtained for gas
- [ ] Etherscan API key obtained

### Smart Contract Deployment
- [ ] Deploy to Sepolia testnet
- [ ] Verify contract on Etherscan
- [ ] Test contract functions on Sepolia
- [ ] Update deployment-status.json with contract address

### Website Deployment
- [ ] Deploy to Vercel/Netlify
- [ ] Verify website loads correctly
- [ ] Test wallet connection
- [ ] Test token transfer
- [ ] Verify correct network detection
- [ ] (Optional) Configure custom domain

### Post-Deployment
- [ ] Share website URL
- [ ] Share contract address
- [ ] Monitor for issues
- [ ] Announce to community

---

## 🔗 Important Links

**GitHub Repository**: https://github.com/OddDuck11/texas-coin

**Local Development**:
- Website: http://localhost:3000
- Hardhat Node: http://localhost:8545

**After Deployment** (update these):
- Website: https://texas-coin-[your-vercel-id].vercel.app
- Contract (Sepolia): https://sepolia.etherscan.io/address/0x...
- Contract (Mainnet): https://etherscan.io/address/0x...

---

## 💡 Tips

1. **Test on Sepolia first** - Always deploy to testnet before mainnet
2. **Save contract address** - You'll need it for verification and website updates
3. **No secrets in frontend** - Website has no API keys or secrets (all client-side)
4. **Auto-deploy enabled** - Vercel redeploys automatically on git push
5. **Gas costs** - Sepolia deployment costs ~$0 (testnet), Mainnet costs real ETH

---

## ⚠️ Important Notes

- **NEVER commit .env file** - It contains your private key
- **Private key security** - Keep your private key secret and secure
- **Mainnet deployment** - Use a dedicated wallet with only deployment funds
- **Irreversible** - Mainnet deployments cannot be undone
- **Smart contract immutable** - Once deployed, contract code cannot be changed

---

## 🆘 Troubleshooting

**Website not loading?**
- Check Root Directory is set to `website` in Vercel
- Verify build command is `npm run build`

**Can't connect wallet?**
- Make sure MetaMask is installed
- Check you're on correct network (Sepolia/Mainnet)
- Refresh page and try again

**Contract deployment fails?**
- Verify you have enough Sepolia ETH
- Check RPC URL is correct
- Ensure private key is valid

**Wrong network warning?**
- Switch MetaMask to match deployed contract network
- Website only shows balance on correct network

---

**Built for Texans, by Texans** 🤠
