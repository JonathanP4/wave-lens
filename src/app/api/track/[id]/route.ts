import { NextRequest } from "next/server";

const BASE_URL = process.env.SPOTIFY_BASE_URL!;

export async function GET(
	req: NextRequest,
	{ params }: RouteContext<"/api/track/[id]">,
) {
	const { id } = await params;

	const accessToken = req.cookies.get("sp_access")?.value;

	const res = await fetch(BASE_URL + `/tracks/${id}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	const data = await res.json();

	return Response.json(data);
}
