import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const fetchUrl = await request.text()
    console.log(fetchUrl)
    const cards = await fetch(fetchUrl)
    console.log(cards)
    const cardsJson = await cards.json()
    return NextResponse.json(cardsJson)
}