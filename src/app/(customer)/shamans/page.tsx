'use client';

import { useState, useEffect } from 'react';
import { ShamanCard } from '@/components/shamans/ShamanCard';
import { getShamans } from '@/services/shaman.service';
import { ShamanProfile, Specialty } from '@/types/shaman.types';
import { Search, X, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      {/* Hero Section */}
      <div className="hero min-h-[40vh] bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-4 flex items-center justify-center gap-4">
              <Sparkles className="w-16 h-16" />
              무속인 찾기
            </h1>
            <p className="text-2xl">신뢰할 수 있는 전문 무속인을 만나보세요</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 필터 섹션 */}
        <div className="card bg-base-100/90 backdrop-blur-lg shadow-2xl mb-8">
          <div className="card-body">
            {/* 검색 */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="form-control flex-1">
                <div className="input-group">
                  <span className="bg-primary text-primary-content">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="무속인 이름, 지역으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-bordered input-primary w-full"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-wide">
                검색
              </button>
            </form>

            <div className="divider">필터</div>

            {/* 지역 & 가격 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">📍 지역</span>
                </label>
                <select
                  className="select select-bordered select-primary"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">전체 지역</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">💰 최소 금액</span>
                </label>
                <input
                  type="number"
                  placeholder="예: 30000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input input-bordered input-primary"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">💰 최대 금액</span>
                </label>
                <input
                  type="number"
                  placeholder="예: 100000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input input-bordered input-primary"
                />
              </div>

              {hasFilters && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text opacity-0">.</span>
                  </label>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn btn-outline btn-error"
                  >
                    <X className="w-4 h-4 mr-2" />
                    필터 초기화
                  </button>
                </div>
              )}
            </div>

            {/* 전문분야 */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">✨ 전문분야</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleSpecialty(specialty)}
                    className={`badge badge-lg cursor-pointer transition-all ${
                      selectedSpecialties.includes(specialty)
                        ? 'badge-primary'
                        : 'badge-outline badge-primary hover:badge-primary'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 결과 카운터 */}
        <div className="stats shadow mb-8 bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="stat-title">검색 결과</div>
            <div className="stat-value text-primary">{shamans.length}</div>
            <div className="stat-desc">명의 무속인</div>
          </div>
        </div>

        {/* 무속인 목록 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-xl font-medium">로딩 중...</p>
          </div>
        ) : shamans.length === 0 ? (
          <div className="hero min-h-[40vh]">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <div className="text-8xl mb-4">🔍</div>
                <h2 className="text-3xl font-bold mb-2">검색 결과가 없습니다</h2>
                <p className="text-lg opacity-70">다른 조건으로 검색해보세요</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shamans.map((shaman) => (
              <ShamanCard key={shaman.id} shaman={shaman} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
