// "use client"

// import * as React from "react"
// import { Check, ChevronsUpDown } from "lucide-react"
// import { cn } from "~/lib/utils"
// import { Button } from "~/components/ui/button"

// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "~/components/ui/command"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "~/components/ui/popover"

// interface ComboBoxProps {
//   selectGroup: string[];
//   open: boolean;
//   value: string
// }

// export function ComboBox({selectGroup, open, value}: ComboBoxProps) {
//   const [states, setStates] = React.useState(
//     Object.fromEntries(
//       data.map((category) => [category.id, { open: false, value: "" }])
//     )
//   )

//   const handleOpenChange = (id: string, open: boolean) => {
//     setStates((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], open },
//     }))
//   }

//   const handleSelect = (id: string, value: string) => {
//     setStates((prev) => ({
//       ...prev,
//       [id]: { open: false, value },
//     }))
//   }

//   return (
//     <div className="space-y-4">
//       {data.map((category) => (
//         <Popover
//           key={category.id}
//           open={states[category.id].open}
//           onOpenChange={(open) => handleOpenChange(category.id, open)}
//         >
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               role="combobox"
//               aria-expanded={states[category.id].open}
//               className="w-[200px] justify-between"
//             >
//               {states[category.id].value
//                 ? category.items.find(
//                     (item) => item.value === states[category.id].value
//                   )?.label
//                 : `Select ${category.label.toLowerCase()}...`}
//               <ChevronsUpDown className="opacity-50" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-[200px] p-0">
//             <Command>
//               <CommandInput placeholder={`Search ${category.label.toLowerCase()}...`} />
//               <CommandList>
//                 <CommandEmpty>No {category.label.toLowerCase()} found.</CommandEmpty>
//                 <CommandGroup>
//                   {category.items.map((item) => (
//                     <CommandItem
//                       key={item.value}
//                       value={item.value}
//                       onSelect={() =>
//                         handleSelect(category.id, item.value === states[category.id].value ? "" : item.value)
//                       }
//                     >
//                       {item.label}
//                       <Check
//                         className={cn(
//                           "ml-auto",
//                           states[category.id].value === item.value
//                             ? "opacity-100"
//                             : "opacity-0"
//                         )}
//                       />
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               </CommandList>
//             </Command>
//           </PopoverContent>
//         </Popover>
//       ))}
//     </div>
//   )
// }