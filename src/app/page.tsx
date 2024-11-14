import Image from "next/image";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const cards = await api.card.getCards();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {cards?.map((card) => (
          <div key={card.id}>
            <div key={card.id}>{card.name}</div>
            {card.Image?.image_url && (
              <Image
                src={card.Image?.image_url as string}
                alt="card image"
                height={100}
                width={100}
              />
            )}
          </div>
        ))}
      </main>
    </HydrateClient>
  );
}
