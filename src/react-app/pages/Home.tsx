import Layout from '@/react-app/components/Layout';
import StatsCard from '@/react-app/components/StatsCard';
import GrowthChart from '@/react-app/components/GrowthChart';
import LanguageChart from '@/react-app/components/LanguageChart';
import PulseButton from '@/react-app/components/PulseButton';
import PulseCard from '@/react-app/components/PulseCard';
import { Link } from 'react-router';
import { ArrowRight, Zap, Shield, Globe, Code, CheckCircle, Target, Users, Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePulse } from '@/react-app/contexts/PulseContext';

export default function HomePage() {
  const [billboardIndex, setBillboardIndex] = useState(0);
  const { pulsePhase, grainCount } = usePulse();
  
  const billboards = [
    "\"WE INTEGRATE. WE AUTOMATE. WE ELEVATE COMMERCE.\"",
    "\"A BUSINESS BUILT LIKE AN ECOSYSTEM – STRONG, CONNECTED, UNSTOPPABLE.\"",
    "\"MULTILINGUAL. MULTI-PLATFORM. MULTI-DIMENSIONAL.\"",
    "\"THE FUTURE OF GLOBAL COMMERCE STARTS HERE.\"",
    "\"FROM LOCAL STORES TO GLOBAL NETWORKS – SEAMLESSLY.\""
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBillboardIndex((prev) => (prev + 1) % billboards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Code,
      title: 'Comprehensive API',
      description: 'RESTful API with automated supply chain, payment processing, and webhook integrations',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Encrypted storage, request authentication, and comprehensive input validation',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Available in 12+ languages with seamless translation framework',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Multiple Integrations',
      description: 'Connect with payment gateways, cloud storage, e-commerce platforms, and AI services',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const quickLinks = [
    { title: 'Global Deployment', href: '/deployment', description: '847 deployments across 193 countries' },
    { title: 'Ecosystem Dashboard', href: '/ecosystem', description: 'Monitor 13,713 brands in real-time' },
    { title: 'Repository Sync', href: '/repo-sync', description: 'GitHub integration and sync status' },
    { title: 'Brand Explorer', href: '/brands', description: 'Search and filter ecosystem brands' },
    { title: 'API Documentation', href: '/api-docs', description: 'Comprehensive API reference' },
    { title: 'Configuration', href: '/configuration', description: 'Set up API keys and credentials' }
  ];

  return (
    <Layout>
      {/* Hero Section with Billboard */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden rounded-3xl mb-16 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="relative px-8 py-20 md:py-28">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6 inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-bold tracking-widest uppercase">
              🔒 Atom-Level Compliance | Phase: {pulsePhase}
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight font-serif">
              The Ecosystem That <br/>
              <span className="gold-gradient-text">Transformed Commerce</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 font-light max-w-3xl mx-auto leading-relaxed">
              Enterprise-scale deployment platform integrating Fruitful-global-deployment with 13,713 brands 
              across 193 countries. Real-time sync, multi-language support, and global infrastructure. 
              Current grain count: {grainCount.toLocaleString()}
            </p>
            
            {/* Live Billboard */}
            <PulseCard variant="glow" intensity="high" className="max-w-3xl mx-auto bg-gray-800/80 backdrop-blur-sm p-8 mb-10 border-l-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Live Strategic Directive</p>
              <h2 
                key={billboardIndex}
                className="text-xl md:text-3xl font-serif italic text-white min-h-[60px] flex items-center justify-center animate-fade-in"
              >
                {billboards[billboardIndex]}
              </h2>
            </PulseCard>

            <div className="flex flex-wrap justify-center gap-4">
              <PulseButton
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/api-docs'}
              >
                Get Started
                <ArrowRight className="w-6 h-6" />
              </PulseButton>
              <PulseButton
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/id-finder'}
              >
                ID Finder Tool
              </PulseButton>
            </div>
          </div>
        </div>
      </div>

      {/* Core Philosophy */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 font-serif">Structural Magnificence</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The Banimal Ecosystem functions as a self-sustaining mechanism for economic expansion across multiple platforms and languages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PulseCard variant="premium" intensity="medium" className="p-8 text-center">
            <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-6">
              1
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">The Foundation</h3>
            <p className="text-gray-600 leading-relaxed">
              Patented integration framework. RESTful architecture designed for scalability and reliability.
            </p>
          </PulseCard>
          <PulseCard variant="premium" intensity="medium" className="p-8 text-center">
            <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-6">
              2
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">The Network</h3>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive ecosystem connecting payment gateways, cloud storage, and e-commerce platforms globally.
            </p>
          </PulseCard>
          <PulseCard variant="premium" intensity="medium" className="p-8 text-center">
            <div className="w-16 h-16 gradient-green rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-6">
              3
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">The Growth</h3>
            <p className="text-gray-600 leading-relaxed">
              Exponential expansion through multilingual support and structured compliance frameworks.
            </p>
          </PulseCard>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="mb-16">
        <div className="mb-10 border-l-4 border-yellow-600 pl-6">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">Market Intelligence</h2>
          <p className="mt-2 text-gray-600">Real-time metrics showcasing the power of the Banimal Ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard 
            icon={Database} 
            value="13,713" 
            label="Global Brands"
            gradient="from-yellow-500 to-amber-600"
            sublabel="Three-Tier Ecosystem"
          />
          <StatsCard 
            icon={Globe} 
            value="193" 
            label="Countries"
            gradient="from-blue-500 to-cyan-600"
            sublabel="Worldwide Coverage"
          />
          <StatsCard 
            icon={Target} 
            value="847" 
            label="Deployments"
            gradient="from-purple-500 to-indigo-600"
            sublabel="Active Infrastructure"
          />
          <StatsCard 
            icon={Users} 
            value="5.2B" 
            label="Global Users"
            gradient="from-green-500 to-emerald-600"
            sublabel="Connected Globally"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GrowthChart />
          <LanguageChart />
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-serif">🌟 Platform Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <PulseCard
                key={index}
                variant="premium"
                intensity="low"
                className="p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </PulseCard>
            );
          })}
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-serif">🚀 Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
            >
              <PulseCard variant="default" intensity="low" className="p-8 group h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{link.description}</p>
                <ArrowRight className="w-6 h-6 text-yellow-600 group-hover:translate-x-2 transition-transform" />
              </PulseCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started CTA */}
      <div className="gradient-purple rounded-3xl p-10 md:p-16 text-white mb-16 shadow-2xl">
        <h2 className="text-4xl font-black mb-8 font-serif text-center">⚡ Quick Setup (5 Minutes)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[
              { num: 1, title: 'Log into WordPress admin', desc: 'Access at banimal.co.za/wp-admin' },
              { num: 2, title: 'Navigate to Banimal → Configuration', desc: 'Enter your Master API Key' },
              { num: 3, title: 'Configure integrations', desc: 'Add payment gateways and services' },
              { num: 4, title: 'Save and test', desc: 'Verify setup in API Status' }
            ].map((step) => (
              <PulseCard key={step.num} variant="glow" intensity="medium" className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                <div className="flex-shrink-0 w-10 h-10 gradient-gold rounded-full flex items-center justify-center text-gray-900 font-black text-lg">
                  {step.num}
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">{step.title}</p>
                  <p className="text-purple-100 text-sm">{step.desc}</p>
                </div>
              </PulseCard>
            ))}
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="font-bold text-2xl mb-6 text-gray-900 font-serif">Need Assistance?</h3>
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-200">
                <p className="text-gray-900 font-bold mb-1">📚 Comprehensive Documentation</p>
                <p className="text-sm text-gray-600">Step-by-step setup guides and API references</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-gray-900 font-bold mb-1">🆘 Technical Support</p>
                <p className="text-sm text-gray-600">support@banimal.co.za</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-gray-900 font-bold mb-1">🌐 Official Website</p>
                <p className="text-sm text-gray-600">banimal.co.za</p>
              </div>
              <div>
                <p className="text-gray-900 font-bold mb-1">🌍 Translation Contributions</p>
                <p className="text-sm text-gray-600">translations@banimal.co.za</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's New */}
      <PulseCard variant="premium" intensity="low" className="p-10 rounded-3xl">
        <h2 className="text-4xl font-black text-gray-900 mb-8 font-serif">📝 Release Notes</h2>
        <div className="space-y-8">
          <div className="border-l-4 border-green-500 pl-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                v5.0.0 - Current
              </span>
              <span className="text-gray-500 text-sm font-medium">December 31, 2025</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">🎉 Global Sync & Pulse System</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Unified 9s pulse system synchronized across all pages and components</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Breathing UI elements that respond to global ecosystem heartbeat</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Connected buttons, cards, and navigation with shared pulse context</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Real-time grain counting and phase transitions visible globally</span>
              </li>
            </ul>
          </div>
        </div>
      </PulseCard>
    </Layout>
  );
}
