import { NextRequest } from "next/server";

const BASE_URL = process.env.SPOTIFY_BASE_URL!;

export async function POST(req: NextRequest) {
	const accessToken = req.cookies.get("sp_access")?.value;

	const { q, type } = await req.json();

	const init: RequestInit = {
		method: "GET",
		headers: { Authorization: `Bearer ${accessToken}` },
	};

	const res = await fetch(BASE_URL + `/search?q=${q}&type=${type}`, init);
	const data = await res.json();

	return Response.json(data);
}
