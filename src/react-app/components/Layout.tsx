import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Code, Search, Settings, Activity, Link as LinkIcon, Globe, Home, Database, Rocket, GitBranch, Leaf, Grid3x3, TreePine, Cpu, Building2, Zap, Bug, Cloud, Vault } from 'lucide-react';
import { useState } from 'react';
import { usePulse } from '@/react-app/contexts/PulseContext';
import PulseIndicator from '@/react-app/components/PulseIndicator';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { breathIntensity, pulseColor } = usePulse();

  const navigation = [
    { name: 'Overview', href: '/', icon: Home },
    { name: 'Baobab EcoStack', href: '/baobab-ecostack', icon: TreePine },
    { name: 'Nexus Nair', href: '/nexus-nair', icon: Zap },
    { name: 'Thesis Debug', href: '/thesis-debug', icon: Bug },
    { name: 'Fruitful API', href: '/fruitful-api', icon: Cloud },
    { name: 'License Vault', href: '/license-vault', icon: Vault },
    { name: 'Omnigrid Engine', href: '/omnigrid-engine', icon: Cpu },
    { name: 'Enterprise Payroll', href: '/enterprise-payroll', icon: Building2 },
    { name: 'Ecosystem', href: '/ecosystem', icon: Database },
    { name: 'Deployment', href: '/deployment', icon: Rocket },
    { name: 'Repository Sync', href: '/repo-sync', icon: GitBranch },
    { name: 'Baobab Portal', href: '/baobab-portal', icon: TreePine },
    { name: 'Omnigrid', href: '/omnigrid', icon: Grid3x3 },
    { name: 'Planet Change', href: '/planet-change', icon: Leaf },
    { name: 'Brand Explorer', href: '/brands', icon: Search },
    { name: 'Sync Listener', href: '/sync', icon: Activity },
    { name: 'API Docs', href: '/api-docs', icon: Code },
    { name: 'Configuration', href: '/configuration', icon: Settings },
    { name: 'Integrations', href: '/integrations', icon: LinkIcon },
    { name: 'Languages', href: '/languages', icon: Globe },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-gray-50">
      {/* Header */}
      <header 
        className="glass sticky top-0 z-50 border-b border-gray-200/50 shadow-lg transition-all duration-300"
        style={{
          boxShadow: `0 1px 3px ${pulseColor}11, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-300"
                  style={{
                    opacity: 0.4 + (breathIntensity * 0.3)
                  }}
                ></div>
                <div 
                  className="relative text-5xl transform group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-2xl shadow-lg"
                  style={{
                    transform: `scale(${0.95 + (breathIntensity * 0.05)})`,
                    boxShadow: `0 0 ${20 * breathIntensity}px ${pulseColor}44`
                  }}
                >
                  🐾
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black font-serif">
                  <span className="bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 bg-clip-text text-transparent">
                    Banimal Ecosystem
                  </span>
                </h1>
                <div className="flex items-center gap-3">
                  <PulseIndicator size="sm" showLabel={false} showGrains={false} />
                  <p className="text-xs text-gray-600 font-bold">v5.0.0 - Global Sync</p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 shadow-lg font-bold'
                        : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                    }`}
                    style={isActive(item.href) ? {
                      transform: `scale(${1 + (breathIntensity * 0.02)})`,
                      boxShadow: `0 0 ${20 * breathIntensity}px ${pulseColor}33`
                    } : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl hover:bg-white/60 transition-all shadow-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 glass">
            <nav className="px-4 py-3 space-y-2 max-h-[70vh] overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 shadow-lg font-bold'
                        : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                    }`}
                    style={isActive(item.href) ? {
                      boxShadow: `0 0 ${20 * breathIntensity}px ${pulseColor}33`
                    } : undefined}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl gradient-gold p-3 rounded-2xl shadow-lg">🐾</div>
                <div>
                  <h3 className="text-white font-black text-xl font-serif">Banimal</h3>
                  <p className="text-xs text-gray-400 font-semibold">Ecosystem Sync</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Three-tier brand synchronization system monitoring 13,713 brands across FAA™, HSOMNI9000, and Seedwave
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-semibold">System Operational</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 font-serif text-lg">Ecosystem</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/ecosystem" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span>→</span>Dashboard</Link></li>
                <li><Link to="/brands" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span>→</span>Brand Explorer</Link></li>
                <li><Link to="/sync" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span>→</span>Sync Listener</Link></li>
                <li><Link to="/api-docs" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"><span>→</span>API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 font-serif text-lg">Systems</h4>
              <ul className="space-y-3 text-sm">
                <li><div className="text-gray-400 flex items-center gap-2"><span>🏛️</span>FAA™ (7,344 brands)</div></li>
                <li><div className="text-gray-400 flex items-center gap-2"><span>🧠</span>HSOMNI9000 (6,219)</div></li>
                <li><div className="text-gray-400 flex items-center gap-2"><span>🌱</span>Seedwave (150)</div></li>
                <li><div className="text-yellow-400 font-bold flex items-center gap-2"><span>✅</span>13,713 Total</div></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 font-serif text-lg">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:support@banimal.co.za" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <div className="font-semibold text-white mb-1">Technical Support</div>
                    support@banimal.co.za
                  </a>
                </li>
                <li>
                  <a href="mailto:translations@banimal.co.za" className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <div className="font-semibold text-white mb-1">Translations</div>
                    translations@banimal.co.za
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                &copy; 2025 Banimal Ecosystem. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 gradient-gold rounded-full"></span>
                  13,713 Brands
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 gradient-green rounded-full"></span>
                  3 Systems
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 gradient-purple rounded-full"></span>
                  v5.0.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
