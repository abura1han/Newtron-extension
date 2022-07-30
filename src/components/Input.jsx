import { useRef, useState } from 'react'

export const HeroSearch = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [search, setSearch] = useState('')

  const SearchRef = useRef(null)

  return (
    <form action="https://www.google.com/search">
      <input
        type={'text'}
        name="q"
        placeholder={'What are you looking for?'}
        className={
          'w-full h-auto px-[25px] py-4 rounded-full tracking-wider text-lg text-white bg-[#141414] border border-[#545454] outline-none'
        }
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={SearchRef}
      />
    </form>
  )
}
