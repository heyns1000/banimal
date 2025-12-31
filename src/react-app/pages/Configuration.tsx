import Layout from '@/react-app/components/Layout';
import { Settings, Key, CreditCard, Cloud, Webhook, AlertCircle, Shield, Lock, CheckCircle } from 'lucide-react';

export default function Configuration() {
  const configSections = [
    {
      icon: Key,
      title: 'Master API Key',
      description: 'Your primary authentication key for all API requests',
      color: 'from-purple-500 via-pink-500 to-purple-600',
      emoji: '🔑',
      fields: ['Banimal Master API Key']
    },
    {
      icon: CreditCard,
      title: 'Payment Gateways',
      description: 'Configure payment processing integrations',
      color: 'from-blue-500 via-cyan-500 to-blue-600',
      emoji: '💳',
      fields: [
        'Paystack API Key',
        'Stripe Secret Key',
        'PayPal Client ID',
        'Payfast Merchant ID',
        'Flutterwave Public Key',
        'M-Pesa Consumer Key',
        'Square Access Token',
        'Alipay App ID'
      ]
    },
    {
      icon: Cloud,
      title: 'Cloud Storage & Sync',
      description: 'Set up synchronization with cloud services',
      color: 'from-green-500 via-emerald-500 to-green-600',
      emoji: '☁️',
      fields: [
        'Google Drive Credentials',
        'GitHub Personal Access Token',
        'Cloudflare R2 Access Key',
        'Backend API Endpoint URL'
      ]
    },
    {
      icon: Webhook,
      title: 'Webhooks & Automation',
      description: 'External webhook URLs for ecosystem updates',
      color: 'from-orange-500 via-red-500 to-orange-600',
      emoji: '🔗',
      fields: [
        'WooCommerce Webhook Secret',
        'External Webhook URLs (comma-separated)',
        'Custom Automation Endpoints'
      ]
    }
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ⚙️ Configuration Hub
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Secure API key management and integration setup
          </p>
        </div>

        {/* Important Notice */}
        <div className="premium-card bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-300 rounded-3xl p-10 mb-12 animate-slide-up shadow-2xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full p-5 shadow-xl">
                <AlertCircle className="w-12 h-12" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-900 mb-4 font-serif">⚠️ WordPress Admin Access Required</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Configuration settings must be managed through your WordPress admin panel for security reasons. 
                This ensures all sensitive data remains encrypted and protected.
              </p>
              <div className="glass p-6 rounded-2xl border-2 border-yellow-300">
                <p className="font-bold text-gray-900 mb-4 text-lg">📋 Configuration Steps:</p>
                <ol className="space-y-3">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 gradient-gold rounded-full flex items-center justify-center font-black text-gray-900">1</span>
                    <div>
                      <span className="font-semibold text-gray-900">Log into WordPress admin at </span>
                      <code className="bg-white px-3 py-1 rounded-lg font-mono text-sm">banimal.co.za/wp-admin</code>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 gradient-gold rounded-full flex items-center justify-center font-black text-gray-900">2</span>
                    <span className="text-gray-700">Navigate to <strong className="text-gray-900">Banimal → Configuration</strong> in the sidebar</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 gradient-gold rounded-full flex items-center justify-center font-black text-gray-900">3</span>
                    <span className="text-gray-700">Enter your API keys and credentials</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 gradient-gold rounded-full flex items-center justify-center font-black text-gray-900">4</span>
                    <span className="text-gray-700">Click <strong className="text-gray-900">Save Configuration</strong></span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-10">
          {configSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="premium-card rounded-3xl overflow-hidden shadow-2xl animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Section Header */}
                <div className={`bg-gradient-to-r ${section.color} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                  <div className="relative flex items-center gap-4 mb-2">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Icon className="w-10 h-10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl">{section.emoji}</span>
                        <h3 className="text-3xl font-black font-serif">{section.title}</h3>
                      </div>
                      <p className="text-white/90 text-lg">{section.description}</p>
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                  <div className="space-y-4">
                    {section.fields.map((field, i) => (
                      <div key={i} className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
                        <div className="p-2 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform">
                          <Settings className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-gray-900 font-semibold text-lg">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Features */}
        <div className="mt-12 premium-card bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 font-serif">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Shield className="w-10 h-10" />
            </div>
            🔒 Enterprise Security Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-6 h-6" />
                <h3 className="font-bold text-xl">Encrypted Storage</h3>
              </div>
              <p className="text-indigo-100 leading-relaxed">
                All API keys are encrypted using WordPress AUTH_KEY before storage in the database
              </p>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3 mb-3">
                <Key className="w-6 h-6" />
                <h3 className="font-bold text-xl">Key Rotation</h3>
              </div>
              <p className="text-indigo-100 leading-relaxed">
                Rotate API keys periodically to maintain security and reduce exposure risk
              </p>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6" />
                <h3 className="font-bold text-xl">Access Control</h3>
              </div>
              <p className="text-indigo-100 leading-relaxed">
                Only WordPress administrators can view and modify configuration settings
              </p>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6" />
                <h3 className="font-bold text-xl">HTTPS Required</h3>
              </div>
              <p className="text-indigo-100 leading-relaxed">
                All webhook URLs and API endpoints must use HTTPS for secure communication
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="font-bold text-xl mb-4">⚠️ Security Best Practices:</h3>
            <ul className="space-y-3 text-indigo-100">
              <li className="flex items-start gap-3">
                <span className="text-white font-bold text-xl">•</span>
                <span>Never share your Master API Key publicly or commit it to version control systems</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold text-xl">•</span>
                <span>Use environment-specific keys for development, staging, and production environments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold text-xl">•</span>
                <span>Monitor API usage regularly through the API Status dashboard for unusual activity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white font-bold text-xl">•</span>
                <span>Revoke and regenerate keys immediately if you suspect they've been compromised</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Setup Guide */}
        <div className="mt-12 premium-card rounded-3xl p-10 shadow-2xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl font-black text-gray-900 mb-8 font-serif">🚀 Quick Setup Guide</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-xl mb-3">Set Master API Key</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Generate a secure random string (minimum 32 characters) and save it as your Master API Key. 
                  This is required for all API requests.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <code className="text-sm text-purple-900 font-mono">
                    Example: ba73f8e4c2d1a9f6e5b8c7d4a3f2e1b0c9a8b7c6d5e4f3a2b1c0
                  </code>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-xl mb-3">Configure Payment Gateway</h3>
                <p className="text-gray-700 leading-relaxed">
                  Add at least one payment gateway (Paystack, Stripe, PayPal, etc.) to enable payment processing 
                  functionality in your application.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 gradient-green rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-xl mb-3">Set Up Cloud Storage (Optional)</h3>
                <p className="text-gray-700 leading-relaxed">
                  Configure Google Drive, GitHub, or Cloudflare R2 for automated data synchronization and 
                  backup across your ecosystem.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-lg">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-xl mb-3">Test Your Configuration</h3>
                <p className="text-gray-700 leading-relaxed">
                  Visit Banimal → API Status to verify your configuration and run endpoint tests to ensure 
                  everything is working correctly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
