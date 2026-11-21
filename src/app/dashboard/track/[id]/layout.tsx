import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function ArtistLayoutPage({ children }: LayoutProps<"/">) {
	return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}
