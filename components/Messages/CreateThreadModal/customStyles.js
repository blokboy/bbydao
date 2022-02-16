export const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "red" : "blue",
  }),
  input: (provided, state) => ({
    ...provided,
    color: document.documentElement.className === "dark" ? "#fff" : "#2d3748",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "#2d3748" : "#fff",
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
      document.documentElement.className === "dark" ? "#2d3748" : "#fff",
  }),
}
