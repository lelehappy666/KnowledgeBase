import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "展品知识库",
  description: "企业级展品展项知识库",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
