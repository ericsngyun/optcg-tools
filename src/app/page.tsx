import Image from "next/image";
import { api, HydrateClient } from "~/trpc/server";
import Card from "~/app/_components/Card"

export default async function Home() {
  const cards = await api.card.getCards();
  
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {cards?.map((card) => (
          <Card key={card.id} card = {card}/>
        ))}
      </main>
    </HydrateClient>
  );
}
