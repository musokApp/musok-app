'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, MessageSquare, User, ChevronRight, LayoutDashboard, History, FileText, BarChart } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

const CUSTOMER_MENU = [
  { href: ROUTES.MY_BOOKINGS, label: '예약 내역', icon: Calendar },
  { href: ROUTES.CHAT, label: '채팅', icon: MessageSquare },
  { href: ROUTES.CUSTOMER_PROFILE, label: '내 정보 관리', icon: User },
];

const SHAMAN_MENU = [
  { href: ROUTES.SHAMAN_DASHBOARD, label: '대시보드', icon: LayoutDashboard },
  { href: ROUTES.SHAMAN_BOOKINGS, label: '예약 관리', icon: Calendar },
  { href: ROUTES.CHAT, label: '채팅', icon: MessageSquare },
  { href: ROUTES.SHAMAN_SCHEDULE, label: '일정 관리', icon: History },
  { href: ROUTES.SHAMAN_REVIEWS, label: '후기 관리', icon: FileText },
  { href: ROUTES.SHAMAN_REVENUE, label: '수익 현황', icon: BarChart },
  { href: ROUTES.SHAMAN_PROFILE, label: '내 프로필', icon: User },
];

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export function MyPageLayout({ children }: MyPageLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = user?.role === 'shaman' ? SHAMAN_MENU : CUSTOMER_MENU;

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <nav className="sticky top-24 border border-gray-100 rounded-2xl overflow-hidden">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-5 py-4 text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive(item.href) ? 'text-primary' : 'text-gray-300'}`} />
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
