import Layout from '@/react-app/components/Layout';
import { Search, Star, Database, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Brand {
  id: number;
  name: string;
  system: string;
  tier: string;
  category: string;
  description: string;
  emoji: string;
  fee?: string;
  royalty?: string;
  division?: string;
  vault_mesh_id?: string;
  parent_id?: string;
  use_phrase?: string;
  subnodes?: string;
  metadata?: string;
}

interface System {
  system_key: string;
  system_name: string;
  total_brands: number;
  gradient_colors: string;
}

interface Tier {
  tier_key: string;
  tier_name: string;
  gradient_colors: string;
}

export default function BrandExplorer() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 20;

  // Fetch systems and tiers on mount
  useEffect(() => {
    fetchSystems();
    fetchTiers();
  }, []);

  // Fetch brands when filters change
  useEffect(() => {
    setPage(1);
    setBrands([]);
    fetchBrands(1, true);
  }, [selectedSystem, selectedTier, searchQuery]);

  const fetchSystems = async () => {
    try {
      const response = await fetch('/api/systems');
      const data = await response.json();
      setSystems(data.systems || []);
    } catch (err) {
      console.error('Failed to fetch systems:', err);
    }
  };

  const fetchTiers = async () => {
    try {
      const response = await fetch('/api/tiers');
      const data = await response.json();
      setTiers(data.tiers || []);
    } catch (err) {
      console.error('Failed to fetch tiers:', err);
    }
  };

  const fetchBrands = async (pageNum: number, reset: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      });

      if (selectedSystem && selectedSystem !== 'all') {
        params.append('system', selectedSystem);
      }

      if (selectedTier && selectedTier !== 'all') {
        params.append('tier', selectedTier);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/brands?${params}`);
      const data = await response.json();

      if (reset) {
        setBrands(data.brands || []);
      } else {
        setBrands(prev => [...prev, ...(data.brands || [])]);
      }

      setTotalBrands(data.pagination?.total || 0);
      setHasMore(data.pagination?.hasMore || false);
    } catch (err) {
      setError('Failed to load brands. Please try again.');
      console.error('Failed to fetch brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBrands(nextPage, false);
  };

  const getSystemBadge = (systemKey: string) => {
    const system = systems.find(s => s.system_key === systemKey);
    return system?.gradient_colors || 'from-gray-400 to-gray-500';
  };

  const getTierBadge = (tierKey: string) => {
    const tier = tiers.find(t => t.tier_key === tierKey);
    return tier?.gradient_colors || 'from-gray-600 to-gray-700';
  };

  const getSystemName = (systemKey: string) => {
    const system = systems.find(s => s.system_key === systemKey);
    return system?.system_name || systemKey.toUpperCase();
  };

  const parsedSubnodes = (subnodes: string | undefined) => {
    if (!subnodes) return null;
    try {
      return JSON.parse(subnodes);
    } catch {
      return null;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 mb-4 font-serif">🔍 Brand Explorer</h1>
        <p className="text-xl text-gray-600">
          Browse {totalBrands.toLocaleString()} registered brands across three ecosystems
        </p>
      </div>

      {/* Filters */}
      <div className="premium-card p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-gray-900 mb-3">Search Brands</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand name, category, or description..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:outline-none text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* System Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">System</label>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:outline-none text-gray-900 font-medium"
            >
              <option value="all">All Systems ({systems.reduce((sum, s) => sum + s.total_brands, 0).toLocaleString()})</option>
              {systems.map(system => (
                <option key={system.system_key} value={system.system_key}>
                  {system.system_name} ({system.total_brands.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:outline-none text-gray-900 font-medium"
            >
              <option value="all">All Tiers</option>
              {tiers.map(tier => (
                <option key={tier.tier_key} value={tier.tier_key}>
                  {tier.tier_name}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="w-full px-6 py-4 bg-gray-100 rounded-2xl">
              <div className="text-sm text-gray-600 mb-1">Showing</div>
              <div className="text-2xl font-black text-gray-900">{brands.length.toLocaleString()}</div>
              <div className="text-xs text-gray-500">of {totalBrands.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-10 premium-card p-6 border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-bold text-red-900">Error Loading Brands</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Brand Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {brands.map((brand) => {
          const subnodes = parsedSubnodes(brand.subnodes);
          
          return (
            <div key={brand.id} className="premium-card overflow-hidden group cursor-pointer">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{brand.emoji || '📦'}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{brand.name}</h3>
                      <p className="text-sm text-gray-600">{brand.category}</p>
                    </div>
                  </div>
                  <Star className="w-6 h-6 text-gray-300 group-hover:text-yellow-500 transition-colors" />
                </div>

                {brand.description && (
                  <p className="text-gray-700 mb-6 leading-relaxed">{brand.description}</p>
                )}

                {brand.use_phrase && (
                  <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                    <p className="text-sm font-bold text-purple-900 italic">"{brand.use_phrase}"</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {brand.fee && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 mb-1">License Fee</div>
                      <div className="text-lg font-bold text-gray-900">{brand.fee}</div>
                    </div>
                  )}
                  {brand.royalty && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 mb-1">Royalty Rate</div>
                      <div className="text-lg font-bold text-gray-900">{brand.royalty}</div>
                    </div>
                  )}
                  {brand.vault_mesh_id && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 mb-1">VaultMesh ID</div>
                      <div className="text-lg font-bold text-gray-900">{brand.vault_mesh_id}</div>
                    </div>
                  )}
                  {brand.division && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs text-gray-500 mb-1">Division</div>
                      <div className="text-sm font-bold text-gray-900">{brand.division}</div>
                    </div>
                  )}
                </div>

                {subnodes && Array.isArray(subnodes) && subnodes.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-bold text-gray-600 mb-3">SUBNODES ({subnodes.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {subnodes.map((subnode: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                          {subnode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${getSystemBadge(brand.system)} text-white`}>
                    {getSystemName(brand.system)}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${getTierBadge(brand.tier)} text-white`}>
                    {brand.tier.charAt(0).toUpperCase() + brand.tier.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && brands.length === 0 && (
        <div className="text-center py-20">
          <Loader2 className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading brands...</h3>
          <p className="text-gray-600">Fetching data from the ecosystem</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && brands.length === 0 && !error && (
        <div className="text-center py-20">
          <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No brands found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Load More */}
      {!loading && brands.length > 0 && hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-10 py-4 gradient-gold text-gray-900 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </span>
            ) : (
              'Load More Brands'
            )}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Showing {brands.length.toLocaleString()} of {totalBrands.toLocaleString()} total brands
          </p>
        </div>
      )}

      {/* End of Results */}
      {!loading && brands.length > 0 && !hasMore && (
        <div className="text-center mt-12 py-10">
          <div className="inline-block px-6 py-3 bg-gray-100 rounded-2xl">
            <p className="text-sm font-bold text-gray-700">
              You've reached the end • {totalBrands.toLocaleString()} total brands
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}
