"use client";
import Navbar from "@/components/nav";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "@/components/ui/toast";
import NumberFlow from "@number-flow/react";
import { useEffect, useMemo, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function DashboardPage() {
	const [profile, setProfile] = useState<any>();
	const [topArtists, setTopArtists] = useState<any>();
	const [topTracks, setTopTracks] = useState<any>();

	const [following, setFollowing] = useState(0);
	const [savedTracks, setSavedTracks] = useState(0);
	const [savedAlbuns, setSavedAlbuns] = useState(0);
	const [savedAudiobooks, setSavedAudiobooks] = useState(0);
	const [savedEpisodes, setSavedEpisodes] = useState(0);
	const [recentTracks, setRecentTracks] = useState<any>();

	const setToastError = (title: string, description: string) => {
		toast.add({
			title: `Error ${title}`,
			description: description,
		});
	};

	const getProfile = async () => {
		const res = await fetch(BASE_URL + "/api/user/profile");
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setProfile(data);
	};

	const getTopItems = async (type: "artists" | "tracks") => {
		const res = await fetch(BASE_URL + "/api/user/top", {
			method: "POST",
			body: JSON.stringify({
				type,
			}),
		});

		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		if (type === "artists") {
			setTopArtists(data);
		} else {
			setTopTracks(data);
		}
	};

	const getFollowedArtists = async () => {
		const res = await fetch(BASE_URL + "/api/user/following");
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setFollowing(data.artists.total);
	};

	const getSavedTracks = async () => {
		const res = await fetch(BASE_URL + "/api/user/tracks");
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setSavedTracks(data.total);
	};

	const getSavedAlbuns = async () => {
		const res = await fetch(BASE_URL + "/api/user/albums");
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setSavedAlbuns(data.total);
	};

	const getSavedAudiobooks = async () => {
		const res = await fetch(BASE_URL + "/api/user/audiobooks");
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setSavedAudiobooks(data.total);
	};

	const getSavedEpisodes = async () => {
		const res = await fetch(BASE_URL + "/api/user/episodes");
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		setSavedEpisodes(data.total);
	};

	const getRecentlyPlayed = async () => {
		const res = await fetch(BASE_URL + "/api/user/played-tracks", {
			method: "POST",
			body: JSON.stringify({ limit: 50 }),
		});
		const data = await res.json();

		if (data.error) return setToastError(data.error.status, data.error.message);

		console.log(data);

		setRecentTracks(data);
	};

	const totalListenedRecently = useMemo(() => {
		if (!recentTracks) return 0;
		const totalMs = recentTracks.items.reduce(
			(acc: any, i: any) => acc + i.track.duration_ms,
			0,
		);
		return +(totalMs / 3_600_000).toFixed(2);
	}, [recentTracks]);

	useEffect(() => {
		getProfile();
		getTopItems("artists");
		getTopItems("tracks");
	}, []);

	useEffect(() => {
		getFollowedArtists();
		getSavedTracks();
		getSavedAlbuns();
		getSavedAudiobooks();
		getSavedEpisodes();
		getRecentlyPlayed();
	}, []);

	return (
		<>
			<Navbar />
			<main className="flex flex-col justify-center items-center xl:p-12 md:p-8 p-4">
				<div className="max-w-fit space-y-8">
					<section id="profile">
						<div className="flex gap-4">
							<img
								className="rounded-full"
								src={
									profile?.images
										? profile.images[0].url
										: "avatar_placeholder.png"
								}
								height={64}
								width={64}
								alt={"Profile picture"}
							/>
							<div>
								<h2 className="font-semibold">{profile?.display_name}</h2>
								<p className="text-xs text-muted-foreground">
									{profile?.email}
								</p>
							</div>
						</div>
					</section>
					<section id="top_artists">
						<h2 className="text-lg font-semibold my-4">Top Artists</h2>
						<Carousel
							opts={{ align: "start" }}
							className="w-full max-w-xs sm:max-w-xl md:max-w-xl lg:max-w-4xl xl:max-w-[1900px]"
						>
							<CarouselContent>
								{topArtists &&
									topArtists.items.map((i: any) => (
										<CarouselItem className="pl-6 basis-1/2 sm:basis-1/4 lg:basis-1/6 xl:basis-1/8 2xl:basis-1/10">
											<div key={i.id}>
												<img
													src={i.images[0].url}
													height={120}
													width={120}
													alt={i.name + " photo"}
													className="rounded-md mb-3 w-30 h-30"
												/>
												<h3 className="font-semibold text-sm line-clamp-2">
													{i.name}
												</h3>
											</div>
										</CarouselItem>
									))}
							</CarouselContent>
						</Carousel>
					</section>
					<div className="h-px w-full bg-muted"></div>
					<section id="top_tracks">
						<h2 className="text-lg font-semibold my-4">Top Tracks</h2>

						<Carousel
							opts={{ align: "start" }}
							className="w-full max-w-xs sm:max-w-xl md:max-w-xl lg:max-w-4xl xl:max-w-svw"
						>
							<CarouselContent>
								{topTracks &&
									topTracks.items.map((i: any) => (
										<CarouselItem className="pl-6 basis-1/2 sm:basis-1/4 lg:basis-1/6 xl:basis-1/8 2xl:basis-1/10">
											<div key={i.id}>
												<img
													src={i.album.images[0].url}
													height={120}
													width={120}
													alt={i.name + " photo"}
													className="rounded-md mb-3 w-30 h-30"
												/>
												<h3 className="font-semibold text-sm line-clamp-2">
													{i.name}
												</h3>
											</div>
										</CarouselItem>
									))}
							</CarouselContent>
						</Carousel>
					</section>

					<section id="about_you">
						<h2 className="text-lg font-semibold my-4">About You</h2>

						<div className="flex flex-wrap gap-6">
							<Card className="w-37">
								<CardTitle className="text-3xl font-bold px-4">
									<NumberFlow value={following} />
								</CardTitle>
								<CardContent>Followed Artists</CardContent>
							</Card>

							<Card className="w-37">
								<CardTitle className="text-3xl font-bold px-4">
									<NumberFlow value={savedTracks} />
								</CardTitle>
								<CardContent>Saved Tracks</CardContent>
							</Card>

							<Card className="w-37">
								<CardTitle className="text-3xl font-bold px-4">
									<NumberFlow value={savedAlbuns} />
								</CardTitle>
								<CardContent>Saved Albums</CardContent>
							</Card>

							<Card className="w-37">
								<CardTitle className="text-3xl font-bold px-4">
									<NumberFlow value={savedAudiobooks} />
								</CardTitle>
								<CardContent>Saved Audiobooks</CardContent>
							</Card>

							<Card className="w-37">
								<CardTitle className="text-3xl font-bold px-4">
									<NumberFlow value={savedEpisodes} />
								</CardTitle>
								<CardContent>Saved Episodes</CardContent>
							</Card>
						</div>

						<div>
							<Card className="w-37">
								<CardTitle className="text-3xl font-bold px-4">
									<NumberFlow value={totalListenedRecently} />h
								</CardTitle>
								<CardContent>
									<HoverCard>
										<HoverCardTrigger>Listened recently</HoverCardTrigger>
										<HoverCardContent>
											Sums up the duration of the last 50 tracks you played
										</HoverCardContent>
									</HoverCard>
								</CardContent>
							</Card>
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
