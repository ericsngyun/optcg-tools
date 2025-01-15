

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


const deckCode = `
1xOP01-060
2xST03-005
2xST03-004
1xOP01-070
4xOP01-077
1xOP03-044
1xOP06-047
4xEB01-023
4xOP07-040
4xOP07-045
4xOP07-046
4xOP08-047
4xST17-002
4xST17-003
4xST17-004
4xST17-005
2xOP04-056
1xOP07-057
`;


console.log(codeToArray(deckCode))