import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const code = searchParams.get("code");
	const state = searchParams.get("state");
	const verifier = req.cookies.get("pkce_verifier")?.value;
	const savedState = req.cookies.get("oauth_state")?.value;

	const fail = () => {
		const res = NextResponse.redirect(
			new URL("/auth?error=1", req.nextUrl.origin),
		);
		res.cookies.delete("pkce_verifier");
		res.cookies.delete("oauth_state");

		return res;
	};

	if (
		searchParams.get("error") ||
		!code ||
		!verifier ||
		!state ||
		state !== savedState
	) {
		return fail();
	}

	const redirectUri = new URL(
		"/api/auth/callback",
		req.nextUrl.origin,
	).toString();

	const r = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
			code_verifier: verifier,
		}),
	});

	if (!r.ok) return fail();

	const t = await r.json();
	const base: Partial<ResponseCookie> = {
		httpOnly: true,
		secure: true,
		sameSite: "lax" as const,
		path: "/",
	};

	console.log(req.nextUrl);

	const res = NextResponse.redirect(
		new URL("/dashboard", req.nextUrl.origin),
	);

	res.cookies.set("sp_access", t.access_token, {
		...base,
		maxAge: t.expires_in,
	});
	res.cookies.set("sp_refresh", t.refresh_token, {
		...base,
		maxAge: 60 * 60 * 24 * 30,
	});
	res.cookies.delete("pkce_verifier");
	res.cookies.delete("oauth_state");

	return res;
}
