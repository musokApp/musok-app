'use client';

import { useState, useEffect } from 'react';
import { ShamanCard } from '@/components/shamans/ShamanCard';
import { getShamans } from '@/services/shaman.service';
import { ShamanProfile, Specialty } from '@/types/shaman.types';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const REGIONS = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시'];
const SPECIALTIES: Specialty[] = ['굿', '점술', '사주', '타로', '궁합', '작명', '풍수', '해몽'];

export default function ShamansPage() {
  const [shamans, setShamans] = useState<ShamanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSpecialties, setSelectedSpecialties] = useState<Specialty[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchShamans();
  }, [selectedRegion, selectedSpecialties, minPrice, maxPrice]);

  const fetchShamans = async () => {
    try {
      setLoading(true);
      const data = await getShamans({
        region: selectedRegion && selectedRegion !== 'all' ? selectedRegion : undefined,
        specialties: selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        searchQuery: searchQuery || undefined,
      });
      setShamans(data);
    } catch (error) {
      console.error('Failed to fetch shamans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchShamans();
  };

  const toggleSpecialty = (specialty: Specialty) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedSpecialties([]);
    setMinPrice('');
    setMaxPrice('');
  };

  const hasFilters = (selectedRegion && selectedRegion !== 'all') || selectedSpecialties.length > 0 || minPrice || maxPrice || searchQuery;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">무속인 찾기</h1>
          <p className="text-sm text-gray-500 mt-1">신뢰할 수 있는 전문 무속인을 만나보세요</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="무속인 이름, 지역으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-6 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            검색
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center gap-1.5 ${
              showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">필터</span>
          </button>
        </form>

        {/* Specialty Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SPECIALTIES.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => toggleSpecialty(specialty)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSpecialties.includes(specialty)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">지역</label>
                <select
                  className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">전체 지역</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">최소 금액</label>
                <input
                  type="number"
                  placeholder="예: 30,000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">최대 금액</label>
                <input
                  type="number"
                  placeholder="예: 100,000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                필터 초기화
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            검색 결과 <strong className="text-gray-900">{shamans.length}</strong>명
          </p>
        </div>

        {/* Shaman List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">로딩 중...</p>
          </div>
        ) : shamans.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">검색 결과가 없습니다</h2>
            <p className="text-sm text-gray-500">다른 조건으로 검색해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shamans.map((shaman) => (
              <ShamanCard key={shaman.id} shaman={shaman} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
