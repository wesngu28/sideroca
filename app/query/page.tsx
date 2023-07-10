import { Metadata } from "next";
import { Query } from "./query";
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = headers();
    const fullUrl = headersList.get('referer') || "";
    return ({
        title: `Card Queries - Query`,
        description: "Card Queries"
    })
}

export default function QueryPage() {
    return (
        <Query />
    )
}