import Announcements from '../src/components/Announcements'

export default function AnnouncementsPage({ announcements }) {
  return <Announcements initialAnnouncements={announcements} />
}

export async function getServerSideProps(context) {
  try {
    const { lang = 'en' } = context.query;
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

    const res = await fetch(`${API_BASE}/api/announcements?lang=${lang}`, {
      headers: {
        'User-Agent': 'Next.js SSR',
      },
    });

    const data = await res.json();

    const announcements = data.success ? data.announcements : [];

    return {
      props: {
        announcements,
      },
    };
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return {
      props: {
        announcements: [],
      },
    };
  }
}
