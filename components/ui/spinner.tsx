import { Loader2Icon } from 'lucide-react';
import { type SVGProps } from 'react';

import { cn } from '@/lib/utils';

function Spinner({
  className,
  ...props
}: Omit<SVGProps<SVGSVGElement>, 'ref'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

Spinner.displayName = 'Spinner';

export { Spinner };
