"use client"
import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import { MultipleInput, Input } from './(components)/Input'
import { badges, flags, governments, trophies } from './categories'

export default function Home() {

  const [cardNames, setCardNames] = useState<string[]>([])
  const [cardLinks, setCardLinks] = useState<string[]>([])
  const [queries, setQueries] = useState<string[]>([])
  const [lastQuery, setLastQuery] = useState("")
  useEffect(() => {
    let queries = localStorage.getItem('queries')
    if (queries) setQueries(JSON.parse(queries))
  }, [])

  async function servers(e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, baseString?: string) {
    e.preventDefault()
    let season = ""
    if (!baseString) {
      const form = e.target as HTMLFormElement;
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
      localStorage.setItem('queries', JSON.stringify(Array.from(querySet)));
      setQueries(Array.from(querySet).reverse())
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
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Filter Season</p>
                <select name="season" required className='text-black p-2'>
                  <option value={"1"}>Season 1</option>
                  <option value={"2"}>Season 2</option>
                  <option value={"3"}>Season 3</option>
                </select>
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Pick Trophies</p>
                <MultipleInput categories={trophies} suggestions='trophies' />
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Pick Badges</p>
                <MultipleInput categories={badges} suggestions='badges' />
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>WA Category</p>
                <Input categories={governments} suggestions='governments' />
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Filter Rarity</p>
                <select name="rarity" className='text-black p-2'>
                  <option value={""}>All</option>
                  <option value={"common"}>Common</option>
                  <option value={"uncommon"}>Uncommon</option>
                  <option value={"rare"}>Rare</option>
                  <option value={"ultra-rare"}>Ultra Rare</option>
                  <option value={"epic"}>Epic</option>
                  <option value={"legendary"}>Legendary</option>
                </select>
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Region</p>
                <Input suggestions='region' />
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Ex-Nation?</p>
                <div className='flex gap-2'>
                  <input type="checkbox" id="exnation" name="exnation" />
                  <label htmlFor="exnation">Ex-Nation</label>
                </div>
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Flag</p>
                <Input categories={flags} suggestions='flag' />
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Motto</p>
                <Input suggestions='motto' />
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Name</p>
                <Input suggestions='name' />
              </div>
              <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
                <p>Pretitle</p>
                <Input suggestions='pretitle' />
              </div>
              <button data-umami-event="Search Query" className="w-max mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50" type='submit'>Search</button>
            </form>
          </div>
          <div className='flex flex-col mt-16 gap-4'>
            <p className='text-lg font-bold mb-2'>Previous Queries</p>
            {queries.map(query => <button data-umami-event="Viewed Previous Query" key={query} onClick={(e) => servers(e, `https://api.nsupc.dev/cards/v1?${query}`)}>{query}</button>)}
          </div>
        </>
      }
      {cardLinks.length > 0 &&
        <>
          <button data-umami-event="Make New Query" className="w-max mt-4 h-10 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50 mb-8" onClick={() => {
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
