import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대학가자.kr | 2028 권장과목 검색",
  description:
    "2028학년도 대학별·계열별 권장과목과 반영과목을 검색하고 상담용으로 인쇄·PDF 저장할 수 있는 도구입니다.",
};

const ADSENSE_CLIENT_ID = "ca-pub-1907333435492815";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
