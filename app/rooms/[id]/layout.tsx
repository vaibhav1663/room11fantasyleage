import type { Metadata } from 'next';
import dbConnect from '@/app/lib/mongodb';
import Room from '@/app/models/Room';

type Props = {
  params: { id: string };
};

async function getRoomData(id: string) {
  try {
    await dbConnect();
    const room = await Room.findById(id).lean();
    if (!room) return null;
    return {
      name: (room as any).name,
      slug: (room as any).slug,
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await getRoomData(params.id);
  
  if (!room) {
    return {
      title: 'Room - Sapna 11',
      description: 'Fantasy cricket room',
    };
  }

  const title = `${room.name} - Sapna 11`;
  const description = `Join the ${room.name} fantasy cricket league! Build your team and compete with friends.`;
  const url = `https://sapna11.vercel.app/rooms/${params.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Sapna 11',
      images: [
        {
          url: '/og.jpg',
          width: 1200,
          height: 630,
          alt: `${room.name} - Sapna 11`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.jpg'],
    },
  };
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
