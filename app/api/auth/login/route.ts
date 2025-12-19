import { NextResponse } from "next/server";

const scopes = [
    "user-top-read",
    "playlist-modify-public",
    "playlist-modify-private",
].join(" ");

export async function GET() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        console.error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI");

        return NextResponse.json(
            { error: "Server misconfigured" },
            { status: 500 }
        );
    }

    const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log("Full auth URL:", authUrl);

    return NextResponse.redirect(authUrl);
}