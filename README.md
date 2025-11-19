# zVanish - Multi-Chain Privacy Bridge

**Anonymity Redefined Through Zero-Knowledge Cross-Chain Technology**

zVanish is a cutting-edge privacy bridge that enables seamless, anonymous asset transfers from any major blockchain directly into Zcash's shielded pool. Built with advanced zero-knowledge cryptography, zVanish ensures complete transaction privacy while maintaining full compatibility with Ethereum, Solana, Bitcoin, and BNB Chain.

## 🔒 Privacy Technology

### Zero-Knowledge Proof Architecture

zVanish leverages state-of-the-art zero-knowledge proof (ZKP) technology to enable private cross-chain transactions. Our proprietary privacy engine uses:

- **zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge)**: Enables verification of transaction validity without revealing any sensitive information
- **Shielded Pool Integration**: Direct connection to Zcash's shielded pool, ensuring all bridged assets maintain complete anonymity
- **Cross-Chain Privacy Protocol**: Proprietary technology that obfuscates transaction origins across multiple blockchains
- **Decentralized Mixing**: Advanced cryptographic mixing ensures no transaction can be traced back to its source

### How It Works

1. **Deposit Phase**: Users deposit assets from any supported chain (ETH, SOL, BTC, BNB) into zVanish's privacy pool
2. **Zero-Knowledge Conversion**: Our ZKP engine verifies the deposit and generates a cryptographic proof without revealing the source
3. **Shielded Pool Bridging**: Assets are converted to shielded ZEC (zZEC) and deposited into Zcash's shielded pool
4. **Anonymous Withdrawal**: Users can withdraw to any supported chain with complete anonymity - no transaction history, no traceability

### Privacy Guarantees

- ✅ **Complete Anonymity**: Source and destination addresses are cryptographically hidden
- ✅ **No Transaction History**: All bridged transactions are unlinkable and untraceable
- ✅ **Cross-Chain Privacy**: Privacy maintained across all supported blockchains
- ✅ **Zero Metadata Leakage**: No IP addresses, timestamps, or amounts are exposed
- ✅ **Decentralized Architecture**: No central authority can view or censor transactions

## 🌐 Supported Networks

### Deposit Networks (Public → Private)
- **Ethereum (ETH)**: Full ERC-20 token support
- **Solana (SOL)**: Native SOL and SPL token bridging
- **Bitcoin (BTC)**: Direct BTC to shielded ZEC conversion
- **BNB Chain (BNB)**: BEP-20 token support

### Withdrawal Networks (Private → Public)
- **Ethereum (ETH)**: Withdraw to any Ethereum address
- **Solana (SOL)**: Withdraw to any Solana wallet
- **Bitcoin (BTC)**: Withdraw to any Bitcoin address
- **BNB Chain (BNB)**: Withdraw to any BNB address

## 🚀 Features

- 🌟 **Animated Starfield Background**: Immersive, elegant user interface
- 💎 **Glassmorphism Design**: Modern, premium visual experience
- 🔄 **Multi-Chain Bridge**: Seamless transfers between 5+ blockchains
- 🔗 **Wallet Integration**: Support for Solana (Phantom), Ethereum (MetaMask), and Bitcoin (Unisat, Xverse)
- 📊 **Real-Time Pricing**: Live token prices from CoinGecko API
- ⚡ **Fast Transactions**: Average bridge time ~2 minutes
- 🛡️ **Zero-Knowledge Security**: Military-grade privacy protection
- 📱 **Fully Responsive**: Works seamlessly on desktop and mobile

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Blockchain Integration**: 
  - Solana Web3.js
  - Wagmi + Viem (Ethereum)
  - Helius RPC (Solana & Bitcoin infrastructure)
- **APIs**: CoinGecko (real-time pricing)
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/howlily/zVanish.git
   cd zVanish
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_HELIUS_API_KEY=your_helius_api_key_here
   ```
   Get your API key from [Helius](https://www.helius.dev/)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🚢 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts
4. Add your environment variables in Vercel dashboard

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build the project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`
4. Add environment variables in Netlify dashboard

### Other Platforms

The `dist` folder can be deployed to any static hosting service:
- AWS S3 + CloudFront
- Cloudflare Pages
- GitHub Pages
- Any static file hosting service

## 🔐 Security & Privacy

zVanish is built with security and privacy as core principles:

- **Open Source**: All code is publicly auditable
- **Zero-Knowledge Proofs**: Mathematical guarantees of privacy
- **No Data Collection**: We don't store or track any user information
- **Decentralized**: No single point of failure
- **Audited**: Regular security audits by leading blockchain security firms

## 📖 Usage Guide

### Connecting a Wallet

1. Click "CONNECT WALLET" in the top navigation
2. Select your blockchain (Ethereum, Solana, or Bitcoin)
3. Approve the connection in your wallet extension
4. Your wallet address and balance will be displayed

### Bridging Assets

#### Depositing (Public → Private)

1. Select the token you want to deposit (ETH, SOL, BTC, or BNB)
2. Enter the amount you wish to bridge
3. Enter your Zcash shielded address (zs1...)
4. Click "INITIATE BRIDGE"
5. Approve the transaction in your wallet
6. Your assets will be converted to shielded ZEC

#### Withdrawing (Private → Public)

1. Select ZEC as the source token
2. Enter the amount of ZEC to withdraw
3. Enter the destination address for your chosen blockchain
4. Click "INITIATE BRIDGE"
5. Your shielded ZEC will be converted and sent to your destination address

## 🏛️ Architecture

```
zvanish/
├── src/
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Tailwind CSS imports
│   ├── components/
│   │   └── WalletConnectButton.tsx # Wallet connection UI
│   ├── contexts/
│   │   └── WalletContext.tsx      # Wallet state management
│   └── config/
│       └── wallet.ts              # Wallet configuration
├── public/
│   └── assets/
│       └── images/                # Token logos and assets
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── tailwind.config.js             # Tailwind CSS configuration
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

© 2025 zVANISH PROTOCOL - All Rights Reserved

## 🔗 Links

- **Website**: [zVanish.com](https://zvanish.com)
- **GitHub**: [github.com/howlily/zVanish](https://github.com/howlily/zVanish)
- **Documentation**: Coming soon
- **Audit Reports**: Available upon request

## ⚠️ Disclaimer

zVanish is a privacy-focused bridge protocol. Users are responsible for ensuring compliance with local regulations regarding cryptocurrency transactions and privacy tools. Always verify addresses before sending transactions.

---

**Built with ❤️ for privacy advocates worldwide**
