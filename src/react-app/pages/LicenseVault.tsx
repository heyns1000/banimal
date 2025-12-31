import { useState, useEffect } from 'react';
import Layout from '@/react-app/components/Layout';
import { usePulse } from '@/react-app/contexts/PulseContext';
import PulseCard from '@/react-app/components/PulseCard';
import PulseIndicator from '@/react-app/components/PulseIndicator';
import { 
  Vault, 
  Zap, 
  ShoppingCart, 
  CheckCircle, 
  Package, 
  DollarSign,
  Lock,
  Unlock,
  RefreshCw,
  GitBranch,
  Database,
  TreePine,
  Activity
} from 'lucide-react';

interface License {
  id: number;
  license_code: string;
  name: string;
  description: string | null;
  price_usd: number;
  tier: string;
  category: string | null;
  status: string;
  sync_time_ms: number;
  repository_url: string | null;
  is_active: boolean;
}

interface CartItem extends License {
  cart_item_id?: number;
}

interface CartSession {
  session_id: string;
  total_amount: number;
  care_loop_amount: number;
  grain_count: number;
  status: string;
}

export default function LicenseVault() {
  const { pulseSecond, pulsePhase, pulseColor, grainCount, breathIntensity } = usePulse();
  
  const [licenses, setLicenses] = useState<License[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [cartSession, setCartSession] = useState<CartSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [stats, setStats] = useState({ total_licenses: 0, total_revenue: 0, sync_speed: 80 });

  useEffect(() => {
    fetchLicenses();
    initCart();
    fetchStats();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await fetch('/api/licenses');
      if (response.ok) {
        const data = await response.json();
        setLicenses(data.licenses || []);
      }
    } catch (error) {
      console.error('Failed to fetch licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const initCart = async () => {
    try {
      const storedSid = localStorage.getItem('cart_session_id');
      if (!storedSid) {
        const response = await fetch('/api/licenses/cart/session');
        if (response.ok) {
          const data = await response.json();
          const sid = data.session_id;
          localStorage.setItem('cart_session_id', sid);
          setSessionId(sid);
          setCartItems(data.items || []);
          setCartSession(data.session);
        }
      } else {
        const response = await fetch(`/api/licenses/cart/session?session_id=${storedSid}`);
        if (response.ok) {
          const data = await response.json();
          setSessionId(storedSid);
          setCartItems(data.items || []);
          setCartSession(data.session);
        }
      }
    } catch (error) {
      console.error('Failed to init cart:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/licenses/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || { total_licenses: 0, total_revenue: 0, sync_speed: 80 });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const addToCart = async (license: License) => {
    try {
      const response = await fetch('/api/licenses/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, license_id: license.id })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(prev => [...prev, license]);
        setCartSession(prev => prev ? {
          ...prev,
          total_amount: data.total,
          care_loop_amount: data.care_loop
        } : null);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (licenseId: number) => {
    try {
      const response = await fetch('/api/licenses/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, license_id: licenseId })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(prev => prev.filter(item => item.id !== licenseId));
        setCartSession(prev => prev ? {
          ...prev,
          total_amount: data.total,
          care_loop_amount: data.care_loop
        } : null);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const processCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/licenses/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, grain_count: grainCount })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ BareCart™ Checkout Complete\n\n` +
          `Transaction ID: ${data.transaction_id}\n` +
          `Total: $${(data.total_amount / 100).toLocaleString()}\n` +
          `Care Loop (15%): $${(data.care_loop_amount / 100).toLocaleString()}\n` +
          `Grains: ${data.grain_count}\n` +
          `Sync: ${data.sync_time}\n\n` +
          `Status: ${data.status.toUpperCase()}`);
        
        // Reset cart
        setCartItems([]);
        setCartSession(null);
        localStorage.removeItem('cart_session_id');
        await initCart();
        await fetchStats();
      }
    } catch (error) {
      console.error('Failed to checkout:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    const t = tier.toLowerCase();
    if (t === 'sovereign') return 'purple';
    if (t === 'dynastic') return 'blue';
    if (t === 'operational') return 'green';
    return 'gray';
  };

  const totalAmount = cartSession?.total_amount || 0;
  const careLoopAmount = cartSession?.care_loop_amount || 0;

  return (
    <Layout>
      <div className="animate-in fade-in duration-500">
        {/* Hero Header */}
        <PulseCard 
          variant="premium" 
          intensity="high" 
          className="mb-12 p-10 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white relative overflow-hidden"
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"
            style={{
              opacity: 0.3 + (breathIntensity * 0.7),
              transform: `scale(${0.8 + (breathIntensity * 0.4)})`
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
            style={{
              opacity: 0.3 + (breathIntensity * 0.7),
              transform: `scale(${0.8 + (breathIntensity * 0.4)})`
            }}
          ></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div 
                  className="flex items-center gap-3 mb-3"
                  style={{
                    transform: `scale(${0.98 + (breathIntensity * 0.04)})`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Vault className="w-12 h-12" />
                  <h1 className="text-5xl font-black font-serif">LicenseVault</h1>
                </div>
                <p className="text-xl text-purple-200 mb-2">0.08sec Global Ecosystem Sync</p>
                <div className="bg-black/30 p-3 rounded-xl font-mono text-xs inline-block">
                  git@github.com:heyns1000/LicenseVault.git
                </div>
              </div>

              {/* Live Pulse Monitor */}
              <PulseCard 
                variant="glow" 
                intensity="high"
                className="p-6 rounded-2xl border-2"
                style={{
                  borderColor: pulseColor,
                  backgroundColor: `${pulseColor}22`
                }}
              >
                <div className="text-xs text-purple-200 uppercase tracking-widest mb-2">Restructure Pulse</div>
                <div 
                  className="text-6xl font-black mb-2"
                  style={{
                    color: pulseColor,
                    transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  0.08s
                </div>
                <PulseIndicator size="sm" showLabel={false} showGrains={true} />
              </PulseCard>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PulseCard 
                variant="glow" 
                intensity="medium"
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
              >
                <Lock 
                  className="w-6 h-6 mb-2 text-purple-400"
                  style={{
                    transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                    transition: 'transform 0.3s ease'
                  }}
                />
                <div className="text-sm text-purple-200 mb-1">Total Licenses</div>
                <div 
                  className="text-2xl font-black"
                  style={{
                    color: pulseColor,
                    transform: `scale(${0.98 + (breathIntensity * 0.04)})`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? '...' : stats.total_licenses}
                </div>
              </PulseCard>

              <PulseCard 
                variant="default" 
                intensity="low"
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
              >
                <DollarSign className="w-6 h-6 mb-2 text-green-400" />
                <div className="text-sm text-purple-200 mb-1">Total Revenue</div>
                <div className="text-2xl font-black">${(stats.total_revenue / 100).toLocaleString()}</div>
              </PulseCard>

              <PulseCard 
                variant="default" 
                intensity="low"
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
              >
                <Zap className="w-6 h-6 mb-2 text-yellow-400" />
                <div className="text-sm text-purple-200 mb-1">Sync Speed</div>
                <div className="text-2xl font-black">0.08s</div>
              </PulseCard>

              <PulseCard 
                variant="default" 
                intensity="low"
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
              >
                <CheckCircle className="w-6 h-6 mb-2 text-blue-400" />
                <div className="text-sm text-purple-200 mb-1">Zero Waste</div>
                <div className="text-2xl font-black">100%</div>
              </PulseCard>
            </div>
          </div>
        </PulseCard>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* License Vault - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-3xl font-bold text-gray-900 font-serif"
                style={{
                  transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                  transition: 'transform 0.3s ease'
                }}
              >
                Available Licenses
              </h2>
              <PulseCard variant="glow" intensity="low" className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl">
                <Database className="w-4 h-4" style={{ color: pulseColor }} />
                <span className="text-gray-600">Live Database</span>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: pulseColor,
                    boxShadow: `0 0 ${10 * breathIntensity}px ${pulseColor}`
                  }}
                ></div>
              </PulseCard>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Syncing with LicenseVault...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {licenses.map(license => {
                  const tierColor = getTierColor(license.tier);
                  const inCart = cartItems.some(item => item.id === license.id);
                  
                  return (
                    <PulseCard
                      key={license.id}
                      variant={inCart ? "glow" : "default"}
                      intensity={inCart ? "medium" : "low"}
                      className={`p-6 rounded-3xl border relative overflow-hidden ${
                        inCart ? 'border-green-500/50 shadow-xl' : 'border-gray-200'
                      }`}
                      style={{
                        transform: inCart ? `scale(${0.98 + (breathIntensity * 0.04)})` : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {/* Tier Badge */}
                      <div 
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                          tierColor === 'purple' ? 'bg-purple-100 text-purple-700' :
                          tierColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                          tierColor === 'green' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                        style={{
                          opacity: 0.8 + (breathIntensity * 0.2)
                        }}
                      >
                        {license.tier}
                      </div>

                      {/* License Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {inCart ? (
                            <CheckCircle className="w-5 h-5" style={{ color: pulseColor }} />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
                            {license.license_code}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{license.name}</h3>
                        {license.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{license.description}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div 
                          className="text-3xl font-black text-gray-900"
                          style={{
                            transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          ${(license.price_usd / 100).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Care Loop: ${((license.price_usd * 0.15) / 100).toLocaleString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => inCart ? removeFromCart(license.id) : addToCart(license)}
                        className={`w-full font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                          inCart 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        }`}
                        style={{
                          transform: inCart ? `scale(${0.95 + (breathIntensity * 0.05)})` : 'scale(1)'
                        }}
                      >
                        {inCart ? (
                          <>
                            <Unlock className="w-5 h-5" />
                            Remove from Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            Add to BareCart™
                          </>
                        )}
                      </button>
                    </PulseCard>
                  );
                })}
              </div>
            )}
          </div>

          {/* BareCart Checkout - Right column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Cart Header */}
              <PulseCard 
                variant="premium" 
                intensity="high"
                className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-l-4 rounded-2xl"
                style={{ borderColor: pulseColor }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingCart 
                    className="w-8 h-8"
                    style={{
                      color: pulseColor,
                      transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 font-serif">BareCart™</h2>
                    <p className="text-xs text-gray-600">Zero-Waste Checkout</p>
                  </div>
                </div>

                {/* Grain Counter */}
                <PulseCard variant="glow" intensity="medium" className="bg-white/50 p-3 rounded-xl mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Ecosystem Grains</span>
                    <span 
                      className="font-black text-gray-900"
                      style={{
                        color: pulseColor,
                        transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {grainCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((grainCount / 100) * 100, 100)}%`,
                        backgroundColor: pulseColor
                      }}
                    ></div>
                  </div>
                </PulseCard>

                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Phase: {pulsePhase} | Pulse: {pulseSecond}/9
                </div>
              </PulseCard>

              {/* Cart Items */}
              <PulseCard variant="default" intensity="low" className="p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Cart Items ({cartItems.length})
                </h3>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No items in cart</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {cartItems.map(item => (
                      <PulseCard
                        key={item.id}
                        variant="glow"
                        intensity="low"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        style={{
                          opacity: 0.8 + (breathIntensity * 0.2)
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-bold text-sm text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">${(item.price_usd / 100).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      </PulseCard>
                    ))}
                  </div>
                )}

                {/* Cart Summary */}
                {cartItems.length > 0 && (
                  <>
                    <div className="space-y-2 mb-6 pb-4 border-b-2 border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-bold text-gray-900">${(totalAmount / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Care Loop (15%)</span>
                        <span className="font-bold text-green-600">+${(careLoopAmount / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sync Time</span>
                        <span className="font-bold text-yellow-600">0.08s</span>
                      </div>
                    </div>

                    <div 
                      className="flex justify-between items-center mb-6"
                      style={{
                        transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-black text-gray-900">${(totalAmount / 100).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={processCheckout}
                      disabled={checkoutLoading}
                      className="w-full bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        transform: checkoutLoading ? 'scale(1)' : `scale(${0.98 + (breathIntensity * 0.02)})`
                      }}
                    >
                      {checkoutLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Process 0.08s Checkout
                        </>
                      )}
                    </button>
                  </>
                )}
              </PulseCard>

              {/* Sync Status */}
              <PulseCard 
                variant="glow" 
                intensity="medium"
                className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch 
                    className="w-5 h-5"
                    style={{
                      color: pulseColor,
                      transform: `rotate(${pulseSecond * 40}deg)`,
                      transition: 'transform 1s ease'
                    }}
                  />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Repository Sync</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Pull Frequency</span>
                    <span className="font-bold" style={{ color: pulseColor }}>0.08s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Push Latency</span>
                    <span className="font-bold" style={{ color: pulseColor }}>0.08s</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Zero Waste</span>
                    <span className="font-bold text-green-600">100%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Database</span>
                    <span className="font-bold text-blue-600 flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: pulseColor,
                          boxShadow: `0 0 ${8 * breathIntensity}px ${pulseColor}`
                        }}
                      ></div>
                      LIVE
                    </span>
                  </div>
                </div>
              </PulseCard>
            </div>
          </div>
        </div>

        {/* Integration Footer */}
        <PulseCard 
          variant="premium" 
          intensity="medium"
          className="mt-12 p-8 bg-gradient-to-br from-gray-900 to-purple-900 text-white rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 
                className="text-2xl font-bold mb-2 font-serif"
                style={{
                  transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                  transition: 'transform 0.3s ease'
                }}
              >
                Ecosystem Integration</h3>
              <p className="text-purple-200">LicenseVault → BareCart™ → 0.08s Sync → Zero Waste → Global Pulse</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-purple-200 mb-1">Live Sync</div>
                <div 
                  className="text-3xl font-black"
                  style={{
                    color: pulseColor,
                    transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  0.08s
                </div>
              </div>
              <TreePine 
                className="w-12 h-12 text-green-400"
                style={{
                  transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>
          </div>
        </PulseCard>
      </div>
    </Layout>
  );
}
