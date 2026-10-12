import Layout from '@/react-app/components/Layout';
import { CreditCard, ShoppingCart, Cloud, Cpu, Webhook, CheckCircle } from 'lucide-react';

export default function Integrations() {
  const integrations = [
    {
      category: '💳 Payment Gateways',
      icon: CreditCard,
      color: 'from-blue-500 via-cyan-500 to-blue-600',
      services: [
        { name: 'Paystack', logo: '🇳🇬', description: 'African payment processing', status: 'Active' },
        { name: 'Stripe', logo: '💳', description: 'Global payment platform', status: 'Active' },
        { name: 'PayPal', logo: '💵', description: 'Worldwide payment system', status: 'Active' },
        { name: 'Payfast', logo: '🇿🇦', description: 'South African payments', status: 'Active' },
        { name: 'Flutterwave', logo: '🦋', description: 'African fintech platform', status: 'Active' },
        { name: 'M-Pesa', logo: '📱', description: 'Mobile money transfer', status: 'Active' },
        { name: 'Square', logo: '⬛', description: 'Point of sale & payments', status: 'Active' },
        { name: 'Alipay', logo: '🇨🇳', description: 'Chinese payment platform', status: 'Active' }
      ]
    },
    {
      category: '🛒 E-Commerce Platforms',
      icon: ShoppingCart,
      color: 'from-purple-500 via-pink-500 to-purple-600',
      services: [
        { name: 'WooCommerce', logo: '🛍️', description: 'WordPress e-commerce plugin', status: 'Active' },
        { name: 'AliExpress', logo: '🏪', description: 'Global marketplace', status: 'Active' },
        { name: 'Alibaba', logo: '🏭', description: 'B2B marketplace', status: 'Active' }
      ]
    },
    {
      category: '☁️ Cloud Storage & Sync',
      icon: Cloud,
      color: 'from-green-500 via-emerald-500 to-green-600',
      services: [
        { name: 'Google Drive', logo: '📁', description: 'Cloud file storage', status: 'Active' },
        { name: 'GitHub', logo: '🐙', description: 'Version control & sync', status: 'Active' },
        { name: 'Cloudflare R2', logo: '☁️', description: 'Object storage', status: 'Active' },
        { name: 'Custom Backend API', logo: '🔌', description: 'Your own API endpoint', status: 'Active' }
      ]
    },
    {
      category: '🤖 AI & Other Services',
      icon: Cpu,
      color: 'from-orange-500 via-red-500 to-orange-600',
      services: [
        { name: 'OpenAI', logo: '🧠', description: 'AI language models', status: 'Active' },
        { name: 'Webhooks', logo: '🔗', description: 'Custom HTTP callbacks', status: 'Active' }
      ]
    }
  ];

  const totalIntegrations = integrations.reduce((sum, cat) => sum + cat.services.length, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              🌐 Global Integration Network
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Connect with {totalIntegrations} services across payment gateways, cloud storage, e-commerce platforms, and AI services
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-slide-up">
          <div className="premium-card p-8 text-center rounded-2xl border-2 border-blue-200">
            <div className="text-5xl font-black mb-3">
              <span className="bg-linear-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent">8</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Payment Gateways</div>
          </div>
          <div className="premium-card p-8 text-center rounded-2xl border-2 border-purple-200">
            <div className="text-5xl font-black mb-3">
              <span className="bg-linear-to-br from-purple-500 to-pink-600 bg-clip-text text-transparent">3</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">E-Commerce</div>
          </div>
          <div className="premium-card p-8 text-center rounded-2xl border-2 border-green-200">
            <div className="text-5xl font-black mb-3">
              <span className="bg-linear-to-br from-green-500 to-emerald-600 bg-clip-text text-transparent">4</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Cloud Services</div>
          </div>
          <div className="premium-card p-8 text-center rounded-2xl border-2 border-orange-200">
            <div className="text-5xl font-black mb-3">
              <span className="bg-linear-to-br from-orange-500 to-red-600 bg-clip-text text-transparent">2</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">AI Services</div>
          </div>
        </div>

        {/* Integration Categories */}
        <div className="space-y-10">
          {integrations.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={catIndex}
                className="premium-card rounded-3xl overflow-hidden shadow-2xl animate-slide-up"
                style={{ animationDelay: `${catIndex * 0.1}s` }}
              >
                {/* Category Header */}
                <div className={`bg-linear-to-r ${category.color} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-xs rounded-2xl">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black font-serif">{category.category}</h2>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="p-8 bg-linear-to-br from-white to-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.services.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="group premium-card p-6 rounded-2xl hover:scale-105 transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <span className="text-5xl group-hover:scale-110 transition-transform">{service.logo}</span>
                            <div>
                              <h3 className="font-black text-gray-900 text-xl group-hover:text-yellow-600 transition-colors">
                                {service.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg font-bold uppercase tracking-wide">
                            {service.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How to Configure */}
        <div className="mt-12 premium-card bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 font-serif">
            <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl">
              <Webhook className="w-8 h-8" />
            </div>
            How to Configure Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                1
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Access Configuration</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Log into WordPress admin and navigate to Banimal → Configuration
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                2
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Add API Keys</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Enter your API keys and credentials for each service you want to use
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                3
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Test Integration</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Visit Banimal → API Status to verify each integration is working correctly
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="shrink-0 w-12 h-12 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                4
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Start Using</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Make API calls using the configured services through the Banimal API endpoints
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="mt-12 premium-card rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-black text-gray-900 mb-8 font-serif">✨ Why Use Banimal Integrations?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Secure Credentials</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                All API keys are encrypted and stored securely using WordPress security standards
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Unified Interface</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Access all services through a single consistent API without managing multiple SDKs
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Auto Sync</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Data automatically syncs across configured cloud storage and GitHub repositories
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-linear-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Central Monitoring</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Monitor all integrations from a single dashboard with health checks and logs
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Global Payments</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Accept payments from customers worldwide through 8+ payment gateways
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
              <div className="text-5xl mb-4">🔌</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Webhook Integration</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect external services via webhooks for real-time event notifications
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
