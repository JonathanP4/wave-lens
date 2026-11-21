"use client";

import Navbar from "@/components/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Params = { params: Promise<{ query: string }> };

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Search() {
	const searchParams = useSearchParams();

	const q = searchParams.get("q")!;
	const type = searchParams.get("type")!;

	const [results, setResults] = useState<any>();

	const setToastError = (title: string, description: string) => {
		toast.add({
			title: `Error ${title}`,
			description: description,
		});
	};

	const getSearchResults = async () => {
		const res = await fetch(BASE_URL + "/api/search/", {
			method: "POST",
			body: JSON.stringify({
				q: encodeURIComponent(q),
				type: encodeURIComponent(type),
			}),
		});
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setResults(data);
	};

	useEffect(() => {
		getSearchResults();
	}, [searchParams]);

	if (!results)
		return (
			<div className="flex items-center justify-center min-h-svh">
				<Spinner className="size-12" />
			</div>
		);

	return (
		<>
			<Navbar />
			<main className="flex flex-col justify-center items-center xl:p-12 md:p-8 p-6">
				<section id="artists">
					<h3 className="text-2xl font-semibold mb-4">Artists</h3>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{results.artists.items.map((a: any) => (
							<Card className="h-full relative">
								<Link href={`/dashboard/album/${a.id}`}>
									<CardContent>
										<div className="flex gap-4">
											{/* {a?.images.length > 0 ?<img
												className="rounded-sm"
												src={a.images[0]?.url || ""}
												width={100}
												height={100}
											/>:<Disk} */}

											<div>
												<h3
													title={a.name}
													className="mb-2 text-lg font-semibold line-clamp-2"
												>
													{a.name}
												</h3>
											</div>
										</div>
									</CardContent>
								</Link>
							</Card>
						))}
					</div>
				</section>

				<section id="albums">
					<h3 className="text-2xl font-semibold mb-4">Albums</h3>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{results.albums.items.map((a: any) => (
							<Card className="h-full relative">
								<Link href={`/dashboard/album/${a.id}`}>
									<CardContent>
										<div className="flex gap-4">
											<img
												className="rounded-sm"
												src={a.images[0].url}
												width={100}
												height={100}
											/>
											<div>
												<h3
													title={a.name}
													className="mb-2 text-lg font-semibold line-clamp-2"
												>
													{a.name}
												</h3>

												<div>
													<NumberFlow value={a.total_tracks} /> tracks
												</div>

												<span className="text-xs text-muted-foreground text-right">
													{new Date(
														a.release_date as string,
													).toLocaleDateString(navigator.language, {
														month: "short",
														day: "2-digit",
														year: "numeric",
													})}
												</span>
											</div>
										</div>
									</CardContent>
								</Link>
							</Card>
						))}
					</div>
				</section>
			</main>
		</>
	);
}
