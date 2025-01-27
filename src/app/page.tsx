import { HydrateClient } from "~/trpc/server";
import { Badge, badgeVariants } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import MaxWidthWrapper from "./_components/MaxWidthWrapper";

export default async function Home() {
  return (
    <HydrateClient>
      <MaxWidthWrapper className="py-8">
        <div className="flex justify-center">
          <h1>HELLO</h1>
        </div>
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
