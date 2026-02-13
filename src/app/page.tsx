import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">
          무속은 안 어려워? 🔮
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          무속인 예약 플랫폼
        </p>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>프로젝트 초기화 완료!</CardTitle>
            <CardDescription>
              Next.js + TypeScript + Tailwind CSS + shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button>무속인 찾기</Button>
              <Button variant="outline">회원가입</Button>
              <Button variant="ghost">로그인</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              ✨ Phase 1: 프로젝트 초기화 진행 중
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
