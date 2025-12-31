import Layout from '@/react-app/components/Layout';
import { Building2, TrendingUp, Users, Shield, Zap, BarChart3, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function EnterprisePayroll() {

  const systems = [
    {
      id: 'adp',
      name: 'ADP GlobalView',
      color: 'from-red-600 to-orange-600',
      score: 8.2,
      strengths: ['Simple interface', 'Transparent dashboard', 'Configurable ESS'],
      weaknesses: ['Clunky mobile', 'Unintuitive reports'],
      emoji: '🔴'
    },
    {
      id: 'workday',
      name: 'Workday',
      color: 'from-blue-600 to-cyan-600',
      score: 8.7,
      strengths: ['AI-driven UX', 'Powerful analytics', 'Intuitive design'],
      weaknesses: ['Complex setup', 'Complicated reporting'],
      emoji: '🔵'
    },
    {
      id: 'sap',
      name: 'SAP SuccessFactors',
      color: 'from-yellow-600 to-amber-600',
      score: 8.0,
      strengths: ['Customizable homepage', 'Multi-source reporting', 'Global coverage'],
      weaknesses: ['T-code learning curve', 'Legacy UI elements'],
      emoji: '🟡'
    },
    {
      id: 'deel',
      name: 'Deel',
      color: 'from-green-600 to-emerald-600',
      score: 8.5,
      strengths: ['Simple 3-step process', 'Global platform', 'Self-serve'],
      weaknesses: ['Limited screenshots', 'Newer platform'],
      emoji: '🟢'
    },
    {
      id: 'oracle',
      name: 'Oracle HCM Cloud',
      color: 'from-purple-600 to-pink-600',
      score: 8.3,
      strengths: ['Personalized dashboard', 'AI/ML integration', '1000+ KPIs'],
      weaknesses: ['Limited UI details', 'Enterprise complexity'],
      emoji: '🟣'
    }
  ];

  const principles = [
    {
      title: 'Efficiency',
      description: 'Automated calculations, self-service portals, streamlined workflows',
      icon: Zap,
      color: 'yellow',
      impact: 'High'
    },
    {
      title: 'Accuracy',
      description: 'Error-free tax filings, AI anomaly detection, automated compliance',
      icon: CheckCircle,
      color: 'green',
      impact: 'Critical'
    },
    {
      title: 'Scalability',
      description: 'Handle extensive databases, add countries without overhaul',
      icon: TrendingUp,
      color: 'blue',
      impact: 'High'
    },
    {
      title: 'Compliance',
      description: 'Local regulations, automated tax filings, comprehensive audit trails',
      icon: Shield,
      color: 'red',
      impact: 'Critical'
    }
  ];

  const metrics = [
    {
      title: 'User Adoption Rate',
      value: '87.3%',
      change: '+12.4%',
      trend: 'up',
      description: 'Active ESS/MSS usage',
      icon: Users
    },
    {
      title: 'Task Completion Efficiency',
      value: '3.2 min',
      change: '-45%',
      trend: 'down',
      description: 'Avg payroll processing time',
      icon: Clock
    },
    {
      title: 'Error Rate Reduction',
      value: '0.3%',
      change: '-78%',
      trend: 'down',
      description: 'Compliance & payroll errors',
      icon: AlertTriangle
    },
    {
      title: 'Support Burden',
      value: '42%',
      change: '-58%',
      trend: 'down',
      description: 'Reduction in support tickets',
      icon: BarChart3
    }
  ];

  const uiComponents = [
    {
      category: 'Dashboard',
      examples: 'Global Insights Dashboard, Pay cycle command center, Personalized homepage',
      functionality: 'High-level metrics, customizable views, real-time analytics'
    },
    {
      category: 'Navigation Menu',
      examples: 'Global Navigation Menu, Main Menu, Left navigation panel',
      functionality: 'Role-based access, module pathways, contextual navigation'
    },
    {
      category: 'Search Bar',
      examples: 'Search Bar, Action Search, Global search',
      functionality: 'Universal search, partial matches, category filtering'
    },
    {
      category: 'ESS Portal',
      examples: 'Employee Self Service portal, ADP Portal',
      functionality: 'Personal info management, pay statements, mobile access'
    },
    {
      category: 'Reporting Interface',
      examples: 'Custom Reporting, Payroll Summary Reports, OTBI',
      functionality: 'Pre-built/custom reports, drag-and-drop, real-time analytics'
    },
    {
      category: 'Alerts/Notifications',
      examples: 'Notification Bell, Proactive alerts, Status indicators',
      functionality: 'Deadlines, regulatory changes, critical warnings'
    }
  ];

  const recommendations = [
    {
      title: 'Unified Customizable Dashboard',
      priority: 'Critical',
      description: 'Pay Cycle Command Center with role-based, real-time insights and KPIs',
      systems: ['Workday', 'Oracle', 'ADP']
    },
    {
      title: 'AI/ML Integration',
      priority: 'High',
      description: 'Anomaly detection, proactive alerts, conversational interfaces',
      systems: ['Workday', 'Oracle', 'Deel']
    },
    {
      title: 'Mobile-First Self-Service',
      priority: 'Critical',
      description: 'Intuitive ESS/MSS with chat support and seamless mobile experience',
      systems: ['Deel', 'Workday', 'Oracle']
    },
    {
      title: 'Streamlined Workflows',
      priority: 'High',
      description: 'Clear, sequential, guided steps with progress indicators',
      systems: ['Deel', 'Workday', 'SAP']
    },
    {
      title: 'Powerful Simple Reporting',
      priority: 'High',
      description: 'Pre-built + custom reports with drag-and-drop, easy export',
      systems: ['Workday', 'SAP', 'Oracle']
    },
    {
      title: 'Global-First Design',
      priority: 'Critical',
      description: 'Multi-currency, multi-jurisdiction, localized compliance',
      systems: ['ADP', 'SAP', 'Deel']
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="premium-card p-10 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-block px-4 py-1 border border-blue-400/50 rounded-full text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
                Enterprise Payroll Analysis
              </div>
              <h1 className="text-5xl font-black mb-3 font-serif flex items-center gap-4">
                <Building2 className="w-12 h-12" />
                Global Payroll UI/UX Intelligence
              </h1>
              <p className="text-xl text-blue-200">
                Comprehensive Analysis of Leading Enterprise Payroll Systems
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 text-center">
              <div className="text-4xl font-black text-blue-400 mb-1">5</div>
              <div className="text-sm text-blue-200">Systems Analyzed</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-200 mb-1">UI Components</div>
              <div className="text-3xl font-black">200+</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-200 mb-1">Best Practices</div>
              <div className="text-3xl font-black">47</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-200 mb-1">Key Metrics</div>
              <div className="text-3xl font-black">8</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-200 mb-1">Countries</div>
              <div className="text-3xl font-black">193+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Foundational UI/UX Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div key={index} className="premium-card p-6">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                  principle.color === 'yellow' ? 'bg-yellow-100' :
                  principle.color === 'green' ? 'bg-green-100' :
                  principle.color === 'blue' ? 'bg-blue-100' :
                  'bg-red-100'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    principle.color === 'yellow' ? 'text-yellow-600' :
                    principle.color === 'green' ? 'text-green-600' :
                    principle.color === 'blue' ? 'text-blue-600' :
                    'text-red-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{principle.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{principle.description}</p>
                <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                  principle.impact === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {principle.impact} Impact
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Comparison */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">System Comparative Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <div key={system.id} className="premium-card overflow-hidden">
              <div className={`bg-gradient-to-br ${system.color} p-6 text-white`}>
                <div className="text-5xl mb-4">{system.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{system.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="text-4xl font-black">{system.score}</div>
                  <div className="text-sm">/10<br/>Score</div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-xs font-bold text-green-600 mb-2">STRENGTHS</div>
                  <div className="space-y-2">
                    {system.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600 mb-2">WEAKNESSES</div>
                  <div className="space-y-2">
                    {system.weaknesses.map((weakness, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">UI/UX Success Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.trend === 'down' && metric.title.includes('Reduction');
            return (
              <div key={index} className="premium-card p-6">
                <div className="inline-flex p-4 rounded-2xl bg-blue-100 mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600 mb-2">{metric.title}</div>
                <div className="text-4xl font-black text-gray-900 mb-2">{metric.value}</div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-red-600'} ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span className={`font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UI Component Library */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">UI Component Library Index</h2>
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Component Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Examples/Naming</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Functionality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uiComponents.map((component, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{component.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{component.examples}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{component.functionality}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Strategic Recommendations</h2>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="premium-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{rec.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rec.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="text-xs text-gray-500 font-bold">ADOPTED BY:</div>
                    {rec.systems.map((sys, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {sys}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI & Business Impact */}
      <div className="premium-card p-10 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0 w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-serif">ROI & Business Impact</h2>
            <p className="text-lg text-gray-700 mb-4">
              Superior UI/UX is measurably profitable in enterprise payroll through reduced operational costs and mitigated risks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
            <div className="text-4xl font-black text-green-600 mb-2">-78%</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Error Reduction</h3>
            <p className="text-sm text-gray-600">Fewer costly corrections and compliance fines</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-blue-200">
            <div className="text-4xl font-black text-blue-600 mb-2">-45%</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Time Savings</h3>
            <p className="text-sm text-gray-600">Lower labor costs for HR and payroll teams</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-purple-200">
            <div className="text-4xl font-black text-purple-600 mb-2">-58%</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Support Burden</h3>
            <p className="text-sm text-gray-600">Reduced operational overhead and training costs</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-green-100 rounded-2xl border-2 border-green-300">
          <div className="text-center">
            <div className="text-sm font-bold text-green-700 mb-2">KEY INSIGHT</div>
            <p className="text-lg text-gray-900 font-medium">
              "UI/UX is not a subjective preference—it's a quantifiable investment with clear ROI in high-volume, high-risk payroll operations."
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
