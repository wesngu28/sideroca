'use client'
import { useEffect, useState } from 'react'
import '../styles.css'
import { s1, s2, s3 } from '../(helpers)/ranges'
import { S3Card } from '../(components)/S3Card'
import { S1S2Card } from '../(components)/S1S2Card'
import { Card } from '../(helpers)/models'

export default function Query() {
    const [season, setSeason] = useState<string>("")
    const [cardLinks, setCardLinks] = useState<string[]>([])
    const [correspondingJson, setCorrespondingJson] = useState<Array<Card>>([])
    const [lastQuery, setLastQuery] = useState("")

    useEffect(() => {
        async function fetcher() {
            let baseString = window.location.href.replace('http://localhost:3000/query', 'https://api.nsupc.dev/cards/v1')
            const collectionIdx = baseString.indexOf('&collection')
            let collectionCards: any = {}
            if (collectionIdx !== -1) {
                collectionCards = await fetch('/api/collection', {
                    body: baseString.substring(collectionIdx),
                    method: "POST"
                })
                collectionCards = await collectionCards.json()
                baseString = baseString.substring(0, collectionIdx)
            }
            const getCards = await fetch('/api', {
                body: baseString,
                method: "POST"
            })
            const cardsJson = await getCards.json()
            const nationIds = Object.keys(cardsJson.nations)
            const cardList = await Promise.all(nationIds.map(async (nationId) => {
                const season = baseString?.split('?season=')[1][0];
                setSeason(season);
                const jsonRanges = (season === "1") ? s1 : (season === "2") ? s2 : s3;
                const range = jsonRanges.find(range => {
                    const [start, end] = range.split('-');
                    return Number(nationId) >= Number(start) && Number(nationId) <= Number(end);
                });
                const relevance = await fetch(`https://raw.githubusercontent.com/wesngu28/cardqueries/main/Card%20Lists/${season}_${range}.json`);
                const relevantNations: Card[] = await relevance.json();
                if (Object.keys(collectionCards).length > 0) {
                    if (collectionCards.CARDS.COLLECTION.DECK.CARD) {
                        const inCollection = collectionCards.CARDS.COLLECTION.DECK.CARD.some(
                            (collectionCard: { CARDID: any }) => collectionCard.CARDID === Number(nationId)
                        );
                        return { ...relevantNations.find(nation => Number(nation.ID) === Number(nationId)), inCollection };
                    }
                }
                return relevantNations.find(nation => Number(nation.ID) === Number(nationId))
            }));
            const links = nationIds.map(id => `https://www.nationstates.net/page=deck/card=${id}/season=${baseString?.split('?season=')[1][0]}`)
            setCorrespondingJson(cardList as Card[])
            setCardLinks(links)
            setLastQuery(baseString.replace('https://api.nsupc.dev/cards/v1?', ''))
        }
        fetcher()
    }, [])
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <a href="/">
                <button data-umami-event="Make New Query" className="w-max mt-4 h-10 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50 mb-8">
                    New Query
                </button>
            </a>
            {cardLinks.length > 0 &&
                <>
                    <p className='text-lg font-bold mb-2'>{lastQuery}</p>
                    <div className='flex flex-wrap justify-center content-center'>
                        {correspondingJson
                            .sort((a, b) => {
                                if (a.inCollection && !b.inCollection) return 1;
                                if (!a.inCollection && b.inCollection) return -1;
                                return 0;
                            })
                            .map((card, i) => {
                                return season !== "3" ? (
                                    <S1S2Card card={card} />
                                ) : (
                                    <S3Card card={card} />
                                );
                            })}
                    </div>
                </>
            }
        </main>
    )
}