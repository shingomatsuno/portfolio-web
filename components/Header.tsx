import Link from 'next/link';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/user';

export default function Header({ profile }: { profile: Profile }) {
  const navItems = ['About', 'Skills', 'Projects', 'Contact'];

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#ffffffe6]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-slate-300"
        >
          Portfolio
        </Link>
        <div className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>
        <div>
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="h-5 w-5" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
