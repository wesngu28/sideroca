import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const fetchUrl = await request.text()
    const cards = await fetch(fetchUrl)
    const cardsJson = await cards.json()
    return NextResponse.json(cardsJson)
}