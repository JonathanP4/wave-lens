import crypto from "crypto";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET() {
	const verifier = crypto.randomBytes(64).toString("base64url");
	const challenge = crypto
		.createHash("sha256")
		.update(verifier)
		.digest("base64url");
	const state = crypto.randomBytes(16).toString("base64url");

	const scope =
		"user-read-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-read user-read-email user-read-private";
	const authUrl = new URL("https://accounts.spotify.com/authorize");

	const params = {
		response_type: "code",
		client_id: CLIENT_ID,
		scope,
		code_challenge_method: "S256",
		code_challenge: challenge,
		redirect_uri: REDIRECT_URI,
		state,
	};

	authUrl.search = new URLSearchParams(params).toString();

	const res = NextResponse.redirect(authUrl);

	const opts: Partial<ResponseCookie> = {
		httpOnly: true,
		secure: true,
		sameSite: "lax" as const,
		path: "/",
		maxAge: 600,
	};

	res.cookies.set("pkce_verifier", verifier, opts);
	res.cookies.set("oauth_state", state, opts);

	return res;
}
