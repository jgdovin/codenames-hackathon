//bg-red-700 bg-blue-700 bg-black bg-yellow-200 bg-neutral bg-blue-500 bg-red-500
// tailwind hack to make sure dynamic colors are available

import GameArea from '@/components/GameArea';

export default async function Home({ params }: { params: { room: string } }) {
  const { room } = params;

  return (
    <main className='flex'>
      <GameArea room={room} />
    </main>
  );
}
