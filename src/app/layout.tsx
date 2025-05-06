import './globals.css';

export const metadata = {
  title: "求人アプリ",
  description: "求人情報を簡単検索・投稿できるアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white text-gray-900">
        <main>{children}</main>
      </body>
    </html>
  );
}