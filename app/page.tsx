"use client"
import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import { MultipleInput, Input } from './(components)/Input'
import { badges, flags, governments, trophies } from './categories'

export default function Home() {

  const [queries, setQueries] = useState<string[]>([])
  const [isPackResults, setIsPackResults] = useState(
    localStorage.getItem('result') ? localStorage.getItem('result') === "true" ? true : false : true);
  
  function switchToggle() {
    setIsPackResults(!isPackResults)
    localStorage.setItem('result', `${!isPackResults}`)
  }

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
      baseString = `season=${season}`
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
      if (formData.get('exnation')) baseString += `&exnation`
      if (formData.get('collection')) baseString += `&collection=${formData.get('collection')}`

      const querySet = new Set(queries)
      querySet.add(baseString.replace('https://api.nsupc.dev/cards/v1?', ''))
      localStorage.setItem('queries', JSON.stringify(Array.from(querySet)));
      setQueries(Array.from(querySet).reverse())
    }
    if(isPackResults) window.location.href = `/query?${baseString}`
    else window.location.href = `/query/lite?${baseString}`
  }

  return (
    <main className="tailwind-preflight flex min-h-screen flex-col items-center p-12">
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
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Collection</p>
            <Input suggestions='collection' />
          </div>
          <button data-umami-event="Search Query" className="w-max mt-4 h-10 mb-1 text-sm transition border-0 rounded appearance-none bg-blue-400 p-2 hover:bg-opacity-50" type='submit'>Search</button>
        </form>
      </div>
      <label className="relative inline-flex items-center cursor-pointer mt-6">
        <input type="checkbox" value="" className="sr-only peer" checked={isPackResults} onChange={() => switchToggle()}/>
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {isPackResults ? 'Pack Results' : 'Lite Mode'}
        </span>
      </label>
      <div className='flex flex-col mt-16 gap-4'>
        <p className='text-lg font-bold mb-2'>Previous Queries</p>
        {queries.map(query => <button data-umami-event="Viewed Previous Query" key={query} onClick={(e) => servers(e, query)}>{query}</button>)}
      </div>
    </main>
  )
}
