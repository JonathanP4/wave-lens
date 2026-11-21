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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ArtistPage({ params }: Params) {
	const { id } = use(params);

	const [track, setTrack] = useState<any>();

	const formatMsToMinutes = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);

		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const setToastError = (title: string, description: string) => {
		toast.add({
			title: `Error ${title}`,
			description: description,
		});
	};

	const getTrack = async () => {
		const res = await fetch(BASE_URL + `/api/track/${id}`);
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setTrack(data);
	};

	useEffect(() => {
		getTrack();
	}, []);

	if (!track)
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
								<h1 className="text-3xl font-bold">{track.name}</h1>
								<p className="text-muted-foreground text-sm mt-1 mb-4">
									{track.album.name}
								</p>
								<div className="relative">
									<img
										className="rounded-sm"
										src={track.album.images[0].url}
										width={400}
										height={400}
										alt={track.name + " photo"}
									/>
									<Link
										className="absolute right-2 bottom-2 bg-black rounded-full p-1 hover:scale-105 duration-150"
										href={track.uri}
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
										{formatMsToMinutes(track?.duration_ms)}
									</CardTitle>
									<CardDescription>Duration</CardDescription>
								</Card>

								<Card className="p-4 min-w-24 flex-1">
									<CardTitle className="text-2xl">
										<NumberFlow value={track.artists.length || 0} />
									</CardTitle>
									<CardDescription>Artists</CardDescription>
								</Card>
							</CardContent>
						</Card>

						<div className="space-y-8 max-w-4xl w-full">
							<div>
								<h2 className="text-2xl mb-4">Artists</h2>
								<Carousel>
									<CarouselContent className="-ml-6">
										{track
											? track.artists.map((a: any) => (
													<CarouselItem
														key={a.id}
														className="basis-1/2 xl:basis-1/3 pl-6"
													>
														<Card>
															<Link
																href={`/dashboard/artist/${a.id}`}
																className="h-full block"
															>
																<CardContent className="flex gap-4">
																	<h3
																		title={a.name}
																		className="mb-2 font-semibold line-clamp-2"
																	>
																		{a.name}
																	</h3>
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
								<h2 className="text-2xl mb-4">Album</h2>
								<Card className="w-fit">
									<Link href={`/dashboard/album/${track.album.id}`}>
										<CardContent>
											<img
												className="rounded-sm"
												src={track.album.images[0].url}
												width={150}
												height={150}
												alt={track.album.name + " photo"}
											/>
											<h3 className="my-2 font-semibold line-clamp-2 max-w-37">
												{track.album.name}
											</h3>

											<p className="mb-1 text-sm">
												{track.album.total_tracks} tracks
											</p>

											<div className="flex justify-end">
												<span className="text-muted-foreground text-xs">
													{new Date(
														track.album.release_date,
													).toLocaleDateString()}
												</span>
											</div>
										</CardContent>
									</Link>
								</Card>
							</div>
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
