import React from "react";
import ReactSelectAsync from "react-select/async";
import debounce from "lodash/debounce";

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

export function SelectAsync({ exec, clickOption, ...rest }) {
  const _loadSuggestions = (query, callback) => {
    exec(query.toLowerCase()).then((resp) =>
      callback(resp.map((item) => ({ label: item.name, value: item })))
    );
  };

  const loadSuggestions = debounce(_loadSuggestions, 300);

  return (
    <div style={{ marginTop: 37, paddingBottom: 10 }}>
      <ReactSelectAsync
        styles={customStyles}
        loadOptions={loadSuggestions}
        placeholder={rest.placeholder}
        loadingMessage={() => <p> Carregando... </p>}
        noOptionsMessage={() => <p> Nenhum registro encontrado </p>}
        onChange={(value) => clickOption(value)}
        defaultValue={rest.defaultValue}
        isClearable
      />
    </div>
  );
}
