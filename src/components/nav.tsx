import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { AudioWaveform } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export default function Navbar() {
	return (
		<nav className="border border-b-border sticky top-0 left-0 right-0 backdrop-blur-xs z-50">
			<div className="flex justify-between items-center p-4">
				<Link href={BASE_URL}>
					<div className="flex items-center">
						<AudioWaveform />
						<h1 className="text-xl font-black">
							Wave<span className="text-primary">Lens</span>
						</h1>
					</div>
				</Link>
				<ModeToggle />
			</div>
		</nav>
	);
}
