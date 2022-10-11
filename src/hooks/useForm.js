import { useState } from "react";

export function useForm({ initialValues = {}, requireds = [] }) {
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

  const validateAllFields = () => {
    const response = requireds.reduce((acc, cur) => {
      if (!values[cur]) {
        return {
          ...acc,
          [cur]: "required",
        };
      }

      return acc;
    }, {});

    return {
      isValid: Object.keys(response).length ? false : true,
      errors: response,
    };
  };

  return [values, handleSetValue, handleSetAllValues, validateAllFields];
}
