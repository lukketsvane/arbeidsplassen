import type { NextApiRequest, NextApiResponse } from 'next';

// Replace with the new token generated using your email.
const AUTH_TOKEN = "NEW_VALID_TOKEN_VALUE";
const API_URL = "https://arbeidsplassen.nav.no/public-feed/api/v1/ads";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let allJobs: any[] = [];
  let page = 0;
  const size = 50; // Maximum allowed page size is 50.
  while (true) {
    const url = new URL(API_URL);
    url.searchParams.append("page", String(page));
    url.searchParams.append("size", String(size));
    console.log(`Fetching page ${page}: ${url.toString()}`);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
      });
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error(`Error fetching page ${page}:`, response.status, errorDetails);
        return res.status(response.status).json({
          message: "Error fetching data",
          details: errorDetails,
        });
      }
      const data = await response.json();
      if (!data.content || data.content.length === 0) break;
      allJobs = allJobs.concat(data.content);
      if (data.last === true || data.content.length < size) break;
      page++;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: "Server error", error: error.message });
      }
      return res.status(500).json({ message: "Server error" });
    }
  }
  return res.status(200).json({ content: allJobs, total: allJobs.length });
}
