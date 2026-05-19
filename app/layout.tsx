import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2028 권장과목 검색 | 대학·학과별 반영과목",
  description:
    "2028학년도 대학별·계열별 권장과목과 반영과목을 검색하고 상담용으로 인쇄·PDF 저장할 수 있는 도구입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans">{children}</body>
    </html>
  );
}
