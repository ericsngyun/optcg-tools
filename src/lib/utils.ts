import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Badge } from "~/components/ui/badge"
import { ZapIcon } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function effect_change( effect: string ) {
  const phrases = [
    {text: 'Activate:Main', color: 'bg-blue-400'},
    {text: 'Once per turn', color: 'bg-red-400'},
    {text: 'Double Attack', color: 'test'}
  ]

  
}