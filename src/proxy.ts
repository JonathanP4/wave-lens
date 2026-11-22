import { NextRequest, NextResponse } from "next/server";

const base = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/",
};

export async function proxy(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith("/api/auth/")) {
		return NextResponse.next();
	}

	const access = req.cookies.get("sp_access")?.value;
	const refresh = req.cookies.get("sp_refresh")?.value;

	if (access) return NextResponse.next();

	const toAuth = () => {
		const res = NextResponse.redirect(new URL("/auth", req.url));
		res.cookies.delete("sp_access");
		res.cookies.delete("sp_refresh");
		return res;
	};

	if (!refresh) return toAuth();

	const r = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refresh,
			client_id: process.env.SPOTIFY_CLIENT_ID!,
		}),
	});

	if (!r.ok) return toAuth(); // e.g. invalid_grant: user revoked access

	const t = await r.json(); // access_token, expires_in, maybe refresh_token

	// 1. Make the new token visible to this same request (Server Components, route handlers)
	req.cookies.set("sp_access", t.access_token);
	if (t.refresh_token) req.cookies.set("sp_refresh", t.refresh_token);

	const res = NextResponse.next({ request: { headers: req.headers } });

	// 2. Persist it in the browser for later requests
	res.cookies.set("sp_access", t.access_token, {
		...base,
		maxAge: Math.max(t.expires_in - 60, 0), // expire a minute early
	});
	if (t.refresh_token) {
		res.cookies.set("sp_refresh", t.refresh_token, {
			...base,
			maxAge: 60 * 60 * 24 * 30,
		});
	}

	return res;
}

export const config = {
	matcher: ["/dashboard/:path*", "/api/:path*"],
};
