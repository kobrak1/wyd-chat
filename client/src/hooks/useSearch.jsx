import { useRef, useState } from 'react';

export function useSearch({ data, searchKey, placeholderValue }) {
  // * add a state variable for the filter
  const [searchValue, setSearchValue] = useState('');
  const chatInputRef = useRef(null)

  if (!data || !searchKey) {
    return {
      filteredData: null,
      searchInput: null
    }
  }

  const filteredData = data.filter(item => {
    if (!item[searchKey]) {
      // * if item.searchKey doesn't exists we are dealing with a file
      // TODO: Make this generic
      return item?.file?.name?.toLowerCase()?.includes(searchValue?.toLowerCase());
    }
    return item[searchKey]?.toLowerCase()?.includes(searchValue?.toLowerCase());
  });

  function clearSearchValue() {
    setSearchValue('')
  }

  const searchInput = (
    <input
      type="text"
      ref={chatInputRef}
      placeholder={`Search by ${placeholderValue || searchKey}...`}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      className='bg-gray-200 px-2 h-8 rounded-md w-full'
    />
  )

  return {
    filteredData,
    searchInput,
    chatInputRef,
    clearSearchValue
  }
}