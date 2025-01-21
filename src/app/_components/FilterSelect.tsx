import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: { id: string; name: string }[];
  onChange: (value: string) => void;
}) => (
  <Select value={value ?? undefined} onValueChange={onChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder={`Select ${label}`} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{label}</SelectLabel>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);