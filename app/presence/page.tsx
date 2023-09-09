"use client";

import PresencePane from '@/components/presence/PresencePane'
import { useUser } from '@clerk/nextjs';
const Page = () => {
  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;
  const userId = user?.id;
  const username = user.username || '';
  return (
    <div>
      <PresencePane userId={userId} username={username} />
    </div>
  )
}

export default Page