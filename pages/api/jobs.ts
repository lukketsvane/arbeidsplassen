// pages/api/jobs.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const AUTH_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdWJsaWMudG9rZW4udjJAbmF2Lm5vIiwiYXVkIjoiZmVlZC1hcGktdjEiLCJpc3MiOiJuYXYubm8iLCJleHAiOjE3NDYwNTA0MDAsImlhdCI6MTczMjExMjk2OX0.WHEC0oGgzZQjut1n2ZQK2xtW2gPhUCaBzTup2aqF2Wk";
const API_URL = "https://arbeidsplassen.nav.no/public-feed/api/v1/ads";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Construct URL with query parameters
  const url = new URL(API_URL);
  Object.entries(req.query).forEach(([key, value]) => {
    if (typeof value === "string") {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`,
      },
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error", response.status, errorDetails);
      return res.status(response.status).json({
        message: "Error fetching data",
        details: errorDetails,
      });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    } else {
      return res.status(500).json({ message: "Server error" });
    }
  }
}
