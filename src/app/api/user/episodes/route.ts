import { NextRequest } from "next/server";

const BASE_URL = process.env.SPOTIFY_BASE_URL;

export async function GET(req: NextRequest) {
	const accessToken = req.cookies.get("sp_access")?.value;

	const res = await fetch(BASE_URL + "/me/episodes", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	const data = await res.json();

	return Response.json(data);
}
