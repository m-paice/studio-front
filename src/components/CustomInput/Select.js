import React from "react";
import SelectInput from "react-select";

const customStyles = {
  formControl: (styles) => ({ ...styles, width: "100%" }),
  container: (styles) => ({
    ...styles,
    width: "100%",
  }),
  control: (styles) => ({
    ...styles,
    width: "100%",
    border: "none",
    borderColor: "none",
    boxShadow: "none",
    borderRadius: "none",
    borderBottom: "1px solid #D2D2D2",
  }),
  valueContainer: (styles) => ({ ...styles, padding: 0 }),
  option: (styles) => ({ ...styles, zIndex: 9 }),
  menuList: (styles) => ({
    ...styles,
    width: "100%",
    background: "#fff",
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    background: "transparent",
  }),
};

export function Select({ options, onChange, value, defaultValue }) {
  return (
    <div style={{ marginTop: 37, paddingBottom: 10 }}>
      <SelectInput
        styles={customStyles}
        placeholder="Selecione um item"
        options={options}
        value={value}
        defaultValue={defaultValue}
        onChange={(val) => onChange(val)}
      />
    </div>
  );
}
