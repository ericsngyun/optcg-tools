import React from 'react'
import { api, HydrateClient } from '~/trpc/server'
import Card from '../_components/Card'
import MaxWidthWrapper from '../_components/MaxWidthWrapper'

export default async function cards() {
  const cards = await api.card.getCards()

  return (
    <div className="max-w-screen-2xl mx-auto px-2.5 w-full">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {cards?.map((card) => (
            <Card 
              key={card.id}
              card={card}
            />
          ))}
      </div>
    </div>
  )

}