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

	const [album, setAlbum] = useState<any>();

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

	const getAlbum = async () => {
		const res = await fetch(BASE_URL + `/api/album/${id}`);
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setAlbum(data);
	};

	useEffect(() => {
		getAlbum();
	}, []);

	if (!album)
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
								<h1 className="text-3xl font-bold mb-4">{album.name}</h1>
								<div className="relative">
									<img
										className="rounded-sm"
										src={album.images[0].url}
										width={400}
										height={400}
										alt={album.name + " photo"}
									/>
									<Link
										className="absolute right-2 bottom-2 bg-black rounded-full p-1 hover:scale-105 duration-150"
										href={album.uri}
									>
										<img
											width={40}
											height={40}
											src="/Spotify_Primary_Logo_RGB_Green.png"
											alt=""
										/>
									</Link>
								</div>
								<span className="text-muted-foreground text-sm">
									{new Date(album.release_date).toLocaleDateString()}
								</span>
							</CardTitle>

							<CardContent className="flex flex-wrap gap-4 p-0">
								<Card className="p-4 min-w-24 flex-1">
									<CardTitle className="text-2xl">
										<NumberFlow value={album?.total_tracks || 0} />
									</CardTitle>
									<CardDescription>Tracks</CardDescription>
								</Card>

								<Card className="p-4 min-w-24 flex-1">
									<CardTitle className="text-2xl">
										<NumberFlow value={album.artists.length || 0} />
									</CardTitle>
									<CardDescription>Artists</CardDescription>
								</Card>

								{/*<Card className="p-4 min-w-24 flex-1">
									<CardTitle className="text-2xl">
										<NumberFlow value={appearences?.total || 0} />
									</CardTitle>
									<CardDescription>Appears on</CardDescription>
								</Card> */}
							</CardContent>
						</Card>

						<div className="space-y-8 max-w-4xl w-full">
							<div>
								<h2 className="text-2xl mb-4">Artists</h2>
								<Carousel>
									<CarouselContent className="-ml-6">
										{album
											? album.artists.map((a: any) => (
													<CarouselItem
														key={a.id}
														className="basis-1/2 xl:basis-1/3 pl-6"
													>
														<Card>
															<Link href={a.uri} className="h-full block">
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
								<h2 className="text-2xl mb-4">Tracks</h2>
								<Carousel>
									<CarouselContent className="-ml-6">
										{album
											? album.tracks.items.map((t: any) => (
													<CarouselItem className="basis-1/1 sm:basis-1/2 xl:basis-1/3 pl-6">
														<Card className="h-full">
															<Link href={t.uri} className="h-full">
																<CardContent className="flex gap-4 h-full">
																	<div className="flex w-full flex-col">
																		<h3 className="mb-2 font-semibold line-clamp-2">
																			{t.name}
																		</h3>

																		<div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
																			<div>
																				<p className="text-sm text-muted-foreground">
																					Explicit: {t.explicit ? "Yes" : "No"}
																				</p>
																			</div>

																			<p className="text-sm text-muted-foreground">
																				Duration:{" "}
																				{formatMsToMinutes(t.duration_ms)}
																			</p>
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
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
