'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getShamanById } from '@/services/shaman.service';
import { ShamanWithUser } from '@/types/shaman.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Briefcase, Phone, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShamanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [shaman, setShaman] = useState<ShamanWithUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchShaman(params.id as string);
    }
  }, [params.id]);

  const fetchShaman = async (id: string) => {
    try {
      setLoading(true);
      const data = await getShamanById(id);
      setShaman(data);
    } catch (error) {
      console.error('Failed to fetch shaman:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!shaman) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">무속인을 찾을 수 없습니다</div>
        <Button onClick={() => router.push('/shamans')}>목록으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 이미지 및 기본 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 이미지 갤러리 */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {shaman.images.length > 0 ? (
                    shaman.images.map((image, index) => (
                      <div key={index} className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${shaman.businessName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="relative h-64 md:h-80 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center rounded-lg">
                      <div className="text-8xl">🔮</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 소개 */}
            <Card>
              <CardHeader>
                <CardTitle>소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{shaman.description}</p>
              </CardContent>
            </Card>

            {/* 위치 */}
            <Card>
              <CardHeader>
                <CardTitle>위치</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{shaman.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {shaman.region} {shaman.district}
                      </p>
                    </div>
                  </div>
                  {/* 나중에 카카오맵 추가 */}
                  <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-muted-foreground">
                    지도 (추후 카카오맵 연동 예정)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 예약 및 상세 정보 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{shaman.businessName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 평점 */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{shaman.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({shaman.totalBookings}건의 예약)
                  </span>
                </div>

                {/* 경력 */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-5 h-5" />
                  <span>{shaman.yearsExperience}년 경력</span>
                </div>

                {/* 전문분야 */}
                <div>
                  <p className="text-sm font-medium mb-2">전문분야</p>
                  <div className="flex flex-wrap gap-2">
                    {shaman.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 연락처 */}
                {shaman.user && (
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{shaman.user.email}</span>
                    </div>
                    {shaman.user.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{shaman.user.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 가격 및 예약 */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">기본 요금</p>
                  <p className="text-3xl font-bold text-primary">
                    {shaman.basePrice.toLocaleString()}원~
                  </p>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href={`/booking/${shaman.id}`}>예약하기</Link>
                </Button>

                <Button variant="outline" className="w-full">
                  문의하기
                </Button>
              </CardContent>
            </Card>

            {/* 후기 (추후 구현) */}
            <Card>
              <CardHeader>
                <CardTitle>후기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  후기 기능은 추후 추가될 예정입니다
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
