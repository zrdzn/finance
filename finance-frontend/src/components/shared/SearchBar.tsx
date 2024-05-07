import {ChangeEvent, useState} from "react"
import {Input} from "@chakra-ui/react"

interface SearchBarProperties<Result> {
  placeholder: string
  content: Result[]
  onSearch: (results: Result[]) => void
  filter: (item: Result, searchTerm: string) => boolean
}

export const SearchBar = <Result,>({ placeholder, content, onSearch, filter}: SearchBarProperties<Result>) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleResultsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    setSearchQuery(inputValue)

    const foundResults = content.filter((item) =>
      filter(item, inputValue)
    )

    onSearch(foundResults)
  }

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleResultsChange}
    />
  )
}