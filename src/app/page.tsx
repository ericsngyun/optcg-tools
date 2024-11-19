import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-slate-900 bg-slate-100">
        homepage
      </main>
    </HydrateClient>
  );
}
