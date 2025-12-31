import { useState } from 'react';
import Layout from '@/react-app/components/Layout';
import { usePulse } from '@/react-app/contexts/PulseContext';
import PulseCard from '@/react-app/components/PulseCard';
import PulseIndicator from '@/react-app/components/PulseIndicator';
import { Copy, Check, AlertCircle } from 'lucide-react';

export default function ApiDocumentation() {
  const { pulseColor, breathIntensity, grainCount } = usePulse();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopy = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/wp-json/banimal/v1/automated-supply',
      title: 'Automated Supply Chain',
      description: 'Initializes the automated supply chain ecosystem, creates data folders, and syncs with configured storage services.',
      features: [
        'Creates ecosystem data folder in WordPress uploads',
        'Initializes ecosystem_data.json file',
        'Syncs with Google Drive (if configured)',
        'Pushes to GitHub repository: fruitful-global-planet',
        'Sends to backend API endpoint',
        'Triggers configured webhooks'
      ],
      exampleRequest: `curl -X POST https://banimal.co.za/wp-json/banimal/v1/automated-supply \\
  -H "X-Banimal-Api-Key: your_master_key"`,
      exampleResponse: `{
  "message": "Automated supply chain initiated successfully",
  "timestamp": "2025-10-27 11:30:00"
}`
    },
    {
      method: 'POST',
      path: '/wp-json/banimal/v1/process-payment',
      title: 'Process Payment',
      description: 'Initialize payment transactions through configured payment gateways.',
      parameters: [
        { name: 'gateway', type: 'string', description: 'Payment gateway (default: paystack)', default: 'paystack' },
        { name: 'amount', type: 'integer', description: 'Amount in cents (default: 1000)', default: '1000' },
        { name: 'email', type: 'string', description: 'Customer email', required: true },
        { name: 'reference', type: 'string', description: 'Transaction reference', required: true }
      ],
      exampleRequest: `curl -X POST https://banimal.co.za/wp-json/banimal/v1/process-payment \\
  -H "X-Banimal-Api-Key: your_master_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "gateway": "paystack",
    "amount": 5000,
    "email": "customer@example.com",
    "reference": "order_12345"
  }'`,
      exampleResponse: `{
  "status": "success",
  "transaction_id": "TXN_12345",
  "gateway": "paystack",
  "amount": 5000
}`
    },
    {
      method: 'POST',
      path: '/wp-json/banimal/v1/woocommerce/webhook',
      title: 'WooCommerce Webhook Handler',
      description: 'Receives WooCommerce order completion notifications and logs transactions.',
      setupRequired: true,
      setupSteps: [
        'Configure this webhook in WooCommerce → Settings → Advanced → Webhooks',
        'Topic: Order Updated',
        'Delivery URL: https://banimal.co.za/wp-json/banimal/v1/woocommerce/webhook',
        'Set webhook secret in Banimal Configuration'
      ],
      exampleRequest: 'Automatically sent by WooCommerce on order updates',
      exampleResponse: `{
  "status": "received",
  "order_id": 12345,
  "logged": true
}`
    }
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            style={{
              transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
              transition: 'transform 0.3s ease'
            }}
          >
            📡 API Documentation
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Complete reference for all Banimal Ecosystem API endpoints
          </p>
          <PulseIndicator size="md" showLabel={true} showGrains={true} />
        </div>

        {/* Authentication Section */}
        <PulseCard 
          variant="glow" 
          intensity="high"
          className="border-2 rounded-2xl p-8 mb-8 animate-slide-up"
          style={{
            borderColor: pulseColor,
            backgroundColor: `${pulseColor}11`
          }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle 
              className="w-8 h-8 flex-shrink-0 mt-1"
              style={{
                color: pulseColor,
                transform: `scale(${0.95 + (breathIntensity * 0.1)})`,
                transition: 'transform 0.3s ease'
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">🔐 Authentication Required</h2>
              <p className="text-gray-700 mb-4">
                All endpoints require your Banimal Master API Key in the request header:
              </p>
              <PulseCard variant="default" intensity="low" className="rounded-lg p-4 font-mono text-sm border">
                <div className="flex items-center justify-between gap-4">
                  <code className="text-gray-800">
                    <span style={{ color: pulseColor }}>X-Banimal-Api-Key:</span> your_master_api_key_here
                  </code>
                  <button
                    onClick={() => handleCopy('X-Banimal-Api-Key: your_master_api_key_here', 'auth-header')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Copy header"
                  >
                    {copiedEndpoint === 'auth-header' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </PulseCard>
              <p className="text-sm text-gray-600 mt-3">
                <strong>How to get your key:</strong> Configure it in Banimal → Configuration in your WordPress admin panel.
              </p>
            </div>
          </div>
        </PulseCard>

        {/* Endpoints */}
        <div className="space-y-8">
          {endpoints.map((endpoint, index) => (
            <PulseCard
              key={index}
              variant="premium"
              intensity="medium"
              className="rounded-2xl shadow-xl border overflow-hidden animate-slide-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderColor: `${pulseColor}33`
              }}
            >
              {/* Endpoint Header */}
              <div 
                className="p-6 text-white"
                style={{
                  background: `linear-gradient(to right, ${pulseColor}, ${pulseColor}dd)`,
                  opacity: 0.9 + (breathIntensity * 0.1)
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-mono font-semibold text-sm">
                        {endpoint.method}
                      </span>
                      <span className="text-2xl">📋</span>
                    </div>
                    <h3 
                      className="text-2xl font-bold"
                      style={{
                        transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {endpoint.title}
                    </h3>
                  </div>
                </div>
                <code className="text-white/90 text-sm bg-white/10 px-3 py-1.5 rounded-lg inline-block">
                  {endpoint.path}
                </code>
              </div>

              {/* Endpoint Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-6">{endpoint.description}</p>

                {/* Setup Required Notice */}
                {endpoint.setupRequired && (
                  <PulseCard variant="glow" intensity="low" className="border rounded-lg p-4 mb-6" style={{ borderColor: `${pulseColor}44` }}>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" style={{ color: pulseColor }} />
                      ℹ️ Setup Required
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {endpoint.setupSteps?.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-semibold" style={{ color: pulseColor }}>{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </PulseCard>
                )}

                {/* Features */}
                {endpoint.features && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What it does:</h4>
                    <ul className="space-y-2">
                      {endpoint.features.map((feature, i) => (
                        <li key={i} className="flex gap-2 text-gray-700">
                          <Check 
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ 
                              color: pulseColor,
                              opacity: 0.8 + (breathIntensity * 0.2)
                            }}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Parameters */}
                {endpoint.parameters && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Parameters:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-3 font-semibold">Name</th>
                            <th className="text-left p-3 font-semibold">Type</th>
                            <th className="text-left p-3 font-semibold">Description</th>
                            <th className="text-left p-3 font-semibold">Default</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, i) => (
                            <tr key={i} className="border-t border-gray-200">
                              <td className="p-3">
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                  {param.name}
                                  {param.required && <span style={{ color: pulseColor }}>*</span>}
                                </code>
                              </td>
                              <td className="p-3 text-gray-600">{param.type}</td>
                              <td className="p-3 text-gray-600">{param.description}</td>
                              <td className="p-3 text-gray-600 font-mono text-xs">
                                {param.default || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Example Request */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Example Request:</h4>
                    <button
                      onClick={() => handleCopy(endpoint.exampleRequest, `request-${index}`)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {copiedEndpoint === `request-${index}` ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{endpoint.exampleRequest}</code>
                  </pre>
                </div>

                {/* Example Response */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Example Response:</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{endpoint.exampleResponse}</code>
                  </pre>
                </div>
              </div>
            </PulseCard>
          ))}
        </div>

        {/* Response Examples */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <PulseCard variant="glow" intensity="medium" className="border rounded-xl p-6" style={{ borderColor: '#22c55e' }}>
            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5" />
              Success Response
            </h3>
            <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto border border-green-200">
              <code className="text-gray-800">{`{
  "message": "Automated supply chain initiated successfully",
  "timestamp": "2025-10-27 11:30:00"
}`}</code>
            </pre>
          </PulseCard>
          <PulseCard variant="glow" intensity="medium" className="border rounded-xl p-6" style={{ borderColor: '#ef4444' }}>
            <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Error Response
            </h3>
            <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto border border-red-200">
              <code className="text-gray-800">{`{
  "message": "Error: Unauthorized access",
  "code": "invalid_api_key"
}`}</code>
            </pre>
          </PulseCard>
        </div>

        {/* External Webhooks */}
        <PulseCard variant="premium" intensity="medium" className="mt-12 rounded-2xl shadow-xl border p-8">
          <h2 
            className="text-2xl font-bold text-gray-900 mb-4"
            style={{
              transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
              transition: 'transform 0.3s ease'
            }}
          >
            🔗 External Webhooks
          </h2>
          <p className="text-gray-700 mb-6">
            Configure external webhook URLs in Banimal → Configuration to receive ecosystem updates.
          </p>
          
          <PulseCard variant="glow" intensity="low" className="border rounded-lg p-6 mb-6" style={{ borderColor: `${pulseColor}44` }}>
            <h4 className="font-semibold text-gray-900 mb-3">ℹ️ Webhook Format</h4>
            <p className="text-gray-700 mb-3 text-sm">Enter comma-separated URLs:</p>
            <code className="block bg-white p-3 rounded border text-sm" style={{ borderColor: `${pulseColor}44` }}>
              https://hook1.example.com,https://hook2.example.com
            </code>
          </PulseCard>

          <p className="text-gray-700">
            Your endpoints will receive POST requests with ecosystem data in JSON format. Grains processed: {grainCount}
          </p>
        </PulseCard>

        {/* Security Features */}
        <PulseCard 
          variant="premium" 
          intensity="high"
          className="mt-12 rounded-2xl p-8 text-white"
          style={{
            background: `linear-gradient(to br, ${pulseColor}, ${pulseColor}dd)`,
            opacity: 0.95 + (breathIntensity * 0.05)
          }}
        >
          <h2 className="text-2xl font-bold mb-6">🔒 Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Encrypted Storage', desc: 'All API keys encrypted using WordPress AUTH_KEY' },
              { title: 'Request Authentication', desc: 'Master API key required for all operations' },
              { title: 'Webhook Verification', desc: 'HMAC signature validation for WooCommerce webhooks' },
              { title: 'Input Sanitization', desc: 'All user inputs validated and sanitized' },
              { title: 'SQL Injection Protection', desc: 'WordPress prepared statements' },
              { title: 'XSS Protection', desc: 'All outputs properly escaped' }
            ].map((item, i) => (
              <PulseCard 
                key={i}
                variant="glow" 
                intensity="low"
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                style={{
                  opacity: 0.9 + (breathIntensity * 0.1),
                  transform: `scale(${0.98 + (breathIntensity * 0.02)})`,
                  transition: 'all 0.3s ease'
                }}
              >
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-white/80">{item.desc}</p>
              </PulseCard>
            ))}
          </div>
          
          <PulseCard variant="default" intensity="low" className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="font-bold text-xl mb-4">⚠️ Security Best Practices:</h3>
            <ul className="space-y-3 text-white/90">
              {[
                'Never share your Master API Key publicly or commit it to version control systems',
                'Use environment-specific keys for development, staging, and production environments',
                'Monitor API usage regularly through the API Status dashboard for unusual activity',
                'Revoke and regenerate keys immediately if you suspect they\'ve been compromised'
              ].map((practice, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-white font-bold text-xl">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </PulseCard>
        </PulseCard>
      </div>
    </Layout>
  );
}
