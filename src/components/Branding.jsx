import { useEffect, useState } from 'react'

export const BrandProfile = () => {
  return (
    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full border border-[#545454] overflow-hidden bg-[#141414]">
      <img src="https://google.com/favicon.ico" alt="profile" />
    </div>
  )
}

export const Branding = () => {
  return (
    <div className="mb-[50px]">
      <h2 className="text-[40px] font-Brand font-bold text-white">Newtron</h2>
    </div>
  )
}

export const Clock = () => {
  const [time, setTime] = useState(`${getTime()[0]}:${getTime()[1]}`)
  const [suffix, setSuffix] = useState(getTime()[2])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(`${getTime()[0]}:${getTime()[1]}`)
      setSuffix(getTime()[2])
    }, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  function getTime() {
    const date = new Date(Date.now())
    let mins = date.getMinutes()
    let hours = date.getHours()
    let suffix = hours >= 12 ? 'PM' : 'AM'

    if (mins > 0 && mins < 10) {
      mins = '0' + mins
    }

    if (hours > 0 && hours < 10) {
      hours = '0' + hours
    }

    return [hours, mins, suffix]
  }

  return (
    <div className="flex items-end justify-center">
      <div className="text-white text-6xl font-black">{time}</div>
      <div className="text-white text-sm">{suffix}</div>
    </div>
  )
}
