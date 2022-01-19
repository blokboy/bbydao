import React from "react"
import axios from "axios"

const fetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isLoading: true,
        hasError: false,
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        hasError: false,
        hits: action.payload,
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        hasError: true,
      }
    default:
      throw new Error()
  }
}

const fetchHits = async (query, dispatch) => {
  dispatch({ type: "FETCH_START" })
  try {
    const result = await axios()
    // `https://hn.algolia.com/api/v1/search?query=${query}`
    dispatch({ type: "FETCH_SUCCESS", payload: result.data.hits })
  } catch (err) {
    dispatch({ type: "FETCH_FAILURE" })
  }
}

function App() {
  const [{ hits, hasError, isLoading }, dispatch] = React.useReducer(
    fetchReducer,
    {
      hits: [],
      isLoading: true,
      hasError: false,
    }
  )
  const [query, setQuery] = React.useState("react")

  React.useEffect(() => {
    fetchHits(query, dispatch)
  }, [query])

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      {hasError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
export default App
