export const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected
      ? document.documentElement.className === "dark"
        ? "lightgray"
        : "#gray"
      : document.documentElement.className === "dark"
      ? "#fff"
      : "black",
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(30,41,59)" : "#fff",
  }),
  input: (provided, state) => ({
    ...provided,
    color: document.documentElement.className === "dark" ? "#fff" : "#2d3748",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(30,41,59)" : "#fff",
    borderWidth: "1px",
    borderRadius: "0.25rem",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "#2d3748" : "#fff",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "#2d3748" : "#fff",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: document.documentElement.className === "dark" ? "#fff" : "#2d3748",
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(15 23 42)" : "#fff",
    borderWidth: "0.5px",
    borderRadius: "0.25rem",
  }),
  menu: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(30,41,59)" : "#fff",
  }),
}
