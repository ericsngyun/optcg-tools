import React from 'react'
import { api, HydrateClient } from '~/trpc/server'
import Card from '../_components/Card'

export default async function cards() {
  const cards = await api.card.getCards()

  return (
    <div className="grid grid-cols-5 gap-2">
      {cards?.map((card) => (
          <Card 
            key={card.id}
            card={card}
          />
        ))}
    </div>
  )

}