/* eslint-disable @typescript-eslint/no-explicit-any */
import { Content } from '@components/note/content';

import { memo } from 'react';

export const Single = memo(function Single({ event }: { event: any }) {
  return (
    <div className="flex h-min min-h-min w-full cursor-pointer select-text flex-col border-b border-zinc-800 py-4 px-6 hover:bg-zinc-800">
      <Content data={event} />
    </div>
  );
});
