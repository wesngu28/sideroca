"use client"
import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import { MultipleInput } from './(components)/Input'
import { badges, flags, governments, trophies } from './categories'
import "./base.css"
import { Dropdown } from './(components)/Dropdown'
import { ComboBox } from './(components)/ComboBox'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"

export default function Home() {

  const [queries, setQueries] = useState<string[]>([])
  const [collectionType, setCollectionType] = useState(true)

  useEffect(() => {
    let queries = localStorage.getItem('queries')
    if (queries) setQueries(JSON.parse(queries))
  }, [])

  async function servers(e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, baseString?: string) {
    e.preventDefault()
    if (!baseString) {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      let query = ["?"]
      if (formData.get('season')) {
        formData.get('season') === "season 1" ? query.push(`season=1`) : formData.get('season') === "season 2" ? query.push(`season=2`) : formData.get('season') === "season 3" ? query.push(`season=3`) : ""
      }
      if (formData.get('region')) query.push(`region=${(formData.get('region') as string).replaceAll(' ', '_').toLowerCase()}`)
      if (formData.get('cardcategory')) query.push(`cardcategory=${formData.get('cardcategory')}`)

      const trophyKeys = formData.get('trophies') ? [...Array.from(formData.keys())].filter(key => key.includes('trophies') || key.includes('%')) : [];
      const badgeKeys = formData.get('badges') ? [...Array.from(formData.keys())].filter(key => key.includes('badges')) : [];
      if (trophyKeys.length > 0) {
        let trophies = ["trophies="]
        for (const key of trophyKeys) {
          if (key.includes('trophies')) trophies.push((formData.get(key) as string)!.replaceAll(' ', '_').toLowerCase())
          if (key.includes('%')) trophies.push(`-${(formData.get(key) as string)}`)
        }
        query.push(trophies.join(',').replace(',', '').replaceAll(',-', '-'))
      }

      if (badgeKeys.length > 0) {
        let badges = ["badges="]
        for (const key of badgeKeys) {
          const badge = (formData.get(key) as string)!.replaceAll(' ', '_').toLowerCase();
          if (badge) badges.push(`${badge}`)
        }
        query.push(badges.join(',').replace(',', ''))
      }

      if (formData.get('category'))  query.push(`category=${formData.get('category')}`)
      if (formData.get('flag'))  query.push(`flag=${formData.get('flag')}`)
      if (formData.get('motto'))  query.push(`motto=${formData.get('motto')}`)
      if (formData.get('pretitle'))  query.push(`pretitle=${formData.get('pretitle')}`)
      if (formData.get('exnation'))  query.push(`exnation`)
      if (formData.get('name'))  query.push(`name=${formData.get('name')}`)
      if (formData.get('collection')) {
        if (collectionType) {
           query.push(`collection=${formData.get('collection')}`)
        } else {
           query.push(`deck=${formData.get('collection')}`)
        }
      }
      baseString = query.join('&').replace('&', '')
      queries.unshift(baseString)
      localStorage.setItem('queries', JSON.stringify(queries));
      setQueries(Array.from(queries).reverse())
    }
    window.location.href = `/query${baseString}`
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className='mt-2 mb-6 text-center'>
        <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-blue-700'>Queries</span></h1>
      </div>
      <div className="tailwind-preflight relative flex">
        <form className='flex flex-col items-center' onSubmit={(e) => servers(e)} name='card'>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Filter Season</p>
            <Dropdown name='season' items={["All", "Season 1", "Season 2", "Season 3"]} />
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
            <ComboBox items={governments} name="category" />
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Filter Rarity</p>
            <Dropdown name='cardcategory' items={["All", "Common", "Uncommon", "Rare", "Ultra-Rare", "Epic", "Legendary"]} />
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Region</p>
            <Input name='region' />
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Ex-Nation? (s1 only)</p>
            <div className='flex gap-2'>
              <input type="checkbox" id="exnation" name="exnation" />
              <label htmlFor="exnation">Ex-Nation</label>
            </div>
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Flag</p>
            <ComboBox items={flags} name='flag' />
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Motto</p>
            <Input name='motto' />
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Name</p>
            <Input name='name' />
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>Pretitle</p>
            <Input name='pretitle' />
          </div>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center justify-center'>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" checked={collectionType} onChange={() => setCollectionType(!collectionType)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium">
                {collectionType ? 'Collection' : 'Deck'}
              </span>
            </label>
            <Input name='collection' />
          </div>
          <Button variant={"outline"}
          data-umami-event="Search Query" className="mt-6 transition duration-500 bg-blue-700 hover:bg-blue-600" type='submit'>Search</Button>
        </form>
      </div>
      <div className='tailwind-preflight flex flex-col mt-16 gap-4'>
        <p className='text-lg font-bold mb-2 text-center'>Previous Queries</p>
        {queries.map(query => {
          return (
            <div key={query} className='grid-cols-[25px_auto_1fr] grid gap-4'>
              <img src="trash-small.png" onClick={() => {
                setQueries(queries.filter(queryitem => queryitem !== query))
                localStorage.setItem('queries', JSON.stringify(queries.filter(queryitem => queryitem !== query)))
              }}/>
              <button data-umami-event="Viewed Previous Query" onClick={(e) => servers(e, query)}>{query.length > 45 ? query.slice(0, 45) + '...' : query}</button>
            </div>
          )
        })}
      </div>
      <img className='my-8' src='https://ucarecdn.com/8c89fbf7-f54f-4297-b569-f3fae95568d4/' />
    </main>
  )
}
