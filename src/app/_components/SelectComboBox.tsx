"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface ComboBoxProps {
  selectGroup: {
    id: string;
    label: string;
    items: { value: string; label: string }[];
  }[];
  onSelect: (id: string, value: string) => void;
  selectedValues: Record<string, string>;
}

export function ComboBox({
  selectGroup,
  onSelect,
  selectedValues,
}: ComboBoxProps) {
  const [openStates, setOpenStates] = React.useState<Record<string, boolean>>(
    Object.fromEntries(selectGroup.map((group) => [group.id, false]))
  );

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: open,
    }));
  };

  const handleSelect = (id: string, value: string) => {
    onSelect(id, value);
    setOpenStates((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  return (
    <div className="space-y-4">
      {selectGroup.map((category) => (
        <Popover
          key={category.id}
          open={openStates[category.id]}
          onOpenChange={(open) => handleOpenChange(category.id, open)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStates[category.id]}
              className="w-[200px] justify-between"
            >
              {selectedValues[category.id]
                ? category.items.find(
                    (item) => item.value === selectedValues[category.id]
                  )?.label
                : `Select ${category.label.toLowerCase()}...`}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder={`Search ${category.label.toLowerCase()}...`}
              />
              <CommandList>
                <CommandEmpty>No {category.label.toLowerCase()} found.</CommandEmpty>
                <CommandGroup>
                  {category.items.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() =>
                        handleSelect(
                          category.id,
                          item.value === selectedValues[category.id] ? "" : item.value
                        )
                      }
                    >
                      {item.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedValues[category.id] === item.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
