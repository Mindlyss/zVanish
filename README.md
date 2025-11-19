# zVanish - Zcash Bridge Application

A modern, elegant React application for bridging Zcash (ZEC) and Ethereum (ETH) with a beautiful starfield background and glassmorphism UI.

## Features

- 🌟 Animated starfield background with shooting stars
- 💎 Glassmorphism design with emerald accents
- 🔄 ZEC ↔ ETH bridge interface
- 🔗 Multi-chain wallet support (Solana, Ethereum, Bitcoin)
- 📱 Responsive design
- ⚡ Built with Vite for fast development and builds

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Helius API key:
   ```
   VITE_HELIUS_API_KEY=your_helius_api_key_here
   ```
   - Get your API key from [Helius](https://www.helius.dev/)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build the project: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`

### GitHub Pages

1. Update `vite.config.ts` to set `base: '/your-repo-name/'`
2. Build: `npm run build`
3. Deploy the `dist` folder to GitHub Pages

### Other Static Hosting

Simply build the project and upload the `dist` folder to your hosting provider:
- AWS S3 + CloudFront
- Cloudflare Pages
- Any static file hosting service

## Wallet Support

The application supports connecting wallets from three different blockchains:

### Ethereum
- **MetaMask** - Browser extension wallet
- **WalletConnect** - Mobile and desktop wallets
- Automatically detects and connects to Ethereum mainnet

### Solana
- **Phantom** - Most popular Solana wallet
- **Solflare** - Alternative Solana wallet
- Uses Helius RPC for optimized performance (when API key is provided)

### Bitcoin
- **Unisat** - Bitcoin wallet browser extension
- **Xverse** - Bitcoin wallet browser extension
- Supports Bitcoin mainnet addresses

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Wagmi** - Ethereum wallet connection
- **Viem** - Ethereum utilities
- **Solana Web3.js** - Solana blockchain interaction
- **Helius** - Solana and Bitcoin RPC infrastructure

## Project Structure

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
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── .env                           # Environment variables (create this)
```

## License

© 2025 zVANISH PROTOCOL

