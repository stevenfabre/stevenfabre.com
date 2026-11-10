export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const countryCode = request.headers.get("x-vercel-ip-country");
  const encodedCity = request.headers.get("x-vercel-ip-city");
  let city: string | null = null;
  try {
    city = encodedCity ? decodeURIComponent(encodedCity).trim() : null;
  } catch {
    // Ignore malformed location headers.
  }
  const country =
    countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : null;

  return Response.json(
    { location: [city, country].filter(Boolean).join(", ") || null },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
