import Layout from '@/react-app/components/Layout';
import { Grid3x3, Layers, TrendingUp, CheckCircle, Lock, Target, Zap, Globe, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Omnigrid() {
  const [billboardIndex, setBillboardIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const billboards = [
    "\"WE BUY CRATES. WE SELL CRATES. WE BRAND CRATES.\"",
    "\"DONKEYS DON'T NEED ROADS. FAA™ DOESN'T NEED PERMISSION.\"",
    "\"AFRICA IS NOT COMING. AFRICA IS HERE.\"",
    "\"$100M GETS YOU 120 BRANDS & A WORLD-FIRST.\"",
    "\"A BUSINESS BUILT LIKE A TREE – STRONG, ROOTED, UNSTOPPABLE.\"",
    "\"THE SEED THAT SHOOK NEW YORK.\"",
    "\"BAOBAB-LEVEL COMPLIANCE – STRENGTH THAT LASTS 1000 YEARS.\"",
    "\"FAA™ SCALING SO FAST, EVEN DONKEYS CAN'T KEEP UP.\""
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBillboardIndex((prev) => (prev + 1) % billboards.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const gridStats = {
    totalBrands: 120,
    valuationTarget: 100,
    languages: 111,
    assetUnits: 400000,
    complianceScore: 99.9,
    globalNodes: 47
  };

  const coreMetrics = [
    {
      title: 'Patented Brands',
      value: '120',
      icon: Grid3x3,
      gradient: 'from-yellow-500 to-amber-600',
      description: 'Complete IP portfolio under Playing with the Seed™'
    },
    {
      title: 'Valuation Target',
      value: '$100B',
      icon: TrendingUp,
      gradient: 'from-green-600 to-emerald-700',
      description: '1000-year Baobab growth model'
    },
    {
      title: 'Language Reach',
      value: '111',
      icon: Globe,
      gradient: 'from-blue-500 to-cyan-600',
      description: 'Global linguistic compliance infrastructure'
    },
    {
      title: 'Asset Units',
      value: '400K',
      icon: Layers,
      gradient: 'from-red-600 to-rose-700',
      description: 'Crates available for branding & deployment'
    }
  ];

  const compliancePillars = [
    {
      title: 'Atom-Level Compliance™',
      description: 'Precision legal & economic infrastructure',
      icon: Lock,
      status: 'active',
      coverage: '100%'
    },
    {
      title: 'Inline Compliance™',
      description: 'Real-time regulatory synchronization',
      icon: Zap,
      status: 'active',
      coverage: '99.9%'
    },
    {
      title: 'Baobab Legacy Fund',
      description: 'Financial anchoring for 1000-year vision',
      icon: Target,
      status: 'active',
      coverage: '100%'
    }
  ];

  const brands = [
    { name: "Playing with the Seed™", category: "governance", desc: "Master licensing powerhouse governing all 120 brands", priority: 'critical' },
    { name: "FAA™ Ecosystem", category: "infrastructure", desc: "Central governance model for economic expansion", priority: 'critical' },
    { name: "Atom-Level Compliance™", category: "governance", desc: "Precision legal & regulatory framework", priority: 'critical' },
    { name: "Fruitful Crate Dance™", category: "culture", desc: "World-first global streaming event infrastructure", priority: 'high' },
    { name: "Donkey & Rocket™", category: "infrastructure", desc: "Revolutionary logistics philosophy", priority: 'high' },
    { name: "Inline Compliance™", category: "governance", desc: "Real-time regulatory synchronization system", priority: 'critical' },
    { name: "Baobab Legacy Fund", category: "governance", desc: "Financial vehicle for 1000-year growth", priority: 'critical' },
    { name: "Crate Nation", category: "culture", desc: "Consumer-facing brand integration platform", priority: 'medium' },
    { name: "HSOMNI9000", category: "infrastructure", desc: "Advanced mesh network coordination", priority: 'high' },
    { name: "Seedwave Premium", category: "culture", desc: "Premium tier access and benefits", priority: 'medium' },
    { name: "Global Crate Network", category: "infrastructure", desc: "Physical distribution infrastructure", priority: 'high' },
    { name: "Zero Waste Chain", category: "infrastructure", desc: "Sustainable supply chain operations", priority: 'medium' }
  ];

  const marketPresence = [
    { region: 'Africa Core', percentage: 45, color: 'bg-green-600', status: 'dominant' },
    { region: 'Asia Trade', percentage: 25, color: 'bg-yellow-600', status: 'expanding' },
    { region: 'Western Markets', percentage: 20, color: 'bg-red-600', status: 'established' },
    { region: 'Emerging Dialects', percentage: 21, color: 'bg-blue-600', status: 'growing' }
  ];

  const sponsorshipTiers = [
    {
      name: 'Tier 1 Sponsor',
      investment: '$100M',
      access: 'Complete ecosystem ownership',
      brands: 120,
      period: 'Perpetual',
      benefits: ['All 120 brands', 'Master licensing rights', 'Global exclusivity', 'Board seat']
    },
    {
      name: 'Bulk Crate Deal',
      investment: '$25/unit',
      access: '20-year branding rights',
      brands: 'Select portfolio',
      period: '20 years',
      benefits: ['Choose crate quantity', 'Global deployment', 'Compliance protected', 'ROI tracking']
    },
    {
      name: 'Regional Partner',
      investment: 'Custom',
      access: 'Territory-specific rights',
      brands: 'Regional subset',
      period: '10 years',
      benefits: ['Geographic exclusivity', 'Local branding', 'Market insights', 'Support network']
    }
  ];

  return (
    <Layout>
      {/* Hero Section with Billboard */}
      <div className="mb-12">
        <div className="premium-card p-10 bg-gradient-to-br from-stone-900 via-gray-900 to-stone-900 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-block px-4 py-1 border border-yellow-500/50 rounded-full text-yellow-500 text-xs font-bold tracking-widest uppercase mb-4">
                The Baobab Directive
              </div>
              <h1 className="text-5xl font-black mb-3 font-serif">
                🌳 Omnigrid Command Center
              </h1>
              <p className="text-xl text-gray-300">
                120 Brands. $100 Billion Vision. 1000-Year Legacy.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 text-center">
              <div className="text-4xl font-black text-yellow-500 mb-1">{gridStats.complianceScore}%</div>
              <div className="text-sm text-gray-300">Compliance</div>
            </div>
          </div>

          {/* Live Billboard */}
          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-red-700">
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest mb-4">Live Slogan Directive</p>
            <h2 
              key={billboardIndex}
              className="text-2xl md:text-3xl font-serif italic text-white min-h-[80px] flex items-center justify-center animate-fade-in"
            >
              {billboards[billboardIndex]}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-gray-300 mb-1">Brands</div>
              <div className="text-3xl font-black">{gridStats.totalBrands}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-gray-300 mb-1">Target</div>
              <div className="text-3xl font-black">${gridStats.valuationTarget}B</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-gray-300 mb-1">Languages</div>
              <div className="text-3xl font-black">{gridStats.languages}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-gray-300 mb-1">Units</div>
              <div className="text-3xl font-black">{(gridStats.assetUnits / 1000).toFixed(0)}K</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-gray-300 mb-1">Compliance</div>
              <div className="text-3xl font-black text-green-400">{gridStats.complianceScore}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-gray-300 mb-1">Nodes</div>
              <div className="text-3xl font-black">{gridStats.globalNodes}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Structural Magnificence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="premium-card p-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${metric.gradient} mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{metric.title}</h3>
                <div className="text-4xl font-black text-gray-900 mb-3">{metric.value}</div>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Pillars */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Compliance Infrastructure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {compliancePillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="premium-card p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Icon className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    ✓ {pillar.status.toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{pillar.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Coverage</span>
                  <span className="font-bold text-green-600">{pillar.coverage}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Presence */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Global Market Presence</h2>
        <div className="premium-card p-8">
          <div className="space-y-6">
            {marketPresence.map((market, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{market.region}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      market.status === 'dominant' ? 'bg-green-100 text-green-700' :
                      market.status === 'expanding' ? 'bg-yellow-100 text-yellow-700' :
                      market.status === 'established' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {market.status}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-gray-900">{market.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${market.color} h-3 rounded-full transition-all`}
                    style={{ width: `${market.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Explorer */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">120-Brand Dominion</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none font-medium"
          >
            <option value="all">All Categories</option>
            <option value="governance">Governance</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="culture">Culture</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands
            .filter(b => selectedCategory === 'all' || b.category === selectedCategory)
            .map((brand, index) => (
            <div key={index} className="premium-card p-6">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  brand.category === 'governance' ? 'bg-red-100 text-red-700' :
                  brand.category === 'infrastructure' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {brand.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  brand.priority === 'critical' ? 'bg-red-100 text-red-700' :
                  brand.priority === 'high' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {brand.priority === 'critical' ? '⚡' : brand.priority === 'high' ? '⭐' : '•'} {brand.priority}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{brand.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{brand.desc}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>COMPLIANT</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsorship Tiers */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Tier 1 Sponsorship Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sponsorshipTiers.map((tier, index) => (
            <div key={index} className={`premium-card p-8 ${index === 0 ? 'border-4 border-yellow-500' : ''}`}>
              {index === 0 && (
                <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase inline-block mb-4">
                  ⭐ Premium Tier
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{tier.name}</h3>
              <div className="text-4xl font-black text-gray-900 mb-2">{tier.investment}</div>
              <p className="text-sm text-gray-600 mb-6">{tier.access}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Brands</div>
                  <div className="font-bold text-gray-900">{tier.brands}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Period</div>
                  <div className="font-bold text-gray-900">{tier.period}</div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {tier.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                index === 0 
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}>
                {index === 0 ? 'Secure Total Ownership' : 'Explore Options'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Repository Integration */}
      <div className="premium-card p-10 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0 w-20 h-20 gradient-gold rounded-2xl flex items-center justify-center">
            <Grid3x3 className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-serif">Connected Repository</h2>
            <p className="text-lg text-gray-700 mb-4">
              Real-time synchronization with Omnigrid infrastructure repository
            </p>
            <div className="bg-white/80 p-4 rounded-xl font-mono text-sm text-gray-900 border-2 border-yellow-600">
              git@github.com:heyns1000/omnigrid.git
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-yellow-200">
            <Users className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">120 Brands Tracked</h3>
            <p className="text-sm text-gray-600">Complete portfolio management and IP governance</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">$100B Target</h3>
            <p className="text-sm text-gray-600">Baobab-level growth trajectory tracking</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-blue-200">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">99.9% Compliance</h3>
            <p className="text-sm text-gray-600">Atom-level regulatory precision</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
