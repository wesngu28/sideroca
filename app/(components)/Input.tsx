'use client'

import { useState } from "react"

interface Props {
    categories: string[]
}

export default function Input({ categories }: Props) {
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
        <>
            <div className="flex flex-col gap-2 text-black">
            {
                inputs.map((input, index) => {
                    return <div>
                        <input
                            className="p-2 text-black"
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            autoComplete="off"
                            type="text"
                            id="trophies"
                            key={index}
                            value={input}
                            list="suggestions"
                        />
                        <datalist id="suggestions">
                            {categories.map((category, index) => (
                            <option key={index} value={category} />
                            ))}
                        </datalist>
                    </div>
                })
            }
            </div>
            <button onClick={(e) => {
                e.preventDefault()
                addInput()
                console.log(inputs)
            }}>+</button>
        </>
      );
    }