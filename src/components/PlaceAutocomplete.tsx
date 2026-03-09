
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: string | null) => void;
  defaultValue?: string;
  className?: string;
}

export function PlaceAutocomplete({
  onPlaceSelect,
  defaultValue = "",
  className,
}: PlaceAutocompleteProps) {

  const [value, setValue] = useState(defaultValue);

  /* keep state synced if parent updates defaultValue */
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;

    setValue(newValue);

    const cleaned = newValue.trim();

    if (cleaned.length === 0) {
      onPlaceSelect(null);
    } else {
      onPlaceSelect(cleaned);
    }
  }

  function handleBlur() {
    const cleaned = value.trim();

    if (cleaned.length === 0) {
      setValue("");
      onPlaceSelect(null);
    }
  }

  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter your full address"
        className={className}
        required
        autoComplete="street-address"
      />
    </div>
  );
}
