import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";

export const instant = false;

export default async function Home() {
	const cookieStore = await cookies();

	const access = cookieStore.get("sp_access");

	return (
		<main>
			<div className="absolute right-4 top-4">
				<ModeToggle />
			</div>
			<section className="flex flex-col items-center justify-center min-h-svh">
				<div>
					<h1 className="text-6xl font-black">
						Wave<span className="text-primary">Lens</span>
					</h1>
					<p className="text-sm">Dashboard for Spotify</p>
					<Link href={`${access ? "/dashboard" : "/auth"}`}>
						<Button className={"w-full mt-6 font-semibold"}>
							{access ? "Go to dashboard" : "Try it out!"}
						</Button>
					</Link>
				</div>
			</section>
			<section className="p-12 border border-border">
				<h2 className="text-2xl font-bold">Features</h2>
				<p>Here's what you can do:</p>
				<ul className="w-fit mt-4 space-y-3 cursor-default">
					<li className="border border-border py-2 px-4 rounded-md transition-all hover:translate-x-2 hover:bg-primary/5">
						Get albuns, artists, shows & audiobooks
					</li>
					<li className="border border-border py-2 px-4 rounded-md transition-all hover:translate-x-2 hover:bg-primary/5">
						Search for tracks
					</li>
					<li className="border border-border py-2 px-4 rounded-md transition-all hover:translate-x-2 hover:bg-primary/5">
						View profile info
					</li>
					<li className="border border-border py-2 px-4 rounded-md transition-all hover:translate-x-2 hover:bg-primary/5">
						Get info on playback state across devices
					</li>
					<li className="border border-border py-2 px-4 rounded-md transition-all hover:translate-x-2 hover:bg-primary/5">
						Manage your libary
					</li>
				</ul>
			</section>
		</main>
	);
}
