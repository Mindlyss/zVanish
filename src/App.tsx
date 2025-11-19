import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowDownUp, 
  Wallet, 
  Settings, 
  ShieldCheck,
  Zap,
  Github,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { WalletConnectButton } from './components/WalletConnectButton';
import { useWallet } from './contexts/WalletContext';

/**
 * STARFIELD ENGINE - EMERALD EDITION
 * Optimized for a cleaner, "expensive" void look
 */
const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      pulseSpeed: number;
    }> = [];
    
    let shootingStars: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      life: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      const count = Math.floor((window.innerWidth * window.innerHeight) / 4000); // Less stars for cleaner look
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.02 + 0.005,
          pulseSpeed: Math.random() * 0.01 + 0.002,
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = '#000000'; // True Black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Very subtle ambient green glow in corners
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#020604'); 
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Stars
      stars.forEach((star) => {
        star.y -= star.speed;
        star.opacity += star.pulseSpeed;
        if (star.opacity > 0.8 || star.opacity < 0.1) star.pulseSpeed = -star.pulseSpeed;
        if (star.y < 0) star.y = canvas.height;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        // White with a tiny hint of emerald
        ctx.fillStyle = `rgba(209, 250, 229, ${Math.abs(star.opacity)})`; 
        ctx.fill();
      });

      // Shooting Stars (Green tinted)
      if (Math.random() < 0.005 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 3),
          length: Math.random() * 100 + 50,
          speed: Math.random() * 15 + 8,
          angle: Math.PI / 6,
          life: 1.0
        });
      }

      shootingStars = shootingStars.filter(s => s.life > 0);
      shootingStars.forEach((s) => {
        s.x += s.speed * Math.cos(s.angle);
        s.y += s.speed * Math.sin(s.angle);
        s.life -= 0.03;

        const tailX = s.x - s.length * Math.cos(s.angle);
        const tailY = s.y - s.length * Math.sin(s.angle);

        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(52, 211, 153, ${s.life})`); // Emerald head
        gradient.addColorStop(1, `rgba(52, 211, 153, 0)`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createStars();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

type TokenType = 'ETH' | 'SOL' | 'BNB' | 'BTC';
type AllTokenType = TokenType | 'ZEC';

// CoinGecko coin IDs mapping
const COINGECKO_IDS: Record<AllTokenType, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  ZEC: 'zcash',
};

const TOKENS: Record<AllTokenType, { name: string; price: number; color: string; initial: string; logo: string; coingeckoId: string }> = {
  ETH: { 
    name: 'Ethereum', 
    price: 0, // Will be fetched from API
    color: 'bg-blue-500', 
    initial: 'E',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    coingeckoId: 'ethereum'
  },
  SOL: { 
    name: 'Solana', 
    price: 0, // Will be fetched from API
    color: 'bg-purple-500', 
    initial: 'S',
    logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422',
    coingeckoId: 'solana'
  },
  BNB: { 
    name: 'BNB Chain', 
    price: 0, // Will be fetched from API
    color: 'bg-yellow-500', 
    initial: 'B',
    logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1644979850',
    coingeckoId: 'binancecoin'
  },
  BTC: { 
    name: 'Bitcoin', 
    price: 0, // Will be fetched from API
    color: 'bg-orange-500', 
    initial: 'B',
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
    coingeckoId: 'bitcoin'
  },
  ZEC: {
    name: 'Zcash',
    price: 0, // Will be fetched from API
    color: 'bg-emerald-500',
    initial: 'Z',
    logo: '/assets/images/zcash.png',
    coingeckoId: 'zcash'
  },
};

/**
 * MAIN APP COMPONENT
 */
export default function ZcashBridgeApp() {
  const { wallet } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  
  // New State Logic
  const [selectedToken, setSelectedToken] = useState<TokenType>('ETH');
  const [isDeposit, setIsDeposit] = useState(true); // true = Public -> ZEC, false = ZEC -> Public
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeStep, setBridgeStep] = useState(0); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get balance for selected token
  const getWalletBalance = (): number => {
    if (!wallet.isConnected) return 0;
    
    if (isDeposit) {
      // When depositing, show balance for selected token
      if (selectedToken === 'SOL' && wallet.type === 'solana') {
        return wallet.solBalance || 0;
      }
      // TODO: Add ETH, BNB, BTC balance fetching
    } else {
      // When withdrawing, show ZEC balance (if we had it)
      // For now, return 0 as ZEC balance fetching would need different logic
    }
    return 0;
  };

  const handleMaxClick = () => {
    const balance = getWalletBalance();
    if (balance > 0) {
      setAmount(balance.toFixed(6));
    }
  };

  // Token prices state
  const [tokenPrices, setTokenPrices] = useState<Record<AllTokenType, number>>({
    BTC: 0,
    ETH: 0,
    SOL: 0,
    BNB: 0,
    ZEC: 0,
  });

  // Fetch prices from CoinGecko
  const fetchTokenPrices = async () => {
    try {
      const coinIds = Object.values(COINGECKO_IDS).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      
      const data = await response.json();
      
      // Map CoinGecko response to our token types
      const prices: Record<AllTokenType, number> = {
        BTC: data.bitcoin?.usd || 0,
        ETH: data.ethereum?.usd || 0,
        SOL: data.solana?.usd || 0,
        BNB: data.binancecoin?.usd || 0,
        ZEC: data.zcash?.usd || 0,
      };
      
      setTokenPrices(prices);
    } catch (error) {
      console.error('Error fetching token prices:', error);
      // Keep previous prices on error
    }
  };

  // Fetch prices on mount and every 30 seconds
  useEffect(() => {
    fetchTokenPrices();
    const interval = setInterval(fetchTokenPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Get current price for a token
  const getTokenPrice = (token: AllTokenType): number => {
    return tokenPrices[token] || 0;
  };

  const ZEC_PRICE = getTokenPrice('ZEC');

  const handleSwapDirection = () => {
    setIsDeposit(!isDeposit);
    setAddress('');
  };

  const handleBridge = () => {
    if (!wallet.isConnected) return;
    if (!amount || !address) return;
    
    setIsBridging(true);
    setBridgeStep(1);

    // Simulate Backend Processes
    setTimeout(() => setBridgeStep(2), 2000); // 2s Signing
    setTimeout(() => setBridgeStep(3), 5500); // 3.5s Network Confirm
    setTimeout(() => {
      setIsBridging(false);
      setBridgeStep(0);
      setAmount('');
      setAddress('');
    }, 8000);
  };

  const getButtonText = () => {
    if (!wallet.isConnected) return 'CONNECT WALLET';
    if (!amount) return 'ENTER AMOUNT';
    if (!address) return 'ENTER DESTINATION';
    if (bridgeStep === 1) return 'SIGNING TRANSACTION...';
    if (bridgeStep === 2) return 'CONFIRMING ON CHAIN...';
    if (bridgeStep === 3) return 'ASSETS BRIDGED';
    return 'INITIATE BRIDGE';
  };

  // Calculate received amount
  const calculateReceive = () => {
    if (!amount) return '0.00';
    const val = parseFloat(amount);
    const tokenPrice = getTokenPrice(selectedToken);
    
    if (isDeposit) {
      // Public -> ZEC (Token Value / ZEC Value)
      if (ZEC_PRICE === 0 || tokenPrice === 0) return '0.00';
      return ((val * tokenPrice) / ZEC_PRICE * 0.995).toFixed(4);
    } else {
      // ZEC -> Public (ZEC Value / Token Value)
      if (ZEC_PRICE === 0 || tokenPrice === 0) return '0.00';
      return ((val * ZEC_PRICE) / tokenPrice * 0.995).toFixed(6);
    }
  };

  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden bg-black">
      {/* Font Injection */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Outfit', sans-serif; }
          .font-display { font-family: 'Space Grotesk', sans-serif; }
        `}
      </style>

      {/* Background */}
      <Starfield />
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto w-full overflow-visible">
        <div className="flex items-center gap-4 group cursor-pointer">
          {/* Text-based branding only */}
          <span className="text-2xl font-display font-bold tracking-tighter text-white">
            z<span className="text-emerald-500">Vanish</span>.com
          </span>
        </div>

        {/* Social Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest text-zinc-500 uppercase">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-emerald-400 transition-colors duration-300 group"
          >
            <Github className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
            <span>GitHub</span>
          </a>

          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-emerald-400 transition-colors duration-300 group"
          >
            {/* X Logo SVG */}
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <WalletConnectButton />
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-zinc-500 hover:text-white transition-colors md:hidden"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-8 pb-24">
        
        {/* Hero */}
        <div className="text-center mb-12 space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-500 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Multi-Chain Privacy V2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white">
            ANONYMITY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700">REDEFINED</span>
          </h1>
        </div>

        {/* High-End Glass Card */}
        <div className="w-full max-w-[460px] relative">
          {/* Ambient Glow Behind Card */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-[32px] blur-2xl opacity-30"></div>
          
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
            
            {/* Card Header */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Swap & Bridge</span>
              <div className="flex items-center gap-2 cursor-pointer hover:text-emerald-400 text-zinc-500 transition-colors">
                <Settings className="w-4 h-4" />
              </div>
            </div>

            {/* SEND SECTION */}
            <div className="group relative mb-2 bg-white/5 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-300 z-20">
              <div className="flex justify-between mb-3">
                <label className="text-xs font-semibold tracking-wide text-zinc-400">SEND</label>
                <button
                  onClick={handleMaxClick}
                  className="text-xs font-mono text-emerald-500/80 cursor-pointer hover:text-emerald-400 transition-colors"
                >
                  MAX: {isDeposit && selectedToken === 'SOL' && wallet.type === 'solana' 
                    ? (wallet.solBalance?.toFixed(4) || '0.00')
                    : '0.00'}
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                 {/* Dropdown or Static Label depending on direction */}
                 {isDeposit ? (
                   <div className="relative">
                     <button 
                       onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                       className="flex items-center gap-3 px-3 py-2 bg-black/40 rounded-xl border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-900/20 transition-all shrink-0 min-w-[140px]"
                     >
                        <img 
                          src={TOKENS[selectedToken].logo} 
                          alt={TOKENS[selectedToken].name}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            // Fallback to colored circle if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${TOKENS[selectedToken].color} hidden`}>
                          {TOKENS[selectedToken].initial}
                        </div>
                        <div className="flex flex-col items-start leading-none">
                          <span className="font-display font-bold text-sm text-white">{selectedToken}</span>
                          <span className="text-[10px] text-zinc-500">{TOKENS[selectedToken].name}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-zinc-500 ml-auto" />
                     </button>

                     {/* Dropdown Menu */}
                     {isTokenDropdownOpen && (
                       <>
                         <div 
                           className="fixed inset-0 z-30" 
                           onClick={() => setIsTokenDropdownOpen(false)}
                         />
                         <div className="absolute top-full left-0 mt-2 w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-40">
                           {(Object.keys(TOKENS).filter(t => t !== 'ZEC') as TokenType[]).map((token) => (
                             <button
                               key={token}
                               onClick={() => {
                                 setSelectedToken(token);
                                 setIsTokenDropdownOpen(false);
                               }}
                               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-900/20 hover:text-emerald-400 text-left transition-colors"
                             >
                                <img 
                                  src={TOKENS[token].logo} 
                                  alt={TOKENS[token].name}
                                  className="w-5 h-5 rounded-full"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${TOKENS[token].color} hidden`}>
                                  {TOKENS[token].initial}
                                </div>
                                <span className="text-sm font-bold">{token}</span>
                             </button>
                           ))}
                         </div>
                       </>
                     )}
                   </div>
                 ) : (
                   /* Static ZEC Badge when sending ZEC */
                   <div className="flex items-center gap-3 px-3 py-2 bg-black/40 rounded-xl border border-white/10 shrink-0 min-w-[140px]">
                      <div className="relative w-6 h-6">
                        <img 
                          src={TOKENS.ZEC.logo} 
                          alt="Zcash"
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black bg-emerald-400 hidden fallback absolute inset-0">
                          Z
                        </div>
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className="font-display font-bold text-sm text-white">ZEC</span>
                        <span className="text-[10px] text-zinc-500">Shielded Zcash</span>
                      </div>
                   </div>
                 )}

                 <input 
                  type="number" 
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-right text-3xl font-display font-medium text-white placeholder-zinc-700 focus:outline-none"
                />
              </div>
              <div className="text-right mt-2 text-xs font-mono text-zinc-600">
                ≈ ${amount ? (parseFloat(amount) * (isDeposit ? getTokenPrice(selectedToken) : ZEC_PRICE)).toLocaleString(undefined, {maximumFractionDigits: 2}) : '0.00'} USD
              </div>
            </div>

            {/* Divider Switcher */}
            <div className="relative h-6 flex items-center justify-center z-10">
              <button 
                onClick={handleSwapDirection}
                className="bg-[#0A0A0A] border border-zinc-800 p-2 rounded-full hover:border-emerald-500 hover:text-emerald-500 text-zinc-500 transition-all duration-300 shadow-lg"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* RECEIVE SECTION */}
            <div className="relative mt-[-12px] pt-6 bg-black/20 border border-white/5 rounded-2xl p-5 mb-6 z-0">
               <div className="flex justify-between mb-3">
                <label className="text-xs font-semibold tracking-wide text-zinc-400">RECEIVE (EST)</label>
              </div>
              
              <div className="flex items-center gap-4">
                 {/* Static ZEC Badge if depositing, Dynamic if Withdrawing */}
                 {isDeposit ? (
                   <div className="flex items-center gap-3 px-3 py-2 bg-black/40 rounded-xl border border-white/10 shrink-0 min-w-[140px]">
                      <div className="relative w-6 h-6">
                        <img 
                          src={TOKENS.ZEC.logo} 
                          alt="Zcash"
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black bg-emerald-400 hidden fallback absolute inset-0">
                          Z
                        </div>
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className="font-display font-bold text-sm text-white">ZEC</span>
                        <span className="text-[10px] text-zinc-500">Shielded Zcash</span>
                      </div>
                   </div>
                 ) : (
                   <div className="flex items-center gap-3 px-3 py-2 bg-black/40 rounded-xl border border-white/10 shrink-0 min-w-[140px]">
                      <img 
                        src={TOKENS[selectedToken].logo} 
                        alt={TOKENS[selectedToken].name}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${TOKENS[selectedToken].color} hidden`}>
                        {TOKENS[selectedToken].initial}
                      </div>
                      <div className="flex flex-col items-start leading-none">
                        <span className="font-display font-bold text-sm text-white">{selectedToken}</span>
                        <span className="text-[10px] text-zinc-500">{TOKENS[selectedToken].name}</span>
                      </div>
                   </div>
                 )}

                 <div className="w-full text-right text-3xl font-display font-medium text-zinc-300">
                   {calculateReceive()}
                 </div>
              </div>
            </div>

            {/* Address Input */}
            <div className="mb-8">
              <div className="relative flex items-center">
                 <Wallet className="absolute left-4 w-4 h-4 text-zinc-500" />
                 <input 
                    type="text" 
                    placeholder={isDeposit ? "Z-Address (zs1...)" : `${selectedToken} Address`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-mono text-emerald-400 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
              </div>
            </div>

            {/* Main Action Button */}
            <button 
              onClick={handleBridge}
              disabled={isBridging || !wallet.isConnected || !amount || !address}
              className={`
                group relative w-full py-5 rounded-xl font-bold text-sm tracking-[0.15em] uppercase transition-all duration-500 overflow-hidden
                ${!wallet.isConnected || !amount || !address 
                  ? 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5' 
                  : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.7)]'}
              `}
            >
              {isBridging && (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-600 z-10">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-3" />
                  <span>Processing...</span>
                </div>
              )}
              
              {bridgeStep === 3 && (
                 <div className="absolute inset-0 flex items-center justify-center bg-emerald-500 z-20 animate-in zoom-in duration-300">
                   <CheckCircle2 className="w-5 h-5 mr-2" />
                   <span>COMPLETE</span>
                 </div>
              )}

              <span className="relative z-0 group-hover:tracking-[0.25em] transition-all duration-500">
                {getButtonText()}
              </span>
            </button>

            {/* Footer Info */}
             {amount && (
              <div className="mt-6 grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider text-zinc-500 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col gap-1">
                  <span>Network Fee</span>
                  <span className="text-zinc-300 flex items-center gap-1">
                     <Zap className="w-3 h-3 text-emerald-500" /> 
                     $0.45
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span>Est. Time</span>
                  <span className="text-zinc-300">~2 Minutes</span>
                </div>
              </div>
            )}

          </div>
          
          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
              <ShieldCheck className="w-3 h-3" />
              Secured by Zero-Knowledge Proofs
            </div>
          </div>
        
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="fixed bottom-0 w-full py-6 px-8 border-t border-white/5 bg-black/50 backdrop-blur-md z-40 hidden md:block">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-600">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div> Systems Operational</span>
            <span>Block Height: 2,491,023</span>
          </div>
          <div className="flex gap-6">
             <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
             <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
             <span>© 2025 zVANISH PROTOCOL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

