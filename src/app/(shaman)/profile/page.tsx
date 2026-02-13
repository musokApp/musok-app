'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShamanProfile, Specialty } from '@/types/shaman.types';
import { CheckCircle, Clock } from 'lucide-react';

const REGIONS = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시'];
const SPECIALTIES: Specialty[] = ['굿', '점술', '사주', '타로', '궁합', '작명', '풍수', '해몽'];

export default function ShamanProfilePage() {
  const { user, isLoading } = useAuth();
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
  });

  useEffect(() => {
    if (!isLoading && user?.role !== 'shaman') {
      router.push('/');
    }
  }, [user, isLoading, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 더미 데이터이므로 실제 저장은 하지 않고 성공 메시지만 표시
    alert(shaman ? '프로필이 수정되었습니다 (더미 모드)' : '프로필이 등록되었습니다. 관리자 승인을 기다려주세요 (더미 모드)');
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">무속인 프로필</h1>
          <p className="text-muted-foreground">
            {shaman ? '프로필을 수정하세요' : '프로필을 등록하고 고객을 받아보세요'}
          </p>
        </div>

        {/* 상태 카드 */}
        {shaman && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {shaman.status === 'approved' ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-medium">승인 완료</p>
                      <p className="text-sm text-muted-foreground">
                        고객들이 회원님의 프로필을 볼 수 있습니다
                      </p>
                    </div>
                  </>
                ) : shaman.status === 'pending' ? (
                  <>
                    <Clock className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="font-medium">승인 대기 중</p>
                      <p className="text-sm text-muted-foreground">
                        관리자 승인을 기다리고 있습니다
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-red-500 rounded-full" />
                    <div>
                      <p className="font-medium">승인 거절</p>
                      <p className="text-sm text-muted-foreground">
                        프로필을 수정하여 다시 신청해주세요
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>고객에게 보여질 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 상호명 */}
              <div className="space-y-2">
                <Label htmlFor="businessName">상호명 *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="예: 명가점술원"
                  required
                />
              </div>

              {/* 소개 */}
              <div className="space-y-2">
                <Label htmlFor="description">소개 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="무속인으로서의 경력과 전문성을 소개해주세요"
                  rows={5}
                  required
                />
              </div>

              {/* 전문분야 */}
              <div className="space-y-2">
                <Label>전문분야 * (최소 1개 선택)</Label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant={formData.specialties.includes(specialty) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSpecialty(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 경력 */}
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">경력 (년) *</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  placeholder="예: 15"
                  min="0"
                  required
                />
              </div>

              {/* 지역 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">지역 *</Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">구/군 *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="예: 강남구"
                    required
                  />
                </div>
              </div>

              {/* 주소 */}
              <div className="space-y-2">
                <Label htmlFor="address">상세 주소 *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                  required
                />
              </div>

              {/* 기본 요금 */}
              <div className="space-y-2">
                <Label htmlFor="basePrice">기본 요금 (원) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="예: 50000"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              {/* 안내 메시지 */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ 현재 더미 데이터 모드입니다. 프로필 저장 기능은 데이터베이스 연동 후 활성화됩니다.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {shaman ? '프로필 수정' : '프로필 등록'}
                </Button>
                {shaman && (
                  <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
                    취소
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
