import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
interface Props { items: string[], name: string }

export function Dropdown({ items, name }: Props) {
    return (
        <Select name={name}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={items[0]} />
            </SelectTrigger>
            <SelectContent>
                {items.map(item => {
                    return <SelectItem value={item.toLowerCase()}>{item}</SelectItem>
                })}
            </SelectContent>
        </Select>
    )
}