import HomePage from "../src/components/HomePage";

export default function Home({ announcements }) {
  return <HomePage announcements={announcements} />;
}

export async function getStaticProps() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

    const announcementsRes = await fetch(`${API_BASE}/api/announcements`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });

    const announcementsData = await announcementsRes.json();

    const announcements = announcementsData.success
      ? announcementsData.announcements.map((item) => ({
          title: item.title,
          message: item.message,
        }))
      : [];

    return {
      props: { announcements },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: { announcements: [] },
      revalidate: 60,
    };
  }
}
