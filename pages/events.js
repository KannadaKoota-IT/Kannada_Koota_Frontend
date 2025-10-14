import Events from '../src/components/Events'

export default function EventsPage({ events }) {
  return <Events events={events} />
}

export async function getStaticProps() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

    const res = await fetch(`${API_BASE}/api/events`)
    const data = await res.json()

    return {
      props: {
        events: data,
      },
      revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return {
      props: {
        events: [],
      },
      revalidate: 60,
    }
  }
}
