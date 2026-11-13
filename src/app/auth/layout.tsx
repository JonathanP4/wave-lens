import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function AuthLayout({ children }: LayoutProps<"/">) {
	return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}
