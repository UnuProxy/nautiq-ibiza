// app/boats/[id]/page.tsx  (SERVER)
import BoatPageClient from "./BoatPageClient";


type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;                 // ✅ await
  const decoded = decodeURIComponent(id);
  return {
    title: `Boat · ${decoded} · Nautiq Ibiza`,
    description: "Curated yacht charters in Ibiza & Formentera.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;                 // ✅ await
  return <BoatPageClient id={decodeURIComponent(id)} />;
}



