'use client';

import React from 'react';
import { ScrollAnimationTrigger } from './ui/scroll-animation-trigger';
import { Loading } from './ui/loading';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

export function MypageContainer({
  loading,
  title,
  children,
}: {
  loading: boolean;
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="relative">
      <title>{title}</title>
      <ScrollAnimationTrigger
        effect="fade"
        delay={0.3}
        fromScale={0.7}
        toScale={1}
      >
        <Loading
          className={cn(
            'pointer-events-none transition-opacity duration-500 ease-in-out',
            loading ? 'opacity-100' : 'opacity-0',
          )}
        />
      </ScrollAnimationTrigger>
      {!loading && (
        <ScrollAnimationTrigger
          effect="fade"
          delay={0.3}
          fromScale={0.7}
          toScale={1}
        >
          <div className="relative mx-auto max-w-[980px] space-y-6 px-8 py-12">
            <div className="flex justify-between">
              <h1 className="mb-6 text-2xl font-bold">{title}</h1>
              {pathname !== '/admin' && (
                <Button asChild>
                  <Link href="/admin">
                    <ArrowLeft />
                    管理画面トップへ戻る
                  </Link>
                </Button>
              )}
            </div>
            <div>{children}</div>
          </div>
        </ScrollAnimationTrigger>
      )}
    </div>
  );
}
