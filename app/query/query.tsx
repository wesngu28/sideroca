'use client'
import { useEffect, useState } from 'react'
import '../styles.css'
import { S3Card } from '../(components)/S3Card'
import { S1S2Card } from '../(components)/S1S2Card'
import { Card } from '../(helpers)/models'
import { useSearchParams } from "next/navigation"
import { XMLParser } from 'fast-xml-parser'
import ReactPaginate from 'react-paginate';

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
                let baseString = window.location.href.replace(`${process.env.NEXT_PUBLIC_SITE}/query`, 'https://nsfastapitest-production.up.railway.app/')
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
                    const cardList = await getCards.json()
                    console.log(cardList)
                    setCorrespondingJson(cardList.cards as Card[])
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
                    <div className='flex flex-col flex-wrap items-center gap-4 dark:text-white'>
                        <ReactPaginate
                            className='flex border border-solid border-gray-400 py-1 mt-4
                                [&>li>a]:p-3 [&>li>a]:border-blue-800 [&>li>a]:bg-blue-400 [&>li>a]:border-solid [&>li>a]:border [&>li>a]:cursor-pointer'
                            breakLabel="..."
                            nextLabel="next"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="previous"
                            renderOnZeroPageCount={null}
                        />
                        <div>
                            {!correspondingJson[0].motto ?
                                <div className='flex flex-col dark:text-white'>
                                    {currentItems.map((card, i) => <p key={i}>{card.name}</p>)}
                                </div>
                                :
                                currentItems
                                    .sort((a, b) => {
                                        if (a.inCollection && !b.inCollection) return 1;
                                        if (!a.inCollection && b.inCollection) return -1;
                                        return 0;
                                    })
                                    .map(card =>
                                        card.season !== 3 ? (
                                            <S1S2Card card={card} />
                                        ) : (
                                            <S3Card card={card} />
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