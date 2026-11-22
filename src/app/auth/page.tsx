import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export const instant = false;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

type SearchParams = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AuthPage({ searchParams }: SearchParams) {
	const error = (await searchParams).error;

	return (
		<main>
			<div className="absolute left-0 right-0">
				<div className="p-4 flex items-center justify-between">
					<Link href={BASE_URL}>
						<h1 className="text-xl font-black">
							Wave<span className="text-primary">Lens</span>
						</h1>
					</Link>
					<ModeToggle />
				</div>
			</div>
			<section className="flex flex-col items-center justify-center min-h-svh">
				<div className="border border-primary/15 p-6 rounded-[0.875rem]">
					<h2 className="text-2xl font-bold">Link spotify</h2>
					<p className="text-sm mt-2">
						Press the button bellow to connect your Spotify account
					</p>
					<Link href={"/api/auth/login"}>
						<Button className={"w-full mt-6 font-semibold"}>
							Connect to Spotify
						</Button>
					</Link>
				</div>
				{error && (
					<p className="text-destructive text-sm mt-2">
						Something went wrong, try again
					</p>
				)}
			</section>
		</main>
	);
}
