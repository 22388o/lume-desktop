/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from '@stores/currentUser';

import LikeIcon from '@assets/icons/Like';
import LikeSolidIcon from '@assets/icons/LikeSolid';

import { useStore } from '@nanostores/react';
import { dateToUnix, useNostr, useNostrEvents } from 'nostr-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { useState } from 'react';

export default function Reaction({
  eventID,
  eventPubkey,
}: {
  eventID: string;
  eventPubkey: string;
}) {
  const { publish } = useNostr();
  const [reaction, setReaction] = useState(0);
  const [isReact, setIsReact] = useState(false);

  const $currentUser: any = useStore(currentUser);
  const pubkey = $currentUser.pubkey;
  const privkey = $currentUser.privkey;

  const { onEvent } = useNostrEvents({
    filter: {
      '#e': [eventID],
      since: 0,
      kinds: [7],
      limit: 20,
    },
  });

  onEvent((rawMetadata) => {
    try {
      const content = rawMetadata.content;
      if (content === '🤙' || content === '+') {
        setReaction(reaction + 1);
      }
    } catch (err) {
      console.error(err, rawMetadata);
    }
  });

  const handleReaction = (e: any) => {
    e.stopPropagation();

    const event: any = {
      content: '+',
      kind: 7,
      tags: [
        ['e', eventID],
        ['p', eventPubkey],
      ],
      created_at: dateToUnix(),
      pubkey: pubkey,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, privkey);

    publish(event);

    setIsReact(true);
    setReaction(reaction + 1);
  };

  return (
    <button
      onClick={(e) => handleReaction(e)}
      className="group flex w-16 items-center gap-1.5 text-sm text-zinc-500">
      <div className="rounded-lg p-1 group-hover:bg-zinc-600">
        {isReact ? (
          <LikeSolidIcon className="h-5 w-5 text-red-500" />
        ) : (
          <LikeIcon className="h-5 w-5 group-hover:text-red-400" />
        )}
      </div>
      <span>{reaction}</span>
    </button>
  );
}
