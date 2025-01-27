// utility function to parse longform deck strings into a list of formatted objects



export interface ParsedDeckEntry{
  card_id: string;
  quantity: number;
}

export function parseDeckList(deckList: string): ParsedDeckEntry[] {
  return deckList
    .split('\n')
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
    .filter((entry) => entry.card_id && entry.quantity > 0);
}