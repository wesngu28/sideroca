'use client'

import { useState } from "react"

interface Props {
    categories?: string[]
    suggestions?: string
}

export function MultipleInput({ categories, suggestions }: Props) {
    const [inputs, setInputs] = useState([""]);

    const addInput = () => {
        setInputs([...inputs, ""]);
    };

    const handleInputChange = (index: number, value: string) => {
        const updatedInputs = [...inputs];
        updatedInputs[index] = value;
        setInputs(updatedInputs);
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-2">
                {
                    inputs.map((input, index) => {
                        return <div key={index}>
                                <input
                                    className="p-2 text-black max-w-[136px] sm:max-w-[184px]"
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    autoComplete="off"
                                    type="text"
                                    key={index}
                                    value={input}
                                    list={suggestions}
                                    name={`${suggestions}${index}`}
                                />
                                <datalist id={suggestions}>
                                    {categories && categories.map((category, index) => (
                                        <option key={index} value={category} />
                                    ))}
                                </datalist>
                            {suggestions === "trophies" && input && !input.includes('!') && <>
                                <div className="flex gap-2">
                                <input type="checkbox" id={`cb${index}1%`} name={`1percent`} />
                                <label htmlFor={`cb${index}1%`}>Top 1%</label>
                                <input type="checkbox" id={`cb${index}5%`} name={`5percent`} />
                                <label htmlFor={`cb${index}5%`}>Top 5%</label>
                                <input type="checkbox" id={`cb${index}10%`} name={`10percent`} />
                                <label htmlFor={`cb${index}10%`}>Top 10%</label>
                                </div>
                            </>}
                        </div>
                    })
                }
            </div>
            <button className="text-lg bold" onClick={(e) => {
                e.preventDefault()
                addInput()
                console.log(inputs)
            }}>+</button>
        </div>
    );
}

export function Input({ categories, suggestions }: Props) {
    const [value, setValue] = useState("");
    return (
        <>
            <input
                className="p-2 text-black"
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                type="text"
                value={value}
                list={suggestions}
                name={suggestions}
            />
            <datalist id={suggestions}>
                {categories && categories.map((category, index) => (
                    <option key={index} value={category} />
                ))}
            </datalist>
        </>
    );
}