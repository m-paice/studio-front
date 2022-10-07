import { useState } from "react";

export function useForm({ initialValues = {} }) {
  const [values, setValues] = useState(initialValues);

  const handleSetValue = (key, value) => {
    setValues({
      ...values,
      [key]: value,
    });
  };

  const handleSetAllValues = (newValues) => {
    setValues(newValues);
  };

  return [values, handleSetValue, handleSetAllValues];
}
