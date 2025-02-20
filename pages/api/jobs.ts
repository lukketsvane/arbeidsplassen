import type { NextApiRequest, NextApiResponse } from 'next';

// Replace with the new token generated using your email.
const AUTH_TOKEN = "NEW_VALID_TOKEN_VALUE";
const API_URL = "https://arbeidsplassen.nav.no/public-feed/api/v1/ads";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Construct the URL using query parameters
  const url = new URL(API_URL);
  if (req.query && typeof req.query === 'object') {
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        url.searchParams.append(key, value);
      } else if (Array.isArray(value)) {
        url.searchParams.append(key, value.join(','));
      }
    });
  }
  if (!req.query.size) {
    url.searchParams.append("size", "10");
  }

  console.log("Fetching URL:", url.toString());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`,
      },
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error fetching data:", response.status, errorDetails);
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
    }
    return res.status(500).json({ message: "Server error" });
  }
}
