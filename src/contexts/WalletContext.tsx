import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SOLANA_RPC_URL } from '../config/wallet';

export type WalletType = 'solana' | 'ethereum' | 'bitcoin' | null;

export interface WalletState {
  type: WalletType;
  address: string;
  isConnected: boolean;
  solanaPublicKey: string | null;
  ethereumAddress: string | null;
  bitcoinAddress: string | null;
  solBalance: number | null;
  ethBalance: number | null;
  btcBalance: number | null;
}

interface WalletContextType {
  wallet: WalletState;
  connectWallet: (type: 'solana' | 'ethereum' | 'bitcoin') => Promise<void>;
  disconnectWallet: () => void;
  setWalletState: (state: Partial<WalletState>) => void;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    type: null,
    address: '',
    isConnected: false,
    solanaPublicKey: null,
    ethereumAddress: null,
    bitcoinAddress: null,
    solBalance: null,
    ethBalance: null,
    btcBalance: null,
  });

  // Load wallet state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('walletState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWallet(parsed);
      } catch (e) {
        console.error('Failed to load wallet state:', e);
      }
    }
  }, []);

  const fetchSolanaBalance = async (publicKey: string): Promise<number> => {
    try {
      const response = await fetch(SOLANA_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [publicKey],
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      // Balance is in lamports, convert to SOL (1 SOL = 1,000,000,000 lamports)
      return data.result?.value ? data.result.value / 1_000_000_000 : 0;
    } catch (error) {
      console.error('Failed to fetch Solana balance:', error);
      return 0;
    }
  };

  const refreshBalances = async () => {
    if (!wallet.isConnected) return;

    if (wallet.type === 'solana' && wallet.solanaPublicKey) {
      const balance = await fetchSolanaBalance(wallet.solanaPublicKey);
      setWallet(prev => ({ ...prev, solBalance: balance }));
    }
    // TODO: Add Ethereum and Bitcoin balance fetching
  };

  const disconnectWallet = () => {
    if (wallet.type === 'solana' && typeof window !== 'undefined' && window.solana) {
      window.solana.disconnect();
    }
    
    setWallet({
      type: null,
      address: '',
      isConnected: false,
      solanaPublicKey: null,
      ethereumAddress: null,
      bitcoinAddress: null,
      solBalance: null,
      ethBalance: null,
      btcBalance: null,
    });
  };

  // Set up Ethereum account change listener
  useEffect(() => {
    if (wallet.type === 'ethereum' && typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWallet(prev => ({
            ...prev,
            address: accounts[0],
            ethereumAddress: accounts[0],
          }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [wallet.type]);

  // Save wallet state to localStorage
  useEffect(() => {
    if (wallet.isConnected) {
      localStorage.setItem('walletState', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('walletState');
    }
  }, [wallet]);

  const setWalletState = (state: Partial<WalletState>) => {
    setWallet(prev => ({ ...prev, ...state }));
  };

  const connectWallet = async (type: 'solana' | 'ethereum' | 'bitcoin') => {
    try {
      if (type === 'solana') {
        await connectSolana();
      } else if (type === 'ethereum') {
        await connectEthereum();
      } else if (type === 'bitcoin') {
        await connectBitcoin();
      }
    } catch (error) {
      console.error(`Failed to connect ${type} wallet:`, error);
      throw error;
    }
  };

  const connectSolana = async () => {
    if (typeof window === 'undefined' || !window.solana) {
      throw new Error('Solana wallet not found. Please install Phantom or another Solana wallet.');
    }

    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      
      setWallet({
        type: 'solana',
        address: publicKey,
        isConnected: true,
        solanaPublicKey: publicKey,
        ethereumAddress: null,
        bitcoinAddress: null,
        solBalance: null,
        ethBalance: null,
        btcBalance: null,
      });

      // Fetch balance after connection
      const balance = await fetchSolanaBalance(publicKey);
      setWallet(prev => ({ ...prev, solBalance: balance }));
    } catch (err: any) {
      if (err.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw err;
    }
  };

  const connectEthereum = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Ethereum wallet not found. Please install MetaMask or another Ethereum wallet.');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const address = accounts[0];
      
      setWallet({
        type: 'ethereum',
        address: address,
        isConnected: true,
        solanaPublicKey: null,
        ethereumAddress: address,
        bitcoinAddress: null,
        solBalance: null,
        ethBalance: null,
        btcBalance: null,
      });
    } catch (err: any) {
      if (err.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw err;
    }
  };

  const connectBitcoin = async () => {
    // Try Unisat first
    if (typeof window !== 'undefined' && window.unisat) {
      try {
        const accounts = await window.unisat.requestAccounts();
        const address = accounts[0];
        
        setWallet({
          type: 'bitcoin',
          address: address,
          isConnected: true,
          solanaPublicKey: null,
          ethereumAddress: null,
          bitcoinAddress: address,
          solBalance: null,
          ethBalance: null,
          btcBalance: null,
        });
        return;
      } catch (err: any) {
        if (err.code === 4001) {
          throw new Error('User rejected the connection request');
        }
      }
    }

    // Try Xverse
    if (typeof window !== 'undefined' && window.XverseProviders) {
      try {
        const provider = window.XverseProviders.BitcoinProvider;
        const accounts = await provider.requestAccounts();
        const address = accounts[0];
        
        setWallet({
          type: 'bitcoin',
          address: address,
          isConnected: true,
          solanaPublicKey: null,
          ethereumAddress: null,
          bitcoinAddress: address,
          solBalance: null,
          ethBalance: null,
          btcBalance: null,
        });
        return;
      } catch (err: any) {
        if (err.code === 4001) {
          throw new Error('User rejected the connection request');
        }
      }
    }

    throw new Error('Bitcoin wallet not found. Please install Unisat or Xverse wallet.');
  };

  // Auto-refresh Solana balance when connected
  useEffect(() => {
    if (wallet.type === 'solana' && wallet.solanaPublicKey && wallet.isConnected) {
      const fetchBalance = async () => {
        const balance = await fetchSolanaBalance(wallet.solanaPublicKey!);
        setWallet(prev => ({ ...prev, solBalance: balance }));
      };
      
      fetchBalance();
      // Refresh balance every 10 seconds
      const interval = setInterval(() => {
        fetchBalance();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [wallet.type, wallet.solanaPublicKey, wallet.isConnected]);

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet, setWalletState, refreshBalances }}>
      {children}
    </WalletContext.Provider>
  );
};

// Type declarations for window objects
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
    };
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (args: any) => void) => void;
      removeListener: (event: string, callback: (args: any) => void) => void;
    };
    unisat?: {
      requestAccounts: () => Promise<string[]>;
      getAccounts: () => Promise<string[]>;
    };
    XverseProviders?: {
      BitcoinProvider: {
        requestAccounts: () => Promise<string[]>;
        getAccounts: () => Promise<string[]>;
      };
    };
  }
}

