// "use client";

// import * as React from "react";
// import * as Popover from "@radix-ui/react-popover";
// import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
// import { cn } from "~/lib/utils";

// type MultiSelectOption = {
//   id: string;
//   name: string;
// };

// type MultiSelectProps = {
//   options: MultiSelectOption[];
//   selectedValues: string[];
//   onChange: (selected: string[]) => void;
//   label?: string;
// };

// const MultiSelect: React.FC<MultiSelectProps> = ({
//   options,
//   selectedValues,
//   onChange = () => {},
//   label = "Select",
// }) => {
//   const [isOpen, setIsOpen] = React.useState(false);

//   const toggleOption = (id: string) => {
//     if (selectedValues.includes(id)) {
//       // Remove from selection
//       onChange(selectedValues.filter((value) => value !== id));
//     } else {
//       // Add to selection
//       onChange([...selectedValues, id]);
//     }
//   };

//   return (
//     <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
//       <Popover.Trigger asChild>
//         <button
//           className={cn(
//             "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//           )}
//         >
//           <span className="line-clamp-1">
//             {selectedValues?.length > 0
//               ? options
//                   .filter((option) => selectedValues.includes(option.id))
//                   .map((option) => option.name)
//                   .join(", ")
//               : label}
//           </span>
//           <ChevronDownIcon className="h-4 w-4 opacity-50" />
//         </button>
//       </Popover.Trigger>
//       <Popover.Content
//         align="start"
//         sideOffset={4}
//         className={cn(
//           "relative z-50 max-h-96 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
//         )}
//       >
//         <div className="p-1">
//           {options?.map((option) => (
//             <div
//               key={option.id}
//               className={cn(
//                 "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
//               )}
//               onClick={() => toggleOption(option.id)}
//             >
//               <span>{option.name}</span>
//               {selectedValues?.includes(option.id) && (
//                 <CheckIcon className="h-4 w-4 text-accent-foreground" />
//               )}
//             </div>
//           ))}
//         </div>
//       </Popover.Content>
//     </Popover.Root>
//   );
// };

// export default MultiSelect;
