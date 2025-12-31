import Layout from '@/react-app/components/Layout';
import { Globe, CheckCircle, Clock, Mail, Users, Target } from 'lucide-react';

export default function Languages() {
  const availableLanguages = [
    { name: 'English', native: 'English', flag: '🇺🇸', code: 'en_US', status: 'available', completion: 100, speakers: '1.5B' },
    { name: 'Chinese Simplified', native: '简体中文', flag: '🇨🇳', code: 'zh_CN', status: 'available', completion: 100, speakers: '1.1B' }
  ];

  const comingSoonLanguages = [
    { name: 'Spanish', native: 'Español', flag: '🇪🇸', code: 'es_ES', completion: 0, speakers: '548M' },
    { name: 'French', native: 'Français', flag: '🇫🇷', code: 'fr_FR', completion: 0, speakers: '280M' },
    { name: 'German', native: 'Deutsch', flag: '🇩🇪', code: 'de_DE', completion: 0, speakers: '134M' },
    { name: 'Portuguese', native: 'Português', flag: '🇧🇷', code: 'pt_BR', completion: 0, speakers: '264M' },
    { name: 'Russian', native: 'Русский', flag: '🇷🇺', code: 'ru_RU', completion: 0, speakers: '258M' },
    { name: 'Japanese', native: '日本語', flag: '🇯🇵', code: 'ja', completion: 0, speakers: '125M' },
    { name: 'Korean', native: '한국어', flag: '🇰🇷', code: 'ko_KR', completion: 0, speakers: '82M' },
    { name: 'Arabic', native: 'العربية', flag: '🇸🇦', code: 'ar', completion: 0, speakers: '422M' },
    { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', code: 'hi_IN', completion: 0, speakers: '602M' },
    { name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', code: 'sw', completion: 0, speakers: '200M' },
    { name: 'Zulu', native: 'isiZulu', flag: '🇿🇦', code: 'zu_ZA', completion: 0, speakers: '27M' },
    { name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦', code: 'af', completion: 0, speakers: '18M' }
  ];

  const totalSpeakers = availableLanguages.reduce((sum, lang) => sum + parseFloat(lang.speakers), 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              🌍 Global Language Network
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Breaking barriers. Connecting cultures. Empowering {(totalSpeakers + 2.6).toFixed(1)}+ billion people worldwide.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <div className="premium-card p-8 text-center rounded-2xl border-2 border-green-200">
            <div className="text-6xl font-black mb-3">
              <span className="gold-gradient-text">{totalSpeakers.toFixed(1)}B</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Current Reach</div>
            <div className="mt-2 text-xs text-gray-500">Available Languages</div>
          </div>
          <div className="premium-card p-8 text-center rounded-2xl border-2 border-purple-200">
            <div className="text-6xl font-black mb-3">
              <span className="bg-gradient-to-br from-purple-500 to-pink-600 bg-clip-text text-transparent">5.2B</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Target Reach</div>
            <div className="mt-2 text-xs text-gray-500">When Complete</div>
          </div>
          <div className="premium-card p-8 text-center rounded-2xl border-2 border-blue-200">
            <div className="text-6xl font-black mb-3">
              <span className="bg-gradient-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent">14</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Total Languages</div>
            <div className="mt-2 text-xs text-gray-500">2 Active + 12 Coming</div>
          </div>
        </div>

        {/* New Feature Banner */}
        <div className="premium-card bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 rounded-3xl p-10 mb-12 animate-slide-up shadow-2xl" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full p-5 shadow-xl">
                <Globe className="w-12 h-12" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 font-serif">🎉 Global Language Framework</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                The Banimal Ecosystem now intelligently adapts to your WordPress language settings, 
                providing native experiences across cultures and markets.
              </p>
              <div className="glass p-4 rounded-xl border border-green-300 inline-block">
                <p className="text-sm text-gray-900">
                  <strong className="text-green-700">Currently Live:</strong> English & Chinese Simplified • 
                  <strong className="text-purple-700 ml-2">Coming Soon:</strong> 12+ Major Languages
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Languages */}
        <div className="premium-card rounded-3xl overflow-hidden shadow-2xl mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black font-serif">✅ Active Language Support</h2>
            </div>
          </div>
          <div className="p-8 bg-gradient-to-br from-white to-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableLanguages.map((lang, index) => (
                <div key={index} className="group premium-card bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-300 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-5 mb-5">
                    <span className="text-6xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <div className="flex-1">
                      <h3 className="font-black text-gray-900 text-2xl mb-1">{lang.name}</h3>
                      <p className="text-gray-600 text-lg font-medium">{lang.native}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-green-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-lg" style={{ width: `${lang.completion}%` }}></div>
                      </div>
                      <span className="text-sm font-black text-green-700">{lang.completion}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{lang.speakers} speakers</span>
                      </div>
                      <code className="bg-white px-3 py-1 rounded-lg text-xs font-mono font-semibold">{lang.code}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Languages */}
        <div className="premium-card rounded-3xl overflow-hidden shadow-2xl mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Clock className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-black font-serif">🔜 Expanding Soon</h2>
                <p className="text-purple-100 mt-1">12 additional languages in active development</p>
              </div>
            </div>
          </div>
          <div className="p-8 bg-gradient-to-br from-white to-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonLanguages.map((lang, index) => (
                <div key={index} className="group premium-card rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-400 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{lang.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{lang.native}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Target className="w-4 h-4" />
                      <span className="font-semibold">{lang.speakers} potential reach</span>
                    </div>
                    <code className="block bg-gray-100 px-3 py-1 rounded text-xs font-mono">{lang.code}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Change Language */}
        <div className="premium-card bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white mb-12 shadow-2xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-black mb-8 font-serif flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              🎯
            </div>
            How to Switch Languages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-14 h-14 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                1
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Access WordPress</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Log into your WordPress dashboard at your admin URL
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-14 h-14 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                2
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Navigate to Settings</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Go to Settings → General in the left sidebar
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-14 h-14 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                3
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Select Language</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Choose your preferred Site Language from the dropdown menu
                </p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex-shrink-0 w-14 h-14 glass rounded-2xl flex items-center justify-center font-black text-2xl text-gray-900">
                4
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Save & Enjoy</h3>
                <p className="text-indigo-100 leading-relaxed">
                  Click Save Changes and Banimal adapts automatically!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contribute Translations */}
        <div className="premium-card rounded-3xl p-10 shadow-2xl animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-4 gradient-gold rounded-2xl">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-900 mb-4 font-serif">🤝 Join Our Translation Network</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Help us make Banimal accessible to billions worldwide! We're actively seeking fluent translators 
                for all languages listed above.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="glass p-6 rounded-2xl border-2 border-indigo-200">
                  <h3 className="font-bold text-indigo-900 mb-3 text-lg">📧 Contact Information</h3>
                  <a href="mailto:translations@banimal.co.za" className="text-indigo-600 hover:text-indigo-800 font-bold text-lg underline">
                    translations@banimal.co.za
                  </a>
                </div>

                <div className="glass p-6 rounded-2xl border-2 border-green-200">
                  <h3 className="font-bold text-green-900 mb-3 text-lg">🎁 Contributor Benefits</h3>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>Credit with profile link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>Early feature access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>Community recognition</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-6">
                <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Translation Impact
                </h3>
                <p className="text-yellow-800 leading-relaxed">
                  Your contribution directly enables global commerce access for millions of people in your language community. 
                  Join us in breaking down linguistic barriers to economic opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
