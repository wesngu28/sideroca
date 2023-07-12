'use client'

import { useState } from "react"
import { ComboBox } from "./ComboBox";

interface Props {
    categories: string[]
    suggestions: string
}

export function MultipleInput({ categories, suggestions }: Props) {
    const [inputs, setInputs] = useState([""]);

    const addInput = () => {
        setInputs([...inputs, ""]);
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-2">
                {
                    inputs.map((input, index) => {
                        return <ComboBox key={index} items={categories} name={suggestions} idx={index} />
                    })
                }
            </div>
            <button data-umami-event={`${suggestions} row added`} className="text-lg bold" onClick={(e) => {
                e.preventDefault()
                addInput()
            }}>+</button>
        </div>
    );
}