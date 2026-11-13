import { NextRequest } from "next/server";

const BASE_URL = process.env.SPOTIFY_BASE_URL;

export async function POST(req: NextRequest) {
	const accessToken = req.cookies.get("sp_access")?.value;

	const { limit = 50 } = await req.json();

	const res = await fetch(
		BASE_URL + `/me/player/recently-played?limit=${limit}`,
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);

	const data = await res.json();

	return Response.json(data);
}
