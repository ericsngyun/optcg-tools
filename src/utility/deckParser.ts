// utility function to parse longform deck strings into a list of formatted objects
import { decklists } from "~/test_data/decks";

export interface ParsedDeckEntry{
  card_id: string;
  quantity: number;
}

export function parseDeckList(deckLists: string[]): ParsedDeckEntry[] {
  return deckLists.flatMap(deckList => 
    deckList
      .split('\n') // Split each deck string into lines
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) => {
        const [quantityStr, cardId] = line.split('x');
        const quantity = parseInt(quantityStr?.trim() ?? '0', 10);
        return {
          card_id: cardId?.trim() ?? '',
          quantity: isNaN(quantity) ? 0 : quantity,
        };
      })
      .filter((entry) => entry.card_id && entry.quantity > 0)
  );
}

// Example usage
// console.log(parseDeckList(decklists)); // Now decklists can be passed directly as an array