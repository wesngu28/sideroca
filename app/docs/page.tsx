import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { badges, governments, flags, trophiesDict } from "../(helpers)/categories";

export default function Docs() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <div className='mt-2 mb-10 text-center'>
                <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-purple-700'>Queries</span></h1>
                <Link href="/"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'><Home /></Button></Link>
            </div>
            <Link className="mt-3 mb-6 transition-colors duration-300 hover:text-purple-700" href="https://nscards.up.railway.app/cards">https://nscards.up.railway.app/cards</Link>
            <div className="flex flex-col gap-8 max-w-[300px] phone:max-w-5xl">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Card Queries is the frontend over an API made with FastAPI, a python library for making fast apis. The API
                    grants access to the dumps which are stored in a PostgreSQL database. At the moment, manually building queries
                    offers more access than the interface.
                </p>
                <h2 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Routes
                </h2>
                <div className="flex gap-4 pb-2">
                <a href="#cards" className="transition-colors duration-300 hover:text-purple-700 leading-7">/cards</a>
                <a href="#collection" className="transition-colors duration-300 hover:text-purple-700 leading-7">/collection</a>
                </div>
                <div>
                    <h3 id="cards" className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        /cards
                    </h3>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        The main route and probably the one you want.
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-12 text-center">
                        Sample Queries
                    </h4>
                   <div className="my-2 break-words">
                        <code>
                            /cards?cardcategory=rare&category=authoritarian_democracy,civil_rights_lovefest
                        </code>
                        <p>Gets all rare cards that are authoritiarian democracies or civil rights lovefests.</p>
                    </div>
                    <div className="my-2">
                        <code>
                            /cards?trophies=civil_rights-1&badge=admin
                        </code>
                        <p>Gets all nations with a 1% civil rights badge that are administrators.</p>
                    </div>
                    <div className="mb-12">
                        <code>
                            /cards?season=1&region=the_burning_legion&deck=Kractero
                        </code>
                        <p>Gets all season 1 cards from the region The Burning Legion, matched against the deck of Kractero.</p>
                    </div>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        General Format
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">All lower case, replace spaces with underscores. 
                    Separate multiple values for the same parameter with commas.</p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Return Mode
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        Only possible parameter is names. Will return a stripped down JSON, way lighter on resources.
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Excluding Parameters
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        You can exclude certain parameters from the query by simply not including them. However, this does not mean you are searching for nations without those fields.
                        To explicitly exclude them, you can use an exclamation mark before the parameter (e.g., category=!anarchy).
                        Trophies and badges are special as they support full exclusion searching. You can use the keyword sans to find nations without trophies (e.g., trophies=sans).
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Partial and Exact Matching
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        For some parameters, you can perform both partial and exact matching. These parameters include name, nation manual, type, region, and motto.
                        By default, they perform partial matching. To match exactly, you can use double equal signs (e.g., name==Giovanni matches Giovanni exactly).
                        You can also use the != operator to ignore a specific value (e.g., name=!=Giovanni ignores the nation named Giovanni).
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Exact Matching
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        Certain parameters require exact matching. These parameters include flag, cardcategory (rarity), and WA category.
                        When using these parameters, the values must match exactly to find the desired nations.
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Variable Parameters
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        Trophies and badges support variable matching. By default, separating values with commas performs an "and" match,
                        while separating values with a vertical bar (|) performs an "or" match. This allows you to search for nations based on different trophy or badge combinations.
                    </p>
                    <pre className="mt-2">
                            trophies=happy-1,fat-5|bev-1
                    </pre>
                    This indicates all nations with happiness 1% and either obesity 5% or beverage sales industry at 1%.
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Exposed Parameters
                    </h4>
                    <p className="leading-7">
                        All parameters can be nulled
                    </p>
                    <ul className="my-3 ml-6 list-disc [&>li]:mt-4">
                        <li>Deck - takes a nation name</li>
                        <p className="ml-6 mb-2">
                        When you pass the deck parameter in the cards route, the API will match the returned cards against the specified decks, 
                        indicating whether each card is included within them. Mutually exclusive with deck.
                        </p>
                        <li>Collection - takes an ID</li>
                        <p className="ml-6 mb-2">
                        When you pass the collection parameter in the cards route, the API will match the returned cards against the specified collections, 
                        indicating whether each card is included within them. Mutually exclusive with collection.
                        </p>
                        <li>Mode - Indicates JSON return type</li>
                        <li>Season - Indicates Card Season</li>
                        <p className="ml-6 my-2">Format: season=1, season=2, season=3</p>
                        <li>Trophies - WA Census Rankings, 1t means #1, 1 1%, 5 5%, 10 10%</li>
                        <p className="ml-6 my-2">Format: trophies=happy-1t</p>
                        <p className="ml-6 mb-2">Possible Trophies:</p>
                        <ul className="ml-6 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                            <li>Sans</li>
                            {Object.entries(trophiesDict).sort().map(([key, value]) => {
                                const formattedKey = key.split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(' ');
                                return (
                                <li key={formattedKey}>
                                    {formattedKey} -&gt; <span className="font-bold">{value}</span>
                                </li>
                                );
                            })}
                        </ul>
                        <li>Badges</li>
                        <p className="ml-6 my-2">Format: badges=admin</p>
                        <p className="ml-6 mb-2">Possible Badges:</p>
                        <ul className="ml-6 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                            <li>Sans</li>
                            {badges.map(badge => <li key={badge}>{badge}</li>)}
                        </ul>
                        <li>Category - These are WA government categories</li>
                        <p className="ml-6 my-2">Format: category=anarchy</p>
                        <p className="ml-6 mb-2">Possible Categories:</p>
                        <ul className="ml-6 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                            {governments.map(government => <li key={government}>{government}</li>)}
                        </ul>
                        <li>Cardcategory (Rarity) - You know these</li>
                        <p className="ml-6 my-2">Format: cardcategory=legendary</p>
                        <li>Region - Any region</li>
                        <p className="ml-6 my-2">Format: region=the_burning_legion</p>
                        <li>Exnation - Exnations, only works for S1</li>
                        <p className="ml-6 my-2">Format: exnation</p>
                        <li>Flag</li>
                        <p className="ml-6 my-2">Format: flag=afghanistan</p>
                        <p className="ml-6 mb-2">Possible Flags:</p>
                        <ul className="ml-6 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                            {flags.map(flag => <li key={flag}>{flag}</li>)}
                        </ul>
                        <li>Motto - searches motto, currently only supports partial</li>
                        <p className="ml-6 my-2">Format: motto=lion</p>
                        <li>Name - Nation names, currently partial by default</li>
                        <p className="ml-6 my-2">Format: name=koem_kab</p>
                        <li>Type - The manually changeable type category</li>
                        <p className="ml-6 my-2">Format: type=kingdom</p>
                    </ul>
                    <h3 id="collection" className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        /collection
                    </h3>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        A secondary route, the purpose of this route is to take one or multiple collections, and compare it against
                        the cards in your deck. Essentially this returns all cards in your deck that are not in active collections.
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Exposed Parameters
                    </h4>
                    <ul className="my-3 ml-6 list-disc [&>li]:mt-4">
                        <li>Deck - Takes a deck name, provide additional ones with commas.</li>
                        <li>Collection - Takes a collection parameter, provide additional ones with commas.</li>
                    </ul>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 text-center">
                        Sample Queries
                    </h4>
                   <div className="my-2">
                        <pre>
                            /collection?collection=3293,67193&deck=Kractero
                        </pre>
                        <p>Collects cards from the 3293 and 67193 collection, then returns all the cards from Kractero&apos;s Deck 
                            that are not included within those collections.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}