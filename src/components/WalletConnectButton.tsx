import React, { useState } from 'react';
import { Wallet, ChevronDown, X } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

// Token logos
const TOKEN_LOGOS = {
  ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
  solana: 'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422',
  bitcoin: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
};

export const WalletConnectButton: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (type: 'solana' | 'ethereum' | 'bitcoin') => {
    setIsConnecting(true);
    setError(null);
    setIsMenuOpen(false);
    
    try {
      await connectWallet(type);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsMenuOpen(false);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getWalletName = (type: string) => {
    switch (type) {
      case 'solana': return 'Solana';
      case 'ethereum': return 'Ethereum';
      case 'bitcoin': return 'Bitcoin';
      default: return 'Wallet';
    }
  };

  if (wallet.isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wider transition-all duration-300 group"
        >
          <Wallet className="w-3 h-3 text-emerald-500" />
          <span className="text-emerald-400">{getWalletName(wallet.type || '')}</span>
          <span className="text-zinc-400">{formatAddress(wallet.address)}</span>
          <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 z-50 w-64 max-w-[calc(100vw-2rem)] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden">
              <div className="mb-4 pb-4 border-b border-white/10">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Connected Wallet</div>
                <div className="text-sm font-semibold text-white">{getWalletName(wallet.type || '')}</div>
                <div className="text-xs font-mono text-emerald-400 mt-1 break-all overflow-wrap-anywhere">{wallet.address}</div>
              </div>
              
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-semibold text-red-400 transition-all duration-300"
              >
                <X className="w-3 h-3" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        disabled={isConnecting}
        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wider transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
        <span>{isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-72 max-w-[calc(100vw-2rem)] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Select Network</div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleConnect('ethereum')}
                disabled={isConnecting}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all duration-300 group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src={TOKEN_LOGOS.ethereum} 
                      alt="Ethereum"
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <span className="text-xs font-bold text-blue-400 hidden">ETH</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">Ethereum</div>
                    <div className="text-xs text-zinc-500">MetaMask, WalletConnect</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors rotate-[-90deg]" />
              </button>

              <button
                onClick={() => handleConnect('solana')}
                disabled={isConnecting}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all duration-300 group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src={TOKEN_LOGOS.solana} 
                      alt="Solana"
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <span className="text-xs font-bold text-purple-400 hidden">SOL</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">Solana</div>
                    <div className="text-xs text-zinc-500">Phantom, Solflare</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors rotate-[-90deg]" />
              </button>

              <button
                onClick={() => handleConnect('bitcoin')}
                disabled={isConnecting}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-all duration-300 group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src={TOKEN_LOGOS.bitcoin} 
                      alt="Bitcoin"
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <span className="text-xs font-bold text-orange-400 hidden">BTC</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">Bitcoin</div>
                    <div className="text-xs text-zinc-500">Unisat, Xverse</div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors rotate-[-90deg]" />
              </button>
            </div>

            {error && (
              <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="text-xs text-red-400">{error}</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

