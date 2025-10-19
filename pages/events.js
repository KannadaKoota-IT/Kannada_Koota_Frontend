import Events from '../src/components/Events'

export default function EventsPage({ events }) {
  return <Events initialEvents={events} />
}

export async function getServerSideProps(context) {
  try {
    const { lang = 'en' } = context.query;
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

    const res = await fetch(`${API_BASE}/api/events?lang=${lang}`, {
      headers: {
        'User-Agent': 'Next.js SSR',
      },
    });

    const data = await res.json();

    const events = Array.isArray(data) ? data : [];

    return {
      props: {
        events,
      },
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      props: {
        events: [],
      },
    };
  }
}
