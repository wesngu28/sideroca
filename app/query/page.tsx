import { Metadata } from "next";
import { Query } from "./query";
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = headers();
    const fullUrl = headersList.get('referer') || "";
    return ({
        title: `Card Queries ${fullUrl ? fullUrl.replace(`- ${process.env.NEXT_PUBLIC_SITE}/query?`, '') : ""}`,
        description: "Card Queries"
    })
}

export default function QueryPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-12">
            <Query />
        </main>
    )
}