import { useState } from "react";

export function useToggle() {
  const [value, setValue] = useState(false);

  const handleSetValue = () => {
    setValue(!value);
  };

  return [value, handleSetValue];
}
