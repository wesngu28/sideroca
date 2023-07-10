'use client'
import { useEffect, useState } from 'react'
import '../styles.css'
import { s1, s2, s3 } from '../(helpers)/ranges'
import { S3Card } from '../(components)/S3Card'
import { S1S2Card } from '../(components)/S1S2Card'
import { Card } from '../(helpers)/models'
import { useSearchParams } from "next/navigation"
import { XMLParser } from 'fast-xml-parser'

function downloadCSV(data: Card[], filename: string) {
    const csvData = convertJSONToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertJSONToCSV(jsonData: Card[]) {
    const headers = Object.keys(jsonData[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    jsonData.forEach((row) => {
        const values = headers.map((header) => {
            const escapedValue = String(row[header as keyof Card]).replace(/"/g, '""');
            return `"${escapedValue}"`;
        });
        csvRows.push(values.join(','));
    });
    return csvRows.join('\n');
}


export function Query() {
    const [season, setSeason] = useState<string>("")
    const [correspondingJson, setCorrespondingJson] = useState<Array<Card>>([])
    const [errorMessage, setErrorMessage] = useState<string>("");
    const searchParams = useSearchParams()
    const lastQuery = searchParams.toString()

    const handleDownload = () => {
        if (correspondingJson.length > 0) {
            const filename = `${lastQuery}.csv`;
            downloadCSV(correspondingJson, filename);
        }
    };

    useEffect(() => {
        async function fetcher() {
            try {
                let baseString = window.location.href.replace(`${process.env.NEXT_PUBLIC_SITE}/query`, 'https://api.nsupc.dev/cards/v1')
                const collection = searchParams.get('collection')
                const deck = searchParams.get('deck')
                let reqText = ""
                if (collection) reqText = `collection;collectionid=${collection}`
                if (deck) reqText = `deck;nationname=${deck}`
                let collectionCards: any = {}
                if (collection || deck) {
                    const cardsReq = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+${reqText}`, {
                    headers: {
                        'User-Agent': "Kractero card queries"
                    }
                })
                const cardsText = await cardsReq.text()
                const parser = new XMLParser()
                collectionCards = parser.parse(cardsText)
                if (!(collectionCards.CARDS.COLLECTION && collectionCards.CARDS.COLLECTION.DECK.CARD) 
                    && !(collectionCards.CARDS.DECK && collectionCards.CARDS.DECK.CARD)) {
                        throw new Error("Something is wrong with the collection or deck you gave")
                    }
                }
                if (!collectionCards.error) {
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
                            if (collectionCards.CARDS.COLLECTION && collectionCards.CARDS.COLLECTION.DECK.CARD) {
                                const inCollection = collectionCards.CARDS.COLLECTION.DECK.CARD.some(
                                    (collectionCard: { CARDID: any }) => collectionCard.CARDID === Number(nationId)
                                );
                                return { ...relevantNations.find(nation => Number(nation.ID) === Number(nationId)), inCollection };
                            }
                            if (collectionCards.CARDS.DECK && collectionCards.CARDS.DECK.CARD) {
                                const inCollection = collectionCards.CARDS.DECK.CARD.some(
                                    (collectionCard: { CARDID: any }) => collectionCard.CARDID === Number(nationId)
                                );
                                return { ...relevantNations.find(nation => Number(nation.ID) === Number(nationId)), inCollection };
                            }
                        }
                        return relevantNations.find(nation => Number(nation.ID) === Number(nationId))
                    }));
                    setCorrespondingJson(cardList as Card[])
                }
            } catch (error: any) {
                setErrorMessage("Error: " + error.message);
            }
        }
        fetcher()
    }, [searchParams])
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <a href="/">
                <button data-umami-event="Make New Query" className="w-max mt-4 h-10 text-sm transition duration-500 border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50 mb-8">
                    New Query
                </button>
            </a>
            {correspondingJson.length > 0 ?
                <>
                    <button
                        onClick={handleDownload}
                        className="w-max mt-4 h-10 text-sm transition duration-500 border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50 mb-8"
                    >
                        Download Card List (CSV)
                    </button>
                    <p className='dark:text-white text-lg font-bold mb-2'>{lastQuery}</p>
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
                : <p className='dark:text-white text-lg font-bold mb-2'>Generating cards for {lastQuery}, please wait...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </main>
    )
}