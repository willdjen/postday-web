type TopBarProps = {
  userName: string;
};

export default function TopBar({ userName }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Postday</p>
          <h1 className="text-lg font-semibold text-neutral-900">Selamat datang, {userName}</h1>
        </div>
      </div>
    </header>
  );
}
