import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const stuffs = await request.json()
    const cards = await fetch(stuffs.url, {
        body: JSON.stringify(stuffs.cards),
        method: "POST"
    })
    const cardsJson = await cards.json()
    return NextResponse.json(cardsJson)
}