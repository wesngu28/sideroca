import { XMLParser } from "fast-xml-parser"
import { readFileSync } from "fs"

const tradingCards = readFileSync("card names.txt", 'utf-8').split('\n').map(cardName => cardName.replaceAll(' ', '_').toLowerCase())
console.log(tradingCards)

const dog = await fetch('https://www.nationstates.net/cgi-bin/api.cgi?q=nations')
const raw = await dog.text()
const parser = new XMLParser()
const xml = parser.parse(raw)
const realNations = xml.WORLD.NATIONS.split(',')
console.log(realNations)

const missingCards = tradingCards.filter(card => !realNations.includes(card));

console.log('Missing trading cards:', missingCards);