import type { NextApiRequest, NextApiResponse } from 'next';

const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdWJsaWMudG9rZW4udjJAbmF2Lm5vIiwiYXVkIjoiZmVlZC1hcGktdjEiLCJpc3MiOiJuYXYubm8iLCJleHAiOjE3NDYwNTA0MDAsImlhdCI6MTczMjExMjk2OX0.WHEC0oGgzZQjut1n2ZQK2xtW2gPhUCaBzTup2aqF2Wk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = "https://pam-stilling-feed.nav.no/api/v1/feed";
  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`,
      },
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error", response.status, errorDetails);
      return res.status(response.status).json({ message: "Error fetching data", details: errorDetails });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
