import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const fetchUrl = await request.text()
    const cards = await fetch(`${process.env.NEXT_PUBLIC_API}/cards${fetchUrl}`)
    const cardsJson = await cards.json()
    return NextResponse.json(cardsJson)
}