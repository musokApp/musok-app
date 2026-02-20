'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { MyPageLayout } from '@/components/layout/MyPageLayout';
import { ShamanProfile, Specialty } from '@/types/shaman.types';
import { CheckCircle, Clock, User, XCircle } from 'lucide-react';
import ImageUploader from '@/components/upload/ImageUploader';

const REGIONS = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시'];
const SPECIALTIES: Specialty[] = ['굿', '점술', '사주', '타로', '궁합', '작명', '풍수', '해몽'];

function CustomerProfileContent() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSuccessMsg('프로필이 수정되었습니다');
      } else {
        const data = await response.json();
        setErrorMsg(data.error || '수정에 실패했습니다');
      }
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = fullName !== user.fullName || phone !== (user.phone || '');

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">내 정보 관리</h1>
      <p className="text-sm text-gray-500 mb-8">회원 정보를 수정하세요</p>

      {/* 프로필 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{user.fullName}</p>
          <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-primary">
            고객
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-base font-bold text-gray-900">회원 정보</h2>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">이름 *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">이메일</label>
          <div className="h-11 px-4 flex items-center rounded-xl bg-gray-100 border border-gray-100 text-sm text-gray-500">
            {user.email}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">전화번호</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">{errorMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || !hasChanges}
          className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </form>

      <div className="h-px bg-gray-100 my-8" />
    </>
  );
}

function ShamanProfileContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [shaman, setShaman] = useState<ShamanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    specialties: [] as Specialty[],
    yearsExperience: '',
    region: '',
    district: '',
    address: '',
    basePrice: '',
    images: [] as string[],
  });

  useEffect(() => {
    fetchShamanProfile();
  }, []);

  const fetchShamanProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shamans/me');
      if (response.ok) {
        const data = await response.json();
        if (data.shaman) {
          setShaman(data.shaman);
          setFormData({
            businessName: data.shaman.businessName,
            description: data.shaman.description,
            specialties: data.shaman.specialties,
            yearsExperience: data.shaman.yearsExperience.toString(),
            region: data.shaman.region,
            district: data.shaman.district,
            address: data.shaman.address,
            basePrice: data.shaman.basePrice.toString(),
            images: data.shaman.images || [],
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (specialty: Specialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const response = await fetch('/api/shamans/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setShaman(data.shaman);
        setSuccessMsg(shaman ? '프로필이 수정되었습니다' : '프로필이 등록되었습니다. 관리자 승인을 기다려주세요');
      } else {
        const data = await response.json();
        alert(data.error || '저장에 실패했습니다');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-56 bg-gray-100 rounded-lg animate-pulse" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-11 bg-gray-50 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">무속인 프로필</h1>
      <p className="text-sm text-gray-500 mb-8">
        {shaman ? '프로필을 수정하세요' : '프로필을 등록하고 고객을 받아보세요'}
      </p>

      {/* Status Card */}
      {shaman && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-3">
            {shaman.status === 'approved' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">승인 완료</p>
                  <p className="text-xs text-gray-500">고객들이 회원님의 프로필을 볼 수 있습니다</p>
                </div>
              </>
            ) : shaman.status === 'pending' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">승인 대기 중</p>
                  <p className="text-xs text-gray-500">관리자 승인을 기다리고 있습니다</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">승인 거절</p>
                  <p className="text-xs text-gray-500">프로필을 수정하여 다시 신청해주세요</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이미지 업로드 */}
        <ImageUploader
          images={formData.images}
          onChange={(urls) => setFormData({ ...formData, images: urls })}
        />

        <div className="h-px bg-gray-100" />

        <h2 className="text-base font-bold text-gray-900">기본 정보</h2>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">상호명 *</label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="예: 명가점술원"
            required
            className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">소개 *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="무속인으로서의 경력과 전문성을 소개해주세요"
            rows={5}
            required
            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">전문분야 * (최소 1개 선택)</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => toggleSpecialty(specialty)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                  formData.specialties.includes(specialty)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">경력 (년) *</label>
            <input
              type="number"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              placeholder="예: 15"
              min="0"
              required
              className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">기본 요금 (원) *</label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              placeholder="예: 50000"
              min="0"
              step="1000"
              required
              className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">지역 *</label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              required
              className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">지역 선택</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">구/군 *</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="예: 강남구"
              required
              className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">상세 주소 *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="예: 서울특별시 강남구 테헤란로 123"
            required
            className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="h-px bg-gray-100" />

        {successMsg && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800">{successMsg}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : shaman ? '프로필 수정' : '프로필 등록'}
          </button>
          {shaman && (
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <MyPageLayout>
        <div className="space-y-4">
          <div className="h-7 w-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-gray-100 rounded-lg animate-pulse" />
          <div className="mt-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="h-11 bg-gray-50 rounded-xl animate-pulse mt-4" />
          <div className="h-11 bg-gray-50 rounded-xl animate-pulse" />
        </div>
      </MyPageLayout>
    );
  }

  if (!user) return null;

  return (
    <MyPageLayout>
      {user.role === 'shaman' ? <ShamanProfileContent /> : <CustomerProfileContent />}
    </MyPageLayout>
  );
}
