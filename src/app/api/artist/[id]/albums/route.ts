import { NextRequest } from "next/server";

const BASE_URL = process.env.SPOTIFY_BASE_URL!;

export async function POST(
	req: NextRequest,
	{ params }: RouteContext<"/api/artist/[id]/albums">,
) {
	const { id } = await params;

	const accessToken = req.cookies.get("sp_access")?.value;
	const { include_groups, limit = 10, offset = 0 } = await req.json();

	const res = await fetch(
		BASE_URL +
			`/artists/${id}/albums?include_groups=${include_groups}&limit=${limit}&offset=${offset}`,
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);
	const data = await res.json();

	return Response.json(data);
}
