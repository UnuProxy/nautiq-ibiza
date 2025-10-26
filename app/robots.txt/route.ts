import { NextResponse } from "next/server";
export const dynamic = "force-static";

export async function GET() {
  const body = `User-agent: *
Allow: /
Sitemap: https://www.nautiqibiza.com/sitemap.xml`;
  return new NextResponse(body, { headers: { "Content-Type": "text/plain" } });
}
