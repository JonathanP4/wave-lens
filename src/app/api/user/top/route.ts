import { NextRequest } from "next/server";

const BASE_URL = process.env.SPOTIFY_BASE_URL;

export async function POST(req: NextRequest) {
	const accessToken = req.cookies.get("sp_access")?.value;

	const {
		type,
		time_range = "medium_term",
		limit = 10,
		offset = 0,
	} = await req.json();

	const res = await fetch(
		BASE_URL +
			`/me/top/${type}?time_range=${time_range}&limit=${limit}&offset=${offset}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);

	const data = await res.json();

	return Response.json(data);
}
