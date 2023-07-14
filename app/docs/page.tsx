import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { flags, trophiesDict } from "../(helpers)/categories";
import { badges, governments, trophies } from "../categories";

export default function Docs() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <div className='mt-2 mb-10 text-center'>
                <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-blue-700'>Queries</span></h1>
                <Link href="/"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'><Home /></Button></Link>
            </div>
            <div className="flex flex-col gap-8 max-w-5xl">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Card Queries is the frontend over an API made with FastAPI, a python library for making fast apis. The API
                    grants access to the dumps which are stored in a PostgreSQL database. At the moment, manually building queries
                    offers more access than the interface.
                </p>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Route
                </h2>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        /cards
                    </h3>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        The main route and probably the one you want.
                    </p>
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
                        All of the parameters can be excluded from the query. This does not mean you are querying nations that lack mottos or
                        the field that you are excluding. The ones that do support this feature are trophies and badges, by passing sans in 
                        <span className="font-bold"> (IE: trophies=sans)</span>. This will get nations with no trophies.
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Partial Matching
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        Some parameters only allow partial matching. The parameters that match partially are
                        <span className="font-bold"> name</span>, nation manual 
                        <span className="font-bold"> type</span>, <span className="font-bold">region</span>, and
                        <span className="font-bold"> motto</span>. These will support exact matching in the future.
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Exact Matching
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        Some parameters only allow exact matching. The parameters that match exactly are
                        <span className="font-bold"> cardcategory</span> (rarity), and WA<span className="font-bold"> category</span>.
                    </p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Or Parameters
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">Some queries only support or. The queries
                    that are only OR enabled are: querying for nation <span className="font-bold">name</span>, nation manual 
                    <span className="font-bold"> type</span>, <span className="font-bold">region</span>, WA <span className="font-bold">category</span>,
                    <span className="font-bold"> cardcategory </span>(rarity), <span className="font-bold"> flag</span>, and 
                    <span className="font-bold"> motto</span>. This means passing in multiple flags, like flag=afghanistan,albania 
                    will get all nations that have flag Afghanistan or Albania.</p>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Variable Parameters
                    </h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-2">
                        Trophies and badges support variable matching (this has sketchy implementation).
                    </p>
                    <pre className="mt-2">
                            trophies=happy-1,fat-5|bev-1
                    </pre>
                    This indicates all nations with happiness 1% and either obesity 5% or beverage sales industry at 1%.
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 text-center">
                        Sample Queries
                    </h4>
                   <div className="my-2">
                        <pre>
                            ?cardcategory=rare&category=authoritarian_democracy
                        </pre>
                        <p>Gets all rare cards that are authoritiarian democracies</p>
                    </div>
                    <div className="my-2">
                        <pre>
                            ?trophies=civil_rights&badge=admin
                        </pre>
                        <p>Gets all nations with a civil rights badge that are administrators.</p>
                    </div>
                    <div className="my-2">
                        <pre>
                            ?season=1&region=the_burning_legion&deck=Kractero
                        </pre>
                        <p>Gets all season 1 cards from the region The Burning Legion, matched against the deck of Kractero.</p>
                    </div>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6">
                        Exposed Parameters
                    </h4>
                    <p className="leading-7">
                        All parameters can be nulled
                    </p>
                    <ul className="my-3 ml-6 list-disc [&>li]:mt-4">
                        <li className="flex gap-2">Deck - <AlertTriangle /> Testing, takes ID</li>
                        <li className="flex gap-2">Collection - <AlertTriangle /> Testing, takes ID</li>
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
                            {badges.map(badge => <li>{badge}</li>)}
                        </ul>
                        <li>Category - These are WA government categories</li>
                        <p className="ml-6 my-2">Format: category=anarchy</p>
                        <p className="ml-6 mb-2">Possible Categories:</p>
                        <ul className="ml-6 list-disc [&>li]:mt-2 [&>li]:ml-4 [&>li]:text-sm">
                            {governments.map(government => <li>{government}</li>)}
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
                            {flags.map(flag => <li>{flag}</li>)}
                        </ul>
                        <li>Motto - searches motto, currently only supports partial</li>
                        <p className="ml-6 my-2">Format: motto=lion</p>
                        <li>Name - Nation names, currently partial by default</li>
                        <p className="ml-6 my-2">Format: name=koem_kab</p>
                        <li>Type - The manually changeable type category</li>
                        <p className="ml-6 my-2">Format: type=kingdom</p>
                    </ul>
                </div>
            </div>
        </main>
    )
}