'use client';

import { useState, useEffect } from 'react';
import Web3Provider, { useWeb3 } from '@/components/Web3Provider';

// TexasCoin ABI (only the functions we need)
const TEXAS_COIN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

interface DeploymentStatus {
  step: number;
  message: string;
  timestamp: string;
  contractAddress?: string;
  transactionHash?: string;
  network?: string;
  chainId?: number;
  token?: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
  };
  blockExplorer?: string;
}

function HomePage() {
  const { web3, account, chainId, connect, disconnect, isConnecting, error } = useWeb3();
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Poll deployment status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/deployment-status');
        const data = await response.json();
        setDeploymentStatus(data);
      } catch (err) {
        console.error('Failed to fetch deployment status:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch balance when account or contract changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!web3 || !account || !deploymentStatus?.contractAddress) return;

      try {
        const contract = new web3.eth.Contract(TEXAS_COIN_ABI, deploymentStatus.contractAddress);
        const bal = await contract.methods.balanceOf(account).call();
        const formattedBalance = web3.utils.fromWei(bal.toString(), 'ether');
        setBalance(formattedBalance);
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    };

    fetchBalance();
  }, [web3, account, deploymentStatus?.contractAddress]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3 || !account || !deploymentStatus?.contractAddress) return;

    setIsTransferring(true);
    setTransferError(null);
    setTransferSuccess(null);

    try {
      const contract = new web3.eth.Contract(TEXAS_COIN_ABI, deploymentStatus.contractAddress);
      const amountInWei = web3.utils.toWei(transferAmount, 'ether');

      const tx = await contract.methods.transfer(transferTo, amountInWei).send({
        from: account,
      });

      setTransferSuccess(`Transfer successful! Tx: ${tx.transactionHash}`);
      setTransferTo('');
      setTransferAmount('');

      // Refresh balance
      const bal = await contract.methods.balanceOf(account).call();
      const formattedBalance = web3.utils.fromWei(bal.toString(), 'ether');
      setBalance(formattedBalance);
    } catch (err: any) {
      console.error('Transfer error:', err);
      setTransferError(err.message || 'Transfer failed');
    } finally {
      setIsTransferring(false);
    }
  };

  const getChainName = (id: number) => {
    switch (id) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 31337:
        return 'Hardhat Local';
      default:
        return `Chain ${id}`;
    }
  };

  const isDeployed = deploymentStatus?.step === 6;
  const isCorrectChain = chainId === deploymentStatus?.chainId;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-texas-blue text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Texas Coin (TEXAS)</h1>
            {!account ? (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-secondary"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm opacity-80">Connected to {getChainName(chainId!)}</div>
                  <div className="font-mono text-sm">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                </div>
                <button onClick={disconnect} className="btn-secondary">
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-texas-blue mb-4">
            Welcome to Texas Coin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A cryptocurrency built for Texans. Track deployment, manage your tokens, and be part of the revolution.
          </p>
        </div>

        {/* Deployment Status */}
        {deploymentStatus && deploymentStatus.step > 0 && (
          <div className="card mb-8">
            <h3 className="text-2xl font-bold mb-4 text-texas-blue">Deployment Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isDeployed ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="font-semibold">{deploymentStatus.message}</span>
              </div>

              {deploymentStatus.contractAddress && (
                <div>
                  <div className="stat-label">Contract Address</div>
                  <div className="font-mono text-lg break-all">{deploymentStatus.contractAddress}</div>
                </div>
              )}

              {deploymentStatus.network && (
                <div>
                  <div className="stat-label">Network</div>
                  <div className="text-lg">{deploymentStatus.network} (Chain ID: {deploymentStatus.chainId})</div>
                </div>
              )}

              {deploymentStatus.blockExplorer && (
                <a
                  href={deploymentStatus.blockExplorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-texas-blue hover:underline"
                >
                  View on Block Explorer →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Token Info */}
        {deploymentStatus?.token && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="stat-label">Token Name</div>
              <div className="stat-value">{deploymentStatus.token.name}</div>
            </div>
            <div className="card">
              <div className="stat-label">Symbol</div>
              <div className="stat-value">{deploymentStatus.token.symbol}</div>
            </div>
            <div className="card">
              <div className="stat-label">Total Supply</div>
              <div className="stat-value">{deploymentStatus.token.totalSupply}</div>
            </div>
          </div>
        )}

        {/* User Balance */}
        {account && isDeployed && (
          <>
            <div className="card mb-8">
              <h3 className="text-2xl font-bold mb-4 text-texas-blue">Your Balance</h3>
              {isCorrectChain ? (
                <div>
                  <div className="stat-value mb-2">{parseFloat(balance).toLocaleString()} TEXAS</div>
                  <div className="text-sm text-gray-600">Account: {account}</div>
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  Please switch to {getChainName(deploymentStatus.chainId!)} to view your balance and transfer tokens.
                </div>
              )}
            </div>

            {/* Transfer Form */}
            {isCorrectChain && (
              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-texas-blue">Transfer TEXAS</h3>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Address</label>
                    <input
                      type="text"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-texas-blue focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (TEXAS)</label>
                    <input
                      type="number"
                      step="0.000000000000000001"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-texas-blue focus:border-transparent"
                      required
                    />
                  </div>

                  {transferError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {transferError}
                    </div>
                  )}

                  {transferSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                      {transferSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isTransferring || !transferTo || !transferAmount}
                    className="btn-primary w-full"
                  >
                    {isTransferring ? 'Transferring...' : 'Send TEXAS'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {/* Getting Started */}
        {!account && (
          <div className="card mt-8">
            <h3 className="text-2xl font-bold mb-4 text-texas-blue">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Install MetaMask or another Web3 wallet</li>
              <li>Click "Connect Wallet" to connect your wallet</li>
              <li>Make sure you're on the correct network ({deploymentStatus?.network || 'Ethereum'})</li>
              <li>View your TEXAS balance and transfer tokens</li>
            </ol>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-texas-blue text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Texas Coin (TEXAS)</p>
          <p className="text-sm opacity-80">Built for Texans, by Texans</p>
          {deploymentStatus?.contractAddress && (
            <p className="text-xs opacity-60 mt-2 font-mono break-all">
              {deploymentStatus.contractAddress}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Web3Provider>
      <HomePage />
    </Web3Provider>
  );
}
