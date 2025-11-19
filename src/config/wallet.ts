// Wallet configuration
export const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY || '';

// Solana RPC endpoint (using Helius)
export const SOLANA_RPC_URL = HELIUS_API_KEY 
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : 'https://api.mainnet-beta.solana.com';

// Bitcoin RPC endpoint (using Helius)
export const BITCOIN_RPC_URL = HELIUS_API_KEY
  ? `https://api.helius.xyz/v0/addresses/{address}/balances?api-key=${HELIUS_API_KEY}`
  : '';

// Ethereum configuration
export const ETHEREUM_CHAIN_ID = 1; // Mainnet

