import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Dev() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12 max-w-7xl">
            <div className='mt-2 mb-10 text-center'>
                <h1 className="text-7xl my-2 tracking-tight">Card <span className='text-purple-700'>Queries</span></h1>
                <Link href="/"><Button className='rounded-md text-sm font-medium px-4 py-2 my-2'><Home /></Button></Link>
            </div>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Stack
            </h2>
            <div className="space-y-10 sm:grid sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:gap-x-6 sm:gap-y-14 sm:space-y-0 md:grid-cols-3 md:grid-rows-2 lg:gap-x-8">
                <div className="relative flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-purple-200">
                    <div className="flex items-center bg-white/10 p-2 pl-5 transition-colors hover:bg-white/5">
                        <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" 
                            className="text-lg font-medium leading-6 md:text-xl h-full rounded-md before:absolute before:inset-0 before:content-[''] focus:no-underline hover:no-underline active:no-underline">
                            Next.js
                        </a>
                    </div>
                    <div className="m-6 h-full text-sm md:text-base">
                        Used by some of the world&apos;s largest companies, Next.js enables you to create full-stack Web applications by extending 
                        the latest React features, and integrating powerful Rust-based JavaScript tooling for the fastest builds.
                    </div>
                </div>
                <div className="relative flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-purple-200">
                    <div className="flex items-center bg-white/10 p-2 pl-5 transition-colors hover:bg-white/5 ">
                        <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer" 
                            className="text-lg font-medium leading-6 md:text-xl h-full rounded-md before:absolute before:inset-0 before:content-[''] focus:no-underline hover:no-underline active:no-underline">
                            FastAPI
                        </a>
                    </div>
                    <div className="m-6 h-full text-sm md:text-base">
                        FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.
                    </div>
                </div>
                <div className="relative flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-purple-200">
                    <div className="flex items-center bg-white/10 p-2 pl-5 transition-colors hover:bg-white/5">
                        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" 
                        className="text-lg font-medium leading-6 md:text-xl h-full rounded-md before:absolute before:inset-0 before:content-[''] focus:no-underline hover:no-underline active:no-underline">
                            Tailwind CSS
                        </a>
                    </div>
                    <div className="m-6 h-full text-sm md:text-base">
                        A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build 
                        any design, directly in your markup.
                    </div>
                </div>
                <div className="relative flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-purple-200">
                    <div className="flex items-center bg-white/10 p-2 pl-5 transition-colors hover:bg-white/5">
                        <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" 
                        className="text-lg font-medium leading-6 md:text-xl h-full rounded-md before:absolute before:inset-0 before:content-[''] focus:no-underline hover:no-underline active:no-underline">
                            shadcn/ui
                        </a>
                    </div>
                    <div className="m-6 h-full text-sm md:text-base">
                    Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
                    </div>
                </div>
                <div className="relative flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-purple-200">
                    <div className="flex items-center bg-white/10 p-2 pl-5 transition-colors hover:bg-white/5">
                        <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" 
                        className="text-lg font-medium leading-6 md:text-xl h-full rounded-md before:absolute before:inset-0 before:content-[''] focus:no-underline hover:no-underline active:no-underline">
                            TypeScript
                        </a>
                    </div>
                    <div className="m-6 h-full text-sm md:text-base">
                        TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
                    </div>
                </div>
                <div className="relative flex flex-col justify-between rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:border-purple-200">
                    <div className="flex items-center bg-white/10 p-2 pl-5 transition-colors hover:bg-white/5">
                        <a href="https://railway.app/" target="_blank" rel="noopener noreferrer" 
                        className="text-lg font-medium leading-6 md:text-xl h-full rounded-md before:absolute before:inset-0 before:content-[''] focus:no-underline hover:no-underline active:no-underline">
                            Railway
                        </a>
                    </div>
                    <div className="m-6 h-full text-sm md:text-base">
                        Made for any language, for projects big and small. Railway is the cloud that takes the complexity out of shipping software.
                    </div>
                </div>
            </div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">Credit to UPC/r3n for API inspiration.</p>
        </main>
    )
}