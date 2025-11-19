# Wallet Connection Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your Helius API key:**
   - Create a `.env` file in the root directory
   - Add the following line:
     ```
     VITE_HELIUS_API_KEY=your_actual_api_key_here
     ```
   - Get your API key from: https://www.helius.dev/

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Supported Wallets

### Ethereum
- **MetaMask** (Browser Extension)
- Any wallet that injects `window.ethereum`

### Solana
- **Phantom** (Browser Extension)
- **Solflare** (Browser Extension)
- Any wallet that injects `window.solana`

### Bitcoin
- **Unisat** (Browser Extension)
- **Xverse** (Browser Extension)

## How It Works

1. Click the "CONNECT WALLET" button in the navbar
2. Select your desired blockchain (Ethereum, Solana, or Bitcoin)
3. Approve the connection in your wallet extension
4. Your wallet address will be displayed and stored

## Wallet State

The connected wallet state is:
- Stored in React Context (`WalletContext`)
- Persisted to localStorage
- Available throughout the app via `useWallet()` hook

## Using the Wallet in Your Code

```typescript
import { useWallet } from './contexts/WalletContext';

function MyComponent() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  
  // Check if connected
  if (wallet.isConnected) {
    console.log('Wallet type:', wallet.type);
    console.log('Address:', wallet.address);
  }
}
```

## Environment Variables

The Helius API key is optional but recommended for:
- Optimized Solana RPC performance
- Bitcoin RPC access
- Better rate limits

If no API key is provided, the app will use public RPC endpoints (which may have rate limits).

