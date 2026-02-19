'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { Search, User, Heart, MessageSquare, Menu, X, LogOut } from 'lucide-react';

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex-shrink-0">
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              무속
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="어떤 상담을 찾으시나요?"
                className="w-full h-11 pl-12 pr-4 rounded-full bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* User Actions - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {isLoading ? (
              <div className="w-20 h-9 rounded-lg bg-gray-100 animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href={ROUTES.MY_BOOKINGS}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span className="text-[11px] text-gray-600">내 예약</span>
                </Link>
                <Link
                  href={ROUTES.CHAT}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <span className="text-[11px] text-gray-600">채팅</span>
                </Link>
                <Link
                  href={ROUTES.CUSTOMER_PROFILE}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-[11px] text-gray-600">{user.fullName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span className="text-[11px] text-gray-600">로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-[11px] text-gray-600">로그인</span>
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  className="ml-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="어떤 상담을 찾으시나요?"
              className="w-full h-10 pl-12 pr-4 rounded-full bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              href={ROUTES.SHAMANS}
              className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              무속인 찾기
            </Link>
            {user ? (
              <>
                <Link
                  href={ROUTES.MY_BOOKINGS}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  내 예약
                </Link>
                <Link
                  href={ROUTES.CHAT}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  채팅
                </Link>
                <Link
                  href={ROUTES.CUSTOMER_PROFILE}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  내 프로필
                </Link>
                <div className="h-px bg-gray-100 my-2" />
                <div className="px-4 py-2 text-sm text-gray-500">
                  {user.fullName}님
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-gray-100 my-2" />
                <Link
                  href={ROUTES.LOGIN}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href={ROUTES.SIGNUP}
                  className="mx-4 mt-2 py-3 bg-primary text-white text-sm font-semibold rounded-xl text-center hover:bg-primary/90 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
