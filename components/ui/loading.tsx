import * as React from 'react';

import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

const Loading = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center gap-6',
          className,
        )}
        {...props}
        ref={ref}
      >
        <Spinner className="size-6 text-red-500" />
        <Spinner className="size-6 text-green-500" />
        <Spinner className="size-6 text-blue-500" />
        <Spinner className="size-6 text-yellow-500" />
        <Spinner className="size-6 text-purple-500" />
      </div>
    );
  },
);
Loading.displayName = 'Loading';

export { Loading };
