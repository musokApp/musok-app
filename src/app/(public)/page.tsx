'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ShamanProfile } from "@/types/shaman.types";
import {
    Sparkles, Eye, Moon, Star, Flame, Compass,
    Clock, Shield, ChevronRight, ArrowRight, Heart, Users, MessageCircle
} from "lucide-react";

const CATEGORIES = [
    { icon: Eye, label: "사주", color: "bg-violet-100 text-violet-600", href: ROUTES.SHAMANS },
    { icon: Moon, label: "타로", color: "bg-blue-100 text-blue-600", href: ROUTES.SHAMANS },
    { icon: Star, label: "궁합", color: "bg-pink-100 text-pink-600", href: ROUTES.SHAMANS },
    { icon: Flame, label: "신점", color: "bg-orange-100 text-orange-600", href: ROUTES.SHAMANS },
    { icon: Compass, label: "풍수", color: "bg-emerald-100 text-emerald-600", href: ROUTES.SHAMANS },
    { icon: Sparkles, label: "작명", color: "bg-amber-100 text-amber-600", href: ROUTES.SHAMANS },
    { icon: MessageCircle, label: "전화상담", color: "bg-cyan-100 text-cyan-600", href: ROUTES.SHAMANS },
    { icon: Heart, label: "채팅상담", color: "bg-rose-100 text-rose-600", href: ROUTES.SHAMANS },
];

export default function HomePage() {
    const [popularShamans, setPopularShamans] = useState<ShamanProfile[]>([]);

    useEffect(() => {
        fetch('/api/shamans?limit=4')
            .then(res => res.json())
            .then(data => {
                if (data.shamans) setPopularShamans(data.shamans.slice(0, 4));
            })
            .catch(() => {});
    }, []);
    return (
        <div className="flex flex-col">
            {/* Promo Banner */}
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3">
                    <span className="text-sm text-gray-700">
                        가입하고 <strong className="text-primary">첫 상담 50% 할인</strong> 받으세요!
                    </span>
                    <Link
                        href={ROUTES.SIGNUP}
                        className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary/90 transition-colors"
                    >
                        가입하기
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Category Grid */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {CATEGORIES.map(({ icon: Icon, label, color, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:shadow-md`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">{label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Quick Links */}
            <section className="container mx-auto px-4 pb-6">
                <div className="grid grid-cols-3 gap-3">
                    <Link
                        href={ROUTES.SHAMANS}
                        className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-lg">🎁</span>
                        <span className="text-sm font-medium text-gray-700">이벤트</span>
                    </Link>
                    <Link
                        href={ROUTES.SHAMANS}
                        className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-lg">🏷️</span>
                        <span className="text-sm font-medium text-gray-700">쿠폰팩</span>
                    </Link>
                    <Link
                        href={ROUTES.SHAMANS}
                        className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-lg">⭐</span>
                        <span className="text-sm font-medium text-gray-700">베스트 후기</span>
                    </Link>
                </div>
            </section>

            {/* Banner Section */}
            <section className="container mx-auto px-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Banner 1 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 md:p-8 text-white">
                        <div className="relative z-10">
                            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-3">
                                신규 회원 혜택
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2">
                                첫 상담 예약 시
                                <br />
                                최대 50% 할인
                            </h3>
                            <p className="text-sm text-white/80 mb-4">
                                지금 가입하고 특별 혜택을 받아보세요
                            </p>
                            <Link
                                href={ROUTES.SIGNUP}
                                className="inline-flex items-center gap-1 px-5 py-2.5 bg-white text-violet-600 text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
                            >
                                지금 시작하기
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full" />
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
                    </div>

                    {/* Banner 2 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 md:p-8 text-white">
                        <div className="relative z-10">
                            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-3">
                                이달의 추천
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2">
                                2025 신년 운세
                                <br />
                                지금 바로 확인하세요
                            </h3>
                            <p className="text-sm text-white/80 mb-4">
                                검증된 전문가의 정확한 신년 운세 풀이
                            </p>
                            <Link
                                href={ROUTES.SHAMANS}
                                className="inline-flex items-center gap-1 px-5 py-2.5 bg-white text-orange-600 text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
                            >
                                운세 보기
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full" />
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Popular Shamans */}
            <section className="bg-gray-50 py-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">인기 무속인</h2>
                        <Link
                            href={ROUTES.SHAMANS}
                            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                            전체보기
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {popularShamans.length === 0 ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
                                            <div className="h-3 bg-gray-100 rounded w-16" />
                                        </div>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded w-24 mb-3" />
                                    <div className="h-5 bg-gray-200 rounded w-16" />
                                </div>
                            ))
                        ) : (
                            popularShamans.map((shaman) => (
                                <Link
                                    key={shaman.id}
                                    href={`${ROUTES.SHAMANS}/${shaman.id}`}
                                    className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                                            <span className="text-lg font-bold text-primary">
                                                {shaman.businessName.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{shaman.businessName}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {shaman.specialties.slice(0, 2).join(' · ')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-3">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="text-sm font-semibold text-gray-900">
                                            {shaman.averageRating?.toFixed(1) ?? '-'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ({shaman.totalBookings?.toLocaleString() ?? 0}건)
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-gray-900">
                                            {shaman.basePrice.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500">원~</span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">왜 무속을 선택해야 할까요?</h2>
                    <p className="text-sm text-gray-500">안전하고 편리한 무속인 예약 플랫폼</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="text-center p-6">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-violet-100 flex items-center justify-center">
                            <Shield className="w-7 h-7 text-violet-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">검증된 전문가</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            엄격한 3단계 심사를 통과한 전문 무속인만 등록됩니다
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <Clock className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">간편한 예약</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            실시간 스케줄 확인과 원클릭 예약으로 빠르게 시작하세요
                        </p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
                            <Star className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">투명한 후기</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            실제 이용자의 솔직한 후기로 신뢰할 수 있는 선택
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-gray-50">
                <div className="container mx-auto px-4 py-10">
                    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">500+</div>
                            <div className="text-xs md:text-sm text-gray-500">등록된 무속인</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">10,000+</div>
                            <div className="text-xs md:text-sm text-gray-500">완료된 상담</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">4.8</div>
                            <div className="text-xs md:text-sm text-gray-500">평균 만족도</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center bg-primary rounded-3xl p-8 md:p-12">
                    <Users className="w-10 h-10 text-white/80 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-3">
                        지금 바로 시작하세요
                    </h2>
                    <p className="text-sm text-white/80 mb-6">
                        회원가입하고 검증된 무속인을 만나보세요
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href={ROUTES.SIGNUP}
                            className="px-8 py-3 bg-white text-primary text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
                        >
                            무료 회원가입
                        </Link>
                        <Link
                            href={ROUTES.SHAMANS}
                            className="px-8 py-3 bg-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/30 transition-colors"
                        >
                            둘러보기
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
