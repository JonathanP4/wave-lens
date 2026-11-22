"use client";

import Navbar from "@/components/nav";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Params = { params: Promise<{ id: string }> };
type IncludeGroups = "album" | "single" | "appears_on";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function ArtistPage({ params }: Params) {
	const { id } = use(params);

	const [artist, setArtist] = useState<any>();
	const [albums, setAlbums] = useState<any>();
	const [singles, setSingles] = useState<any>();
	const [appearences, setAppearences] = useState<any>();

	const setToastError = (title: string, description: string) => {
		toast.add({
			title: `Error ${title}`,
			description: description,
		});
	};

	const getArtist = async () => {
		const res = await fetch(BASE_URL + `/api/artist/${id}`);
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setArtist(data);
	};

	const getAlbums = async (
		include_groups: IncludeGroups,
		limit = 10,
		offset = 0,
	) => {
		const res = await fetch(BASE_URL + `/api/artist/${id}/albums`, {
			method: "POST",
			body: JSON.stringify({
				include_groups,
				limit,
				offset,
			}),
		});
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		switch (include_groups) {
			case "album":
				setAlbums(data);
				break;
			case "single":
				setSingles(data);
				break;
			case "appears_on":
				setAppearences(data);
		}
	};

	useEffect(() => {
		getArtist();
		getAlbums("album");
		getAlbums("single");
		getAlbums("appears_on");
	}, []);

	if (!artist)
		return (
			<div className="flex items-center justify-center min-h-svh">
				<Spinner className="size-12" />
			</div>
		);

	return (
		<>
			<Navbar />
			<main className="flex flex-col justify-center items-center xl:p-12 md:p-8 p-6">
				<div className="w-full space-y-8">
					<section
						id="bio"
						className="flex flex-col 2xl:flex-row items-center justify-evenly gap-8"
					>
						<Card className="max-w-100 w-full p-6">
							<CardTitle>
								<h1 className="text-3xl font-bold mb-4">{artist.name}</h1>
								<div className="relative">
									<img
										className="rounded-sm"
										src={artist.images[0].url}
										width={400}
										height={400}
										alt={artist.name + " photo"}
									/>
									<Link
										className="absolute right-2 bottom-2 bg-black rounded-full p-1 hover:scale-105 duration-150"
										href={artist.uri}
									>
										<img
											width={40}
											height={40}
											src="/Spotify_Primary_Logo_RGB_Green.png"
											alt=""
										/>
									</Link>
								</div>
							</CardTitle>

							<CardContent className="flex flex-wrap gap-4 p-0">
								<Card className="p-4 min-w-24 flex-1">
									<CardTitle className="text-2xl">
										<NumberFlow value={singles?.total || 0} />
									</CardTitle>
									<CardDescription>Singles</CardDescription>
								</Card>

								<Card className="p-4 min-w-24 flex-1">
									<CardTitle className="text-2xl">
										<NumberFlow value={albums?.total || 0} />
									</CardTitle>
									<CardDescription>Albums</CardDescription>
								</Card>

								<Card className="p-4 min-w-24 flex-1">
									<CardTitle className="text-2xl">
										<NumberFlow value={appearences?.total || 0} />
									</CardTitle>
									<CardDescription>Appears on</CardDescription>
								</Card>
							</CardContent>
						</Card>

						<div className="space-y-8 max-w-4xl w-full">
							<div>
								<h2 className="text-2xl mb-4">Albums</h2>
								<Carousel>
									<CarouselContent className="-ml-6">
										{albums
											? albums.items.map((a: any) => (
													<CarouselItem
														key={a.id}
														className="basis-1/1 sm:basis-1/2 xl:basis-1/3 pl-6 h-full"
													>
														<Card className="h-full">
															<Link
																href={BASE_URL + `/dashboard/album/${a.id}`}
															>
																<CardContent className="flex gap-4">
																	<img
																		className="rounded-sm"
																		src={a.images[0].url}
																		width={100}
																		height={100}
																	/>
																	<div>
																		<h3 className="mb-2 font-semibold line-clamp-2">
																			{a.name}
																		</h3>
																		<p className="text-sm text-muted-foreground">
																			Release Date
																		</p>
																		<span className="text-sm text-muted-foreground">
																			{new Date(
																				a.release_date as string,
																			).toLocaleDateString(navigator.language, {
																				dateStyle: "short",
																			})}
																		</span>

																		<div>
																			<NumberFlow value={a.total_tracks} />{" "}
																			tracks
																		</div>
																	</div>
																</CardContent>
															</Link>
														</Card>
													</CarouselItem>
												))
											: Array.from({ length: 10 }).map((i: any) => (
													<CarouselItem className="basis-1/1 sm:basis-1/2 xl:basis-1/3 pl-6">
														<Card key={i}>
															<CardContent className="flex gap-4">
																<Skeleton className="rounded-sm w-24 h-24" />

																<div className="space-y-3">
																	<Skeleton className="w-30 h-4" />
																	<Skeleton className="w-20 h-3" />
																	<Skeleton className="w-28 h-3" />
																	<Skeleton className="w-16 h-3" />
																</div>
															</CardContent>
														</Card>
													</CarouselItem>
												))}
									</CarouselContent>
								</Carousel>
							</div>
							<div>
								<h2 className="text-2xl mb-4">Singles</h2>
								<Carousel>
									<CarouselContent className="-ml-6">
										{singles
											? singles.items.map((s: any) => (
													<CarouselItem className="basis-1/1 sm:basis-1/2 xl:basis-1/3 pl-6">
														<Card>
															<Link
																href={BASE_URL + `/dashboard/album/${s.id}`}
																className="h-full block"
															>
																<CardContent className="flex gap-4">
																	<img
																		className="rounded-sm"
																		src={s.images[0].url}
																		width={100}
																		height={100}
																	/>
																	<div>
																		<h3 className="mb-2 font-semibold line-clamp-2">
																			{s.name}
																		</h3>
																		<p className="text-sm text-muted-foreground">
																			Release Date
																		</p>
																		<span className="text-sm text-muted-foreground">
																			{new Date(
																				s.release_date as string,
																			).toLocaleDateString(navigator.language, {
																				dateStyle: "short",
																			})}
																		</span>
																	</div>
																</CardContent>
															</Link>
														</Card>
													</CarouselItem>
												))
											: Array.from({ length: 10 }).map((i: any) => (
													<CarouselItem className="basis-1/1 sm:basis-1/2 xl:basis-1/3 pl-6">
														<Card key={i}>
															<CardContent className="flex gap-4">
																<Skeleton className="rounded-sm w-24 h-24" />

																<div className="space-y-3">
																	<Skeleton className="w-30 h-4" />
																	<Skeleton className="w-20 h-3" />
																	<Skeleton className="w-28 h-3" />
																	<Skeleton className="w-16 h-3" />
																</div>
															</CardContent>
														</Card>
													</CarouselItem>
												))}
									</CarouselContent>
								</Carousel>
							</div>
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
