import { HydrateClient } from "~/trpc/server";
import { Badge, badgeVariants } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        
      </main>
    </HydrateClient>
  );
}
