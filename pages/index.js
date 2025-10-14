import HomePage from '../src/components/HomePage'

export default function Home({ events, announcements }) {
  return <HomePage events={events} announcements={announcements} />
}

export async function getStaticProps() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

    // Fetch events
    const eventsRes = await fetch(`${API_BASE}/api/events`)
    const eventsData = await eventsRes.json()

    // Fetch announcements
    const announcementsRes = await fetch(`${API_BASE}/api/announcements`)
    const announcementsData = await announcementsRes.json()

    const events = eventsData.map((event) => ({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toLocaleDateString(),
      time: formatTime(event.eventTime),
      location: event.location || "TBA",
      image: event.imageUrl ? `${API_BASE}${event.imageUrl}` : null,
    }))

    const announcements = announcementsData.success
      ? announcementsData.announcements.map((item, index) => ({
          title: item.title,
          message: item.message,
        }))
      : []

    return {
      props: {
        events,
        announcements,
      },
      revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        events: [],
        announcements: [],
      },
      revalidate: 60,
    }
  }
}

function formatTime(time) {
  if (!time) return ""
  const [hours, minutes] = time.split(":")
  let h = parseInt(hours, 10)
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${h}:${minutes} ${ampm}`
}
