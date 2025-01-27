'use client'
import React, { useState } from 'react'
import { parseDeckList } from '~/utility/deckParser'
import { decklists } from '~/test_data/decks'



const FeaturedDecks = () => {
  const [deckLists, setDeckLists] = useState(parseDeckList(decklists))

  console.log(decklists)

  api

  return (
    <div>

    </div>
  )
}

export default FeaturedDecks