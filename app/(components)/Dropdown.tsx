import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
interface Props { items: string[], name: string, defindex: number }

export function Dropdown({ items, name, defindex }: Props) {
    return (
        <Select name={name}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={defindex} />
            </SelectTrigger>
            <SelectContent>
                {items.map(item => {
                    return <SelectItem key={item} value={item.toLowerCase()}>{item}</SelectItem>
                })}
            </SelectContent>
        </Select>
    )
}