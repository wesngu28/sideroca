'use client'
import { useEffect, useState } from 'react'
import '../styles.css'
import { S3Card } from '../(components)/S3Card'
import { S1S2Card } from '../(components)/S1S2Card'
import { Card } from '../(helpers)/models'
import { useSearchParams } from "next/navigation"
import { XMLParser } from 'fast-xml-parser'
import { Button } from '@/components/ui/button'
import { Download, Home, SortDesc } from 'lucide-react'
import { Pagination, createEmotionCache } from '@mantine/core';
import { MantineProvider } from '@mantine/core'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { rarityOrder } from '../(helpers)/categories'

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

const appendCache = createEmotionCache({ key: 'mantine', prepend: false });

export function Query() {
    const [queryTracker, setQueryTracker] = useState(0);
    const [correspondingJson, setCorrespondingJson] = useState<Array<Card>>([])
    const [errorMessage, setErrorMessage] = useState<string>("");
    const searchParams = useSearchParams()
    const lastQuery = searchParams.toString()
    const [itemOffset, setItemOffset] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [sortValue, setSortValue] = useState("")
    const [sortOrder, setSortOrder] = useState("Asc")
    const itemsPerPage = 50;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = correspondingJson.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(correspondingJson.length / itemsPerPage);

    const handlePageChange = (selectedPage: number) => {
        const newOffset = (selectedPage - 1) * itemsPerPage;
        setItemOffset(newOffset);
        setActivePage(selectedPage);
    };

    const handleDownload = () => {
        if (correspondingJson.length > 0) {
            const filename = `${lastQuery}.csv`;
            downloadCSV(correspondingJson, filename);
        }
    };

    function sorter(a: Card, b: Card): number {
        if (sortOrder === "Asc") {
            if (sortValue === "Name") {
                if (a.name === b.name) return 0;
                return a.name > b.name ? 1 : -1;
            } else if (sortValue === "Rarity") {
                const rarityA = rarityOrder[a.cardcategory];
                const rarityB = rarityOrder[b.cardcategory];
                if (rarityA === rarityB) return 0;
                return rarityA > rarityB ? 1 : -1;
            } else {
                if (a.id === b.id) return 0;
                return a.id > b.id ? 1 : -1;
            }
        } else {
            if (sortValue === "Name") {
                if (b.name === a.name) return 0;
                return b.name > a.name ? 1 : -1;
            } else if (sortValue === "Rarity") {
                const rarityA = rarityOrder[a.cardcategory];
                const rarityB = rarityOrder[b.cardcategory];
                if (rarityB === rarityA) return 0;
                return rarityB > rarityA ? 1 : -1;
            } else {
                if (b.id === a.id) return 0;
                return b.id > a.id ? 1 : -1;
            }
        }
    }

    useEffect(() => {
        setCorrespondingJson([...correspondingJson].sort((a, b) => {
            if (a.inCollection && !b.inCollection) return 1;
            if (!a.inCollection && b.inCollection) return -1;
            if (a.inCollection && b.inCollection) {
                return sorter(a, b)
            }
            return sorter(a, b)
        }))
    }, [sortOrder, sortValue])

    useEffect(() => {
        const abortController = new AbortController();
        async function fetcher() {
            try {
                let baseString = window.location.href.replace(`${process.env.NEXT_PUBLIC_SITE}/query`, '')
                let cardList: Card[] = []
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
                        setQueryTracker((prevQueryTracker) => {
                            const now = new Date()
                            const storedTime = localStorage.getItem('nsqueries')
                            if (storedTime && now.getTime() > JSON.parse(localStorage.getItem('nsqueries')!).expiration) {
                                const expirationDate = new Date().getTime() + 30000;
                                localStorage.setItem('nsqueries', JSON.stringify({ value: 0, expiration: expirationDate }));
                                return 0
                            }
                            if (storedTime) {
                                const updatedQueryTracker = JSON.parse(storedTime).value + 1;
                                const expirationDate = new Date().getTime() + 30000;
                                localStorage.setItem('nsqueries', JSON.stringify({ value: updatedQueryTracker, expiration: expirationDate }));
                                return Number(updatedQueryTracker)
                            }
                            const updatedQueryTracker = prevQueryTracker + 1;
                            const expirationDate = new Date().getTime() + 30000;
                            localStorage.setItem('nsqueries', JSON.stringify({ value: updatedQueryTracker, expiration: expirationDate }));
                            return updatedQueryTracker;
                        });
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
                        signal: abortController.signal,
                        headers: {
                            'User-Agent': "Kractero card queries"
                        }
                    })
                    setQueryTracker((prevQueryTracker) => {
                        const now = new Date()
                        const storedTime = localStorage.getItem('nsqueries')
                        if (storedTime && now.getTime() > JSON.parse(localStorage.getItem('nsqueries')!).expiration) {
                            const expirationDate = new Date().getTime() + 30000;
                            localStorage.setItem('nsqueries', JSON.stringify({ value: 0, expiration: expirationDate }));
                            return 0
                        }
                        if (storedTime) {
                            const updatedQueryTracker = JSON.parse(storedTime).value + 1;
                            const expirationDate = new Date().getTime() + 30000;
                            localStorage.setItem('nsqueries', JSON.stringify({ value: updatedQueryTracker, expiration: expirationDate }));
                            return Number(updatedQueryTracker)
                        }
                        const updatedQueryTracker = prevQueryTracker + 1;
                        const expirationDate = new Date().getTime() + 30000;
                        localStorage.setItem('nsqueries', JSON.stringify({ value: updatedQueryTracker, expiration: expirationDate }));
                        return updatedQueryTracker;
                    });
                    const cardsText = await cardsReq.text()
                    const parser = new XMLParser()
                    let cards = parser.parse(cardsText)
                    if (!(cards.CARDS.DECK && cards.CARDS.DECK.CARD)) {
                        throw new Error("Something is wrong with the collection or deck you gave")
                    }
                    deckCards = cards.CARDS.DECK.CARD
                }
                if (collectionCards.length > 0 && deckCards.length > 0) {
                    const cardsNotInCollection = deckCards.filter((card) => {
                        return !collectionCards.some((collectionCard) => collectionCard.CARDID === card.CARDID);
                    });
                    const getCards = await fetch('/api/collection', {
                        signal: abortController.signal,
                        body: JSON.stringify({ "url": `${process.env.NEXT_PUBLIC_API}/collection${baseString}`, "cards": cardsNotInCollection }),
                        method: "POST"
                    })
                    cardList = (await getCards.json()).cards
                } else {
                    const getCards = await fetch('/api', {
                        signal: abortController.signal,
                        body: `${process.env.NEXT_PUBLIC_API}/cards${baseString}`,
                        method: "POST"
                    })
                    let cardsJson = await getCards.json()
                    cardList = await Promise.all((cardsJson.cards as Card[]).map(async (nation) => {
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
                }
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
        return () => {
            abortController.abort();
          };
    }, [searchParams])
    return (
        <MantineProvider emotionCache={appendCache}>
            <div className='flex gap-4'>
                <a href="/">
                    <Button variant={"outline"}
                        data-umami-event="Make New Query" className="text-white transition duration-500 bg-blue-700 hover:bg-blue-600 mb-8">
                        <Home />
                    </Button>
                </a>
                {correspondingJson.length > 0 && <Button variant={'outline'}
                    onClick={handleDownload}
                    className="text-white transition duration-500 bg-blue-700 hover:bg-blue-600 mb-8"
                >
                    <Download />
                </Button>}
            </div>
            <h4 className="leading-7">Your current queries to NS API: {queryTracker}/30</h4>
            <small className='text-xs leading-none mb-4'>(50/30 seconds allowed)</small>
            {correspondingJson.length > 0 ?
                <>
                    <p className='dark:text-white text-lg font-bold mb-2'>?{lastQuery}</p>
                    <div className='flex flex-col flex-wrap items-center gap-4 dark:text-white'>
                        <div className='flex gap-4 mt-4'>
                            <DropdownMenu>
                                <DropdownMenuTrigger><SortDesc /></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem onCheckedChange={() => setSortOrder("Asc")} checked={sortOrder === "Asc" ? true : false}>Asc</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem onCheckedChange={() => setSortOrder("Desc")} checked={sortOrder === "Desc" ? true : false}>Desc</DropdownMenuCheckboxItem>
                                    <DropdownMenuItem onSelect={() => setSortValue('ID')}>Card ID</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortValue('Rarity')}>Rarity</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortValue('Name')}>Name</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Pagination style={{ backgroundColor: "fff" }} value={activePage} onChange={handlePageChange} total={pageCount} />
                        </div>
                        <div className='flex flex-wrap justify-center'>
                            {!correspondingJson[0].motto ?
                                <div className='flex flex-col dark:text-white'>
                                    {currentItems.map((card, i) => <p key={i}>{card.name}</p>)}
                                </div>
                                :
                                currentItems.map((card, i) =>
                                    card.season !== 3 ? (
                                        <S1S2Card key={`${card.name}-${card.season}-${i}`} card={card} />
                                    ) : (
                                        <S3Card key={`${card.name}-${card.season}-${i}`} card={card} />
                                    )
                                )
                            }
                        </div>
                    </div>
                </>
                : <p className='dark:text-white text-lg font-bold mb-2'>Generating cards for {lastQuery}, please wait...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </MantineProvider>
    )
}