// utility function to convert online decklist codes to objects key:card code, value: quantity
export const codeToArray = (deckCode: string) => {
  return deckCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .map(line => {
      const [quantity = '0', cardCode] = line.split('x')
      return {
        quantity: parseInt(quantity, 10),
        cardCode: cardCode?.trim()
      }
    })
}



