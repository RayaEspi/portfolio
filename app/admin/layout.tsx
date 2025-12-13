export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 font-sans text-zinc-900 dark:bg-black/10 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-2xl">{children}</div>
    </div>
  );
}
