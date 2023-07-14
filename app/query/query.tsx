'use client'
import { useEffect, useState } from 'react'
import '../styles.css'
import { S3Card } from '../(components)/S3Card'
import { S1S2Card } from '../(components)/S1S2Card'
import { Card } from '../(helpers)/models'
import { useSearchParams } from "next/navigation"
import { XMLParser } from 'fast-xml-parser'
import ReactPaginate from 'react-paginate';
import { Button } from '@/components/ui/button'

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
    const [correspondingJson, setCorrespondingJson] = useState<Array<Card>>([])
    const [errorMessage, setErrorMessage] = useState<string>("");
    const searchParams = useSearchParams()
    const lastQuery = searchParams.toString()
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + 50;
    const currentItems = correspondingJson.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(correspondingJson.length / 50);
    const handlePageClick = (event: { selected: number }) => {
        const newOffset = (event.selected * 50) % correspondingJson.length;
        setItemOffset(newOffset);
    };
    const handleDownload = () => {
        if (correspondingJson.length > 0) {
            const filename = `${lastQuery}.csv`;
            downloadCSV(correspondingJson, filename);
        }
    };

    useEffect(() => {
        async function fetcher() {
            try {
                let baseString = window.location.href.replace(`${process.env.NEXT_PUBLIC_SITE}/query`, 'http://127.0.0.1:8000/')
                let collectionCards: any[] = []
                let deckCards: any[] = []
                let collectionParam: string | string[] | null = searchParams.get('collection')
                let deckParam = searchParams.get('deck')
                if (collectionParam) {
                    collectionParam = collectionParam.split(',')
                    for (let collection of collectionParam) {
                        const cardsReq = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+${`collection;collectionid=${collection}`}`, {
                            headers: {
                                'User-Agent': "Kractero card queries"
                            }
                        })
                        const cardsText = await cardsReq.text()
                        const parser = new XMLParser()
                        let cards = parser.parse(cardsText)
                        if (!(cards.CARDS.COLLECTION && cards.CARDS.COLLECTION.DECK.CARD)
                            && !(cards.CARDS.DECK && cards.CARDS.DECK.CARD)) {
                            throw new Error("Something is wrong with the collection or deck you gave")
                        }
                        cards.CARDS.COLLECTION.DECK.CARD.forEach((card: { CARDID: any }) => {
                            for (let obj of collectionCards) {
                                if (obj.CARDID === card.CARDID) return
                            }
                            collectionCards.push(card)
                        })
                    }
                }
                if (deckParam) {
                    const cardsReq = await fetch(`https://www.nationstates.net/cgi-bin/api.cgi?q=cards+${`deck;nationname=${deckParam}`}`, {
                        headers: {
                            'User-Agent': "Kractero card queries"
                        }
                    })
                    const cardsText = await cardsReq.text()
                    const parser = new XMLParser()
                    let cards = parser.parse(cardsText)
                    if (!(cards.CARDS.DECK && cards.CARDS.DECK.CARD)) {
                        throw new Error("Something is wrong with the collection or deck you gave")
                    }
                    deckCards = cards.CARDS.DECK.CARD
                }
                const getCards = await fetch('/api', {
                    body: baseString,
                    method: "POST"
                })
                let cardsJson = await getCards.json()
                let cardList: Card[] = await Promise.all((cardsJson.cards as Card[]).map(async (nation) => {
                    let inCollection = undefined;
                    if (collectionCards.length > 0) {
                        inCollection = collectionCards.some(
                            (collectionCard: { CARDID: any }) => collectionCard.CARDID === Number(nation.id)
                        );
                    }
                    if (deckCards.length > 0) {
                        inCollection = deckCards.some(
                            (collectionCard: { CARDID: any }) => collectionCard.CARDID === Number(nation.id)
                        );
                    }
                    return { ...nation, inCollection };
                }));
                cardList = cardList.sort((a, b) => {
                    if (a.inCollection && !b.inCollection) return 1;
                    if (!a.inCollection && b.inCollection) return -1;
                    if (a.inCollection && b.inCollection) {
                        if (a.id === b.id) return 0;
                        return a.id > b.id ? 1 : -1;
                    }
                    return a.id > b.id ? 1 : -1;
                })
                setCorrespondingJson(cardList as Card[])
            } catch (error: any) {
                setErrorMessage("Error: " + error.message);
            }
        }
        fetcher()
    }, [searchParams])
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <a href="/">
                <Button variant={"outline"}
                    data-umami-event="Make New Query" className="text-white transition duration-500 bg-blue-700 hover:bg-blue-600 mb-8">
                    New Query
                </Button>
            </a>
            {correspondingJson.length > 0 ?
                <>
                    <Button variant={'outline'}
                        onClick={handleDownload}
                        className="text-white transition duration-500 bg-blue-700 hover:bg-blue-600 mb-8"
                    >
                        Download Card List (CSV)
                    </Button>
                    <p className='dark:text-white text-lg font-bold mb-2'>{lastQuery}</p>
                    <div className='flex flex-col flex-wrap items-center gap-4 dark:text-white'>
                        <ReactPaginate
                            className='flex py-1 mt-4 mb-8 text-white
                                [&>li>a]:p-3 [&>li>a]:border-gray-800 [&>li>a]:bg-blue-700 [&>li>a]:border-solid [&>li>a]:border [&>li>a]:cursor-pointer'
                            breakLabel="..."
                            nextLabel="Next"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="Previous"
                            renderOnZeroPageCount={null}
                        />
                        <div>
                            {!correspondingJson[0].motto ?
                                <div className='flex flex-col dark:text-white'>
                                    {currentItems.map((card, i) => <p key={i}>{card.name}</p>)}
                                </div>
                                :
                                currentItems.map(card =>
                                    card.season !== 3 ? (
                                        <S1S2Card key={card.id} card={card} />
                                    ) : (
                                        <S3Card key={card.id} card={card} />
                                    )
                                )
                            }
                        </div>
                    </div>
                </>
                : <p className='dark:text-white text-lg font-bold mb-2'>Generating cards for {lastQuery}, please wait...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </main>
    )
}