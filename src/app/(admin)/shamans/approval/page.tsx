'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShamanWithUser } from '@/types/shaman.types';
import { MapPin, Briefcase, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';

export default function ShamanApprovalPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [shamans, setShamans] = useState<ShamanWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchPendingShamans();
  }, []);

  const fetchPendingShamans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/shamans/pending');
      if (response.ok) {
        const data = await response.json();
        setShamans(data.shamans);
      }
    } catch (error) {
      console.error('Failed to fetch pending shamans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (shamanId: string) => {
    // 더미 데이터이므로 실제로는 저장하지 않음
    alert('승인되었습니다 (더미 모드)');
    // 실제로는 API 호출 후 목록 갱신
    setShamans((prev) => prev.filter((s) => s.id !== shamanId));
  };

  const handleReject = (shamanId: string) => {
    // 더미 데이터이므로 실제로는 저장하지 않음
    alert('거절되었습니다 (더미 모드)');
    // 실제로는 API 호출 후 목록 갱신
    setShamans((prev) => prev.filter((s) => s.id !== shamanId));
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">무속인 승인 관리</h1>
          <p className="text-muted-foreground">승인 대기 중인 무속인을 검토하고 승인하세요</p>
        </div>

        {shamans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">승인 대기 중인 무속인이 없습니다</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {shamans.map((shaman) => (
              <Card key={shaman.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{shaman.businessName}</CardTitle>
                      <CardDescription className="mt-2">
                        신청일: {new Date(shaman.createdAt).toLocaleDateString('ko-KR')}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">승인 대기</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 무속인 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">기본 정보</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <span>{shaman.yearsExperience}년 경력</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {shaman.region} {shaman.district}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">주소:</span> {shaman.address}
                          </div>
                          <div>
                            <span className="text-muted-foreground">기본 요금:</span>{' '}
                            <span className="font-semibold">{shaman.basePrice.toLocaleString()}원</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">전문분야</h3>
                        <div className="flex flex-wrap gap-2">
                          {shaman.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {shaman.user && (
                        <div>
                          <h3 className="font-semibold mb-2">연락처 정보</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{shaman.user.email}</span>
                            </div>
                            {shaman.user.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{shaman.user.phone}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">이름:</span> {shaman.user.fullName}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 소개 */}
                  <div>
                    <h3 className="font-semibold mb-2">소개</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {shaman.description}
                    </p>
                  </div>

                  {/* 이미지 */}
                  {shaman.images.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">이미지</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {shaman.images.map((image, index) => (
                          <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`${shaman.businessName} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(shaman.id)}
                      className="flex-1"
                      variant="default"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      승인
                    </Button>
                    <Button
                      onClick={() => handleReject(shaman.id)}
                      className="flex-1"
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      거절
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 안내 메시지 */}
        <Card className="mt-6">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              ⚠️ 현재 더미 데이터 모드입니다. 승인/거절 기능은 데이터베이스 연동 후 활성화됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
