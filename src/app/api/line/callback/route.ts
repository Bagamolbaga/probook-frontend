import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing authorization code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const tokenResponse = await axios.post<TGetLineAccessTokenRes>(
      "https://api.line.me/oauth2/v2.1/token ",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/line/callback`,
        client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || "",
        client_secret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET || "",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get<TUserLine>("https://api.line.me/v2/profile ", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = userResponse.data;

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/account/notifications?${new URLSearchParams(userData).toString()}`,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error get user data from LINE" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
