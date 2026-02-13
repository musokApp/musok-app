import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={ROUTES.HOME} className="text-2xl font-bold">
          🔮 무속은 안 어려워?
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href={ROUTES.SHAMANS} className="text-sm font-medium hover:text-primary">
            무속인 찾기
          </Link>
          <Link href={ROUTES.MY_BOOKINGS} className="text-sm font-medium hover:text-primary">
            내 예약
          </Link>
          <Link href={ROUTES.CHAT} className="text-sm font-medium hover:text-primary">
            채팅
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href={ROUTES.LOGIN}>로그인</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.SIGNUP}>회원가입</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
