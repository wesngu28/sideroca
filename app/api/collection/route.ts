import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"

export async function POST(request: Request) {
    const fetchUrl = await request.text()
    const collection = fetchUrl.split('=')[1]
    const cardsReq = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+collection;collectionid=${collection}`)
    const cardsText = await cardsReq.text()
    const parser = new XMLParser()
    const cards = parser.parse(cardsText)
    return NextResponse.json(cards)
}