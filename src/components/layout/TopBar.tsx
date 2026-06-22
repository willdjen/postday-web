import Image from 'next/image';

type TopBarProps = {
  userName: string;
};

export default function TopBar({ userName }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Image src="/postday-icon.svg" alt="Postday" width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10 object-contain md:hidden transition-all" />
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-neutral-900">Selamat datang, {userName}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
