'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import {
    LayoutDashboard,
    Calendar,
    MessageSquare,
    User,
    Settings,
    LogOut,
    Users,
    FileText,
    BarChart,
    Search,
    History
} from 'lucide-react';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    const commonLinks = [
        {
            href: ROUTES.CUSTOMER_PROFILE, // Profile is common but path might differ based on role implementation
            label: '내 프로필',
            icon: User,
            show: true,
        },
    ];

    const customerLinks = [
        { href: ROUTES.SHAMANS, label: '무속인 찾기', icon: Search },
        { href: ROUTES.MY_BOOKINGS, label: '내 예약', icon: Calendar },
        { href: ROUTES.CHAT, label: '채팅', icon: MessageSquare },
    ];

    const shamanLinks = [
        { href: ROUTES.SHAMAN_DASHBOARD, label: '대시보드', icon: LayoutDashboard },
        { href: ROUTES.SHAMAN_BOOKINGS, label: '예약 관리', icon: Calendar },
        { href: ROUTES.CHAT, label: '채팅', icon: MessageSquare },
        { href: ROUTES.SHAMAN_SCHEDULE, label: '일정 관리', icon: History },
        { href: ROUTES.SHAMAN_REVIEWS, label: '후기 관리', icon: FileText },
        { href: ROUTES.SHAMAN_REVENUE, label: '수익 현황', icon: BarChart },
    ];

    const adminLinks = [
        { href: ROUTES.ADMIN_DASHBOARD, label: '대시보드', icon: LayoutDashboard },
        { href: ROUTES.ADMIN_USERS, label: '사용자 관리', icon: Users },
        { href: ROUTES.ADMIN_SHAMANS_MANAGE, label: '무속인 관리', icon: User }, // separated from users?
        { href: ROUTES.ADMIN_REPORTS, label: '신고 관리', icon: FileText },
        { href: ROUTES.ADMIN_STATISTICS, label: '통계', icon: BarChart },
    ];

    let links: { href: string; label: string; icon: any }[] = [];

    if (user.role === 'customer') {
        links = [...customerLinks];
    } else if (user.role === 'shaman') {
        links = [...shamanLinks];
    } else if (user.role === 'admin') {
        links = [...adminLinks];
    }

    return (
        <div className={cn("pb-12 min-h-screen bg-card border-r w-64 flex flex-col", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <Link href={ROUTES.HOME} className="flex items-center pl-2 mb-9">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                            무속은 안 어려워?
                        </span>
                    </Link>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Button
                                key={link.href}
                                variant={isActive(link.href) ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    isActive(link.href) && "bg-secondary/50 font-medium"
                                )}
                                asChild
                                onClick={onClose}
                            >
                                <Link href={link.href}>
                                    <link.icon className="mr-2 h-4 w-4" />
                                    {link.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-auto px-3 py-4 border-t">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.fullName?.[0] || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={() => {
                    logout();
                    onClose?.();
                }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                </Button>
            </div>
        </div>
    );
}
