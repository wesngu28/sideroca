'use client'
import { useEffect, useState } from 'react'

export default function Query() {
    const [cardLinks, setCardLinks] = useState<string[]>([])
    const [cardNames, setCardNames] = useState<string[]>([])
    const [lastQuery, setLastQuery] = useState("")

    useEffect(() => {
        async function fetcher() {
            const baseString = window.location.href.replace(`${process.env.NEXT_PUBLIC_SITE}/query/lite`, 'https://api.nsupc.dev/cards/v1')
            const getCards = await fetch('/api', {
                body: baseString,
                method: "POST"
            })
            const cardsJson = await getCards.json()
            const nationNames: string[] = Object.values(cardsJson.nations)
            const nationIds = Object.keys(cardsJson.nations)
            const links = nationIds.map(id => `https://www.nationstates.net/page=deck/card=${id}/season=${baseString?.split('?season=')[1][0]}`)
            setCardLinks(links)
            setCardNames(nationNames)
            setLastQuery(baseString.replace('https://api.nsupc.dev/cards/v1?', ''))
        }
        fetcher()
    }, [])
    return (
        <main className="tailwind-preflight flex min-h-screen flex-col items-center p-12">
            <a href="/">
                <button data-umami-event="Make New Query" className="w-max mt-4 h-10 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50 mb-8">
                    New Query
                </button>
            </a>
            <p className='text-lg font-bold mb-2'>{lastQuery}</p>
            <div className='flex flex-col'>
                {cardLinks.map((card, i) => <a key={cardNames[i]} href={card}>{cardNames[i]}</a>)}
            </div>
        </main>
    )
}