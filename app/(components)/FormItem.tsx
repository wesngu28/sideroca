import { ReactNode } from "react";

export default function FormItem({ children, label }: { children: ReactNode, label: string }) {
    return (
        <div className='grid grid-cols-2 m-2 w-72 sm:w-96 gap-4 items-center'>
            <p>{label}</p>
            {children}
        </div>
    )
}