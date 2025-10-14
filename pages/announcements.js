import Announcements from '../src/components/Announcements'

export default function AnnouncementsPage({ announcements }) {
  return <Announcements announcements={announcements} />
}

export async function getStaticProps() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

    const res = await fetch(`${API_BASE}/api/announcements`)
    const data = await res.json()

    return {
      props: {
        announcements: data.announcements || [],
      },
      revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return {
      props: {
        announcements: [],
      },
      revalidate: 60,
    }
  }
}
