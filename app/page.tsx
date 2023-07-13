"use client"

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { badges, flags, governments, trophies } from './(helpers)/categories'
import { trophiesDict } from './(helpers)/categories'
import { MultipleInput } from '../../queryfrontend/app/(components)/Input'
import { Dropdown } from './(components)/Dropdown'
import { ComboBox } from './(components)/ComboBox'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "../../queryfrontend/components/ui/label"
import FormItem from './(components)/FormItem'
import { Clipboard, Trash } from 'lucide-react'

export default function Home() {

  const [queries, setQueries] = useState<string[]>([])
  const [collectionType, setCollectionType] = useState("Collection")
  const [render, setRender] = useState("Cards")

  const router = useRouter()

  useEffect(() => {
    let queries = localStorage.getItem('queries')
    if (queries) setQueries(JSON.parse(queries))
  }, [])

  async function makeRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    let query = ["?"]
    for (const [key, value] of Array.from(formData.entries())) {
      if (value) {
        if (key === 'manual') {
          queries.unshift(value.toString())
          localStorage.setItem('queries', JSON.stringify(queries))
          setQueries(queries)
          router.push(`/query?${formData.get('manual')?.toString()}`)
          return
        }
        if (key === 'season') value === 'all' ? "" : query.push(value.toString().replace(' ', '='))
        if (key === 'region') query.push(`region=${value.toString().replaceAll(' ', '_').toLowerCase()}`)
        if (key === 'cardcategory') query.push(`cardcategory=${value}`)
        if (key === 'trophies') {
          const trophyKeys = value ? [...Array.from(formData.keys())].filter(key => key.includes('trophies') || key.includes('%')) : [];
          if (trophyKeys.length > 0) {
            let trophies = ["trophies="]
            for (const key of trophyKeys) {
              if (key.includes('trophies')) trophies.push(trophiesDict[formData.get(key)! as string].replaceAll(' ', '_'))
              if (key.includes('%')) trophies.push(`-${(formData.get(key) as string)}`)
            }
            query.push(trophies.join(',').replace(',', '').replaceAll(',-', '-'))
          }
        }
        if (key === 'badges') {
          const badgeKeys = formData.get('badges') ? [...Array.from(formData.keys())].filter(key => key.includes('badges')) : [];
          if (badgeKeys.length > 0) {
            let badges = ["badges="]
            for (const key of badgeKeys) {
              const badge = (formData.get(key) as string)!.replaceAll(' ', '_').toLowerCase();
              if (badge) badges.push(`${badge}`)
            }
            query.push(badges.join(',').replace(',', ''))
          }
        }
        if (key === 'category') query.push(`category=${value.toString().replaceAll(' ', '_').toLowerCase()}}`)
        if (key === 'flag') query.push(`flag=${value}`)
        if (key === 'motto') query.push(`motto=${value}`)
        if (key === 'type') query.push(`type=${value}`)
        if (key === 'exnation') query.push(`exnation`)
        if (key === 'name') query.push(`name=${value}`)
        if (key === 'collection') query.push(`${collectionType.toLowerCase()}=${value}`)
      }
    }

    let baseString = query.join('&').replace('&', '')
    queries.unshift(baseString)
    localStorage.setItem('queries', JSON.stringify(queries));
    setQueries(Array.from(queries))
    if (formData.get('mode') === 'on') baseString += "&mode=name"
    router.push(`/query${baseString}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className='mt-2 mb-10 text-center'>
        <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-blue-700'>Queries</span></h1>
      </div>
      <div className="relative flex flex-col">
        <form className='flex flex-col items-center' onSubmit={(e) => makeRequest(e)} name='card'>
          <p className='mb-6'>Enter your query manually, or fill out the form.</p>
          <Input className='mb-6 w-full' name="manual" />
          <FormItem label='Filter Season'>
            <Dropdown name='season' items={["All", "Season 1", "Season 2", "Season 3"]} defindex={0} />
          </FormItem>
          <FormItem label='Pick Trophies'>
            <MultipleInput categories={trophies} suggestions='trophies' />
          </FormItem>
          <FormItem label='Pick Badges'>
            <MultipleInput categories={badges} suggestions='badges' />
          </FormItem>
          <FormItem label='WA Category'>
            <ComboBox items={governments} name="category" />
          </FormItem>
          <FormItem label='Rarity'>
            <Dropdown name='cardcategory' items={["All", "Common", "Uncommon", "Rare", "Ultra-Rare", "Epic", "Legendary"]} defindex={0} />
          </FormItem>
          <FormItem label='Region'>
            <Input name='region' />
          </FormItem>
          <FormItem label='Ex-Nation? (s1 only)'>
            <div className='flex gap-2'>
              <input type="checkbox" id="exnation" name="exnation" />
              <label htmlFor="exnation">Ex-Nation</label>
            </div>
          </FormItem>
          <FormItem label='Flag'>
            <ComboBox items={flags} name='flag' />
          </FormItem>
          <FormItem label='Motto'>
            <Input name='motto' />
          </FormItem>
          <FormItem label='Name'>
            <Input name='name' />
          </FormItem>
          <FormItem label='Type'>
            <Input name='type' />
          </FormItem>
          <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center justify-center'>
            <div className='flex items-center gap-4'>
            <Switch id="collection" onCheckedChange={() => setCollectionType(collectionType === 'Collection' ? 'Deck' : 'Collection')}  />
            <Label htmlFor="collection">{collectionType}</Label>
            </div>
            <Input name='collection' />
          </div>
          <div className="flex flex-col gap-2 items-center mt-6">
              <Switch name="mode" id="mode" onCheckedChange={() => render === "Cards" ? setRender('Names') : setRender('Cards')} />
              <Label htmlFor="mode">{render}</Label>
          </div>
          <Button variant={"outline"}
          data-umami-event="Search Query" className="mt-6 transition duration-500 bg-blue-700 hover:bg-blue-600" type='submit'>Search</Button>
        </form>
      </div>
      <div className='flex flex-col mt-16 gap-4'>
        <p className='text-lg font-bold mb-2 text-center'>Previous Queries</p>
        {queries.map((query, i) => {
          return (
            <div key={query + i} className='grid-cols-[25px_auto_1fr] grid gap-4'>
              <Trash className='hover:cursor-pointer' onClick={() => {
                setQueries(prevQueries => prevQueries.filter((_, index) => index !== i));
                localStorage.setItem('queries', JSON.stringify(queries.filter((_, index) => index !== i)));
              }} />
              <Clipboard className='hover:cursor-pointer' onClick={() => navigator.clipboard.writeText(query)}/>
              <a className='hover:text-blue-700 hover:cursor-pointer' data-umami-event="Viewed Previous Query" 
              onClick={() => window.location.href = `/query?${query}`}>{query.length > 45 ? query.slice(0, 45) + '...' : query}
              </a>
            </div>
          )
        })}
      </div>
      <img className='my-8' src='https://ucarecdn.com/8c89fbf7-f54f-4297-b569-f3fae95568d4/' />
    </main>
  )
}
