export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">무속은 안 어려워?</h3>
            <p className="text-sm text-muted-foreground">
              신뢰할 수 있는 무속인 예약 플랫폼
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">서비스</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>무속인 찾기</li>
              <li>예약하기</li>
              <li>후기 보기</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">고객센터</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>자주 묻는 질문</li>
              <li>공지사항</li>
              <li>문의하기</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 무속은 안 어려워?. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
