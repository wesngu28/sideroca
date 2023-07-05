"use client"
import { useEffect, useState } from 'react'
import { MultipleInput } from './(components)/Input'
import { badges, trophies } from './categories'

export default function Home() {

  const [cardNames, setCardNames] = useState<string[]>([])
  const [cardLinks, setCardLinks] = useState<string[]>([])
  const [queries, setQueries] = useState<string[]>([])
  const [lastQuery, setLastQuery] = useState("")
  useEffect(() => {
    setQueries(JSON.parse(localStorage.getItem('queries') || '[]') || [])
  }, [])

  async function servers(e: any, baseString?: string) {
    e.preventDefault()
    let season = ""
    console.log(baseString)
    if (!baseString) {
      const form = e.target;
      const formData = new FormData(form);
      season = formData.get('season') as string
      baseString = `https://api.nsupc.dev/cards/v1?season=${season}`
      if (formData.get('region')) baseString += `&region=${(formData.get('region') as string).replaceAll(' ', '_').toLowerCase()}`
      if (formData.get('rarity')) baseString += `&rarity=${formData.get('rarity')}`

      const trophyKeys = [...Array.from(formData.keys())].filter(key => key.includes('trophies') || key.includes('percent'));
      const badgeKeys = [...Array.from(formData.keys())].filter(key => key.includes('badges'));

      if (trophyKeys.length > 0) {
        for (const key of trophyKeys) {
          const trophyValue = (formData.get(key) as string)!.replaceAll(' ', '_').toLowerCase();
          if (trophyValue && !baseString.includes("&trophies=")) baseString += "&trophies="
          if (key.includes('trophies')) {
            const trophyValue = (formData.get(key) as string)!.replaceAll(' ', '_').toLowerCase();
            baseString += trophyValue
          }
          if (key.includes('percent')) {
            const percentValue = key.split('percent')[0]
            baseString += `:${percentValue};`
          }
        }
        if (baseString[baseString.length - 1] === ';') baseString = baseString.slice(0, baseString.length - 1)
      }

      if (badgeKeys.length > 0) {
        for (const key of badgeKeys) {
          const badge = (formData.get(key) as string)!.replaceAll(' ', '_').toLowerCase();
          if (badge && !baseString.includes("&badges=")) baseString += "&badges="
          if (badge) baseString += `${badge};`
        }

        if (baseString[baseString.length - 1] === ';') {
          baseString = baseString.slice(0, baseString.length - 1);
        }
        if (baseString[baseString.length - 1] === ';') baseString = baseString.slice(0, baseString.length - 1)
      }

      if (formData.get('category')) baseString += `&category=${formData.get('category')}`
      if (formData.get('flag')) baseString += `&flag=${formData.get('flag')}`
      if (formData.get('motto')) baseString += `&motto=${formData.get('motto')}`
      if (formData.get('pretitle')) baseString += `&pretitle=${formData.get('pretitle')}`

      const querySet = new Set(queries)
      querySet.add(baseString.replace('https://api.nsupc.dev/cards/v1?', ''))
      localStorage.setItem('queries', JSON.stringify(queries));
    }

    const getCards = await fetch('/api', {
      body: baseString,
      method: "POST"
    })
    const cardsJson = await getCards.json()
    const nationNames: string[] = Object.values(cardsJson.nations)
    const nationIds = Object.keys(cardsJson.nations)
    if (season) season = baseString?.split('?season=')[1][0] as string
    const links = nationIds.map(id => `https://www.nationstates.net/page=deck/card=${id}/season=${season}`)
    setCardNames(nationNames)
    setCardLinks(links)
    setLastQuery(baseString.replace('https://api.nsupc.dev/cards/v1?', ''))
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {cardLinks.length === 0 &&
        <>
          <div className="relative flex">
            <form className='flex flex-col items-center' onSubmit={(e) => servers(e)} name='card'>
              <div className='grid grid-cols-2 m-2 w-96 gap-4 items-center'>
                <p>Filter Season</p>
                <select name="season" required className='text-black p-2'>
                  <option value={"1"}>Season 1</option>
                  <option value={"2"}>Season 2</option>
                  <option value={"3"}>Season 3</option>
                </select>
              </div>
              <div className='grid grid-cols-2 m-2 w-96 gap-4 items-center'>
                <p>Pick Trophies</p>
                <MultipleInput categories={trophies} suggestions='trophies' />
              </div>
              <div className='grid grid-cols-2 m-2 w-96 gap-4 items-center'>
                <p>Pick Badges</p>
                <MultipleInput categories={badges} suggestions='badges' />
              </div>
              <button className="w-max mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50" type='submit'>Search</button>
            </form>
          </div>
          <div className='flex flex-col mt-16 gap-4'>
            <p className='text-lg font-bold mb-2'>Previous Queries</p>
            {queries.map(query => <button key={query} onClick={(e) => servers(e, `https://api.nsupc.dev/cards/v1?${query}`)}>{query}</button>)}
          </div>
        </>
      }
      {cardLinks.length > 0 &&
        <>
          <button className="w-max mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50 mb-8" onClick={() => {
            setCardLinks([])
          }}>New Query</button>
          <p className='text-lg font-bold mb-2'>{lastQuery}</p>
          <div className='flex flex-col'>
            {cardLinks.map((card, i) => <a key={cardNames[i]} href={card}>{cardNames[i]}</a>)}
          </div>
        </>
      }
    </main>
  )
}
