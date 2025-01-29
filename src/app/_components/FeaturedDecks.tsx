'use client'
import React, { useState } from 'react'
import { parseDeckList } from '~/utility/deckParser'
import { decklists } from '~/test_data/decks'
import { api } from '~/trpc/react'
import Image from 'next/image'



const FeaturedDecks = () => {
  const [deckLists, setDeckLists] = useState(parseDeckList(decklists))

  const { data: decks } = api.card.getCardDetails.useQuery(deckLists)
  console.log(decks)
  console.log(deckLists)
  


  return (
    <div>
      {deckLists.map(() => (
        // <Image key={}/>
      ))}
    </div>
  )
}

export default FeaturedDecks