import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"

export async function POST(request: Request) {
    try {
        const fetchUrl = await request.text()
        const cardsReq = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+${fetchUrl}`)
        const cardsText = await cardsReq.text()
        const parser = new XMLParser()
        const cards = parser.parse(cardsText)
        if (!(cards.CARDS.COLLECTION && cards.CARDS.COLLECTION.DECK.CARD) && !(cards.CARDS.DECK && cards.CARDS.DECK.CARD)) throw Error
        return NextResponse.json(cards)
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 400 })
    }
}