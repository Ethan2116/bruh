import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error) {
    console.error("Spotify auth error:", error);
    return NextResponse.json(
      { error: "Spotify authorization failed" },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Missing Spotify env vars");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error("Error fetching token:", tokenRes.status, text);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token as string;
  const refreshToken = tokenJson.refresh_token as string | undefined;
  const expiresIn = tokenJson.expires_in as number;
  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!meRes.ok) {
    const text = await meRes.text();
    console.error("Error fetching /me:", meRes.status, text);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }

  const me = await meRes.json();
  // For now: log stuff so you can see it works.
  console.log("Spotify user profile:", me);
  console.log("Tokens:", { accessToken, refreshToken, expiresIn });

  // TEMP: just show JSON response in the browser
  // Later you'll store in DB and redirect to a dashboard
  // Convert expiry seconds into a real timestamp
  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

  const spotifyId = me.id as string;
  const displayName = me.display_name as string | undefined;

  // Save or update the user in your DB
  const user = await prisma.user.upsert({
    where: { spotifyId },
    update: {
      displayName,
      accessToken,
      refreshToken,
      tokenExpiresAt,
    },
    create: {
      spotifyId,
      displayName,
      accessToken,
      refreshToken,
      tokenExpiresAt,
    },
  });

  // Set the cookie so your app knows which user is logged in
  const response = NextResponse.redirect(new URL("/dashboard", req.url));


  response.cookies.set("userId", String(user.id), {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    path: "/",
  });

  // Return the redirect response
  return response;
}