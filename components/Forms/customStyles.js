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
    backgroundColor: document.documentElement.className === "dark" ? "rgb(55,65,81)" : "",
    color: document.documentElement.className === "dark" ? "#fff" : "rgb(55,65,81)",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(55,65,81)" : "#fff",
    borderWidth: "1px",
    borderRadius: "0.25rem",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(55,65,81)" : "#fff",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(55,65,81)" : "#fff",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: document.documentElement.className === "dark" ? "#fff" : "rgb(55,65,81)",
    backgroundColor:
      document.documentElement.className === "dark" ? "rgb(55,65,81)" : "#fff",
    borderWidth: "0.5px",
    borderRadius: "0.25rem",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: document.documentElement.className === "dark" ? "#fff" : "rgb(55,65,81)",
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
