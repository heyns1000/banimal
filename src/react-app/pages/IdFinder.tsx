import { useState } from 'react';
import Layout from '@/react-app/components/Layout';
import { Check, Copy } from 'lucide-react';

type IDType = 'user' | 'product';

export default function IdFinder() {
  const [selectedType, setSelectedType] = useState<IDType>('user');
  const [copied, setCopied] = useState(false);

  const exampleID = selectedType === 'user' ? 'user_id=123' : 'post=456';

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🔍 ID Finder
          </h1>
          <p className="text-lg text-gray-600">
            Find WordPress User and Product IDs for API integration
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-indigo-200/50">
          <p className="text-center text-gray-700 text-base sm:text-lg leading-relaxed">
            To connect your data using the Banimal API, you need the right WordPress IDs. 
            This interactive guide will show you exactly where to find them.
          </p>
        </div>

        {/* Step 1: ID Type Selection */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-indigo-200/50 animate-slide-up">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6">
            Step 1: What ID do you need to find?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType('user')}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                selectedType === 'user'
                  ? 'bg-slate-700 border-slate-700 text-white shadow-2xl scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-slate-500 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl transform group-hover:scale-110 transition-transform">👤</span>
                <span className="text-lg sm:text-xl font-semibold">User ID</span>
              </div>
              {selectedType === 'user' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
            <button
              onClick={() => setSelectedType('product')}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                selectedType === 'product'
                  ? 'bg-teal-400 border-teal-400 text-gray-900 shadow-2xl scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-teal-400 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl transform group-hover:scale-110 transition-transform">📦</span>
                <span className="text-lg sm:text-xl font-semibold">Product ID</span>
              </div>
              {selectedType === 'product' && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Step 2: Visual Guide */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-indigo-200/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-8">
            Step 2: Follow the Visual Guide
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Instructions */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Finding a {selectedType === 'user' ? 'User' : 'Product'} ID
              </h3>
              <ol className="space-y-4 text-gray-700 text-sm sm:text-base">
                <li className="flex gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="font-bold text-indigo-600 text-lg flex-shrink-0">1.</span>
                  <span>
                    {selectedType === 'user' 
                      ? "In the WordPress sidebar, click on Users → All Users"
                      : "In the WordPress sidebar, click on WooCommerce → Products (or just Products)"}
                  </span>
                </li>
                <li className="flex gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="font-bold text-indigo-600 text-lg flex-shrink-0">2.</span>
                  <span>
                    Find the {selectedType === 'user' ? 'user' : 'product'} you need and hover over {selectedType === 'user' ? 'their name' : 'its name'}
                  </span>
                </li>
                <li className="flex gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="font-bold text-indigo-600 text-lg flex-shrink-0">3.</span>
                  <span>
                    Look at the bottom left of your browser (or the address bar when you click Edit). You'll see the URL.
                  </span>
                </li>
              </ol>
            </div>

            {/* Visual Example */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border border-gray-300 shadow-inner">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-4 text-center uppercase tracking-wide">
                WordPress Admin Menu
              </p>
              <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl border border-slate-700">
                <div className="bg-slate-700 px-4 py-2 text-white font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  WordPress
                </div>
                <div className="p-4 space-y-2">
                  <div className="bg-slate-600 rounded px-4 py-2 text-gray-300 hover:bg-slate-550 transition-colors cursor-pointer">
                    Dashboard
                  </div>
                  <div className={`rounded px-4 py-2 flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                    selectedType === 'user' 
                      ? 'bg-slate-500 text-white shadow-lg scale-105' 
                      : 'bg-slate-600 text-gray-300 hover:bg-slate-550'
                  }`}>
                    <span className="text-lg">👤</span>
                    <span>Users</span>
                  </div>
                  <div className="bg-slate-600 rounded px-4 py-2 text-gray-400 text-sm flex items-center gap-2 hover:bg-slate-550 transition-colors cursor-pointer">
                    <span>🛒</span>
                    <span>WooCommerce</span>
                  </div>
                  <div className={`rounded px-4 py-2 flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                    selectedType === 'product' 
                      ? 'bg-slate-500 text-white shadow-lg scale-105' 
                      : 'bg-slate-600 text-gray-300 hover:bg-slate-550'
                  }`}>
                    <span className="text-lg">📦</span>
                    <span>Products</span>
                  </div>
                  <div className="bg-slate-600 rounded px-4 py-2 text-gray-300 hover:bg-slate-550 transition-colors cursor-pointer">
                    Settings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Find ID in URL */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-indigo-200/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6">
            Step 3: Find the ID in the URL
          </h2>
          <p className="text-center text-gray-700 mb-6 text-sm sm:text-base">
            Hover over or edit the item, then look at your browser's address bar. The ID is the number.
          </p>
          
          {/* URL Example */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 mb-6 border border-gray-300 shadow-inner">
            <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-3 text-center uppercase tracking-wide">
              Example URL
            </p>
            <div className="flex items-center justify-center gap-1 font-mono text-xs sm:text-sm flex-wrap bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <span className="text-gray-600">yoursite.com/wp-admin/</span>
              <span className="text-gray-600">{selectedType === 'user' ? 'user-edit.php?' : 'post.php?'}</span>
              <div className="relative group">
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1 rounded font-bold shadow-md">
                  {exampleID}
                </span>
                <button
                  onClick={handleCopy}
                  className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white p-1.5 rounded-lg hover:bg-gray-700"
                  aria-label="Copy ID"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {selectedType === 'product' && (
                <span className="text-gray-600">&action=edit</span>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-sm">
            <p className="text-center text-gray-800 font-semibold text-lg flex items-center justify-center gap-2">
              <span className="text-2xl">✓</span>
              <span>This number is the ID you need to connect your data using the Banimal API.</span>
            </p>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span>
            Pro Tip
          </h3>
          <p className="text-indigo-100">
            This ID number is what you'll use in your API calls to connect user or product data to the Banimal ecosystem. 
            Keep these IDs handy when configuring API endpoints and webhooks.
          </p>
        </div>
      </div>
    </Layout>
  );
}
