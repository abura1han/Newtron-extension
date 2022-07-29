import { useContext } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { DataContext } from '../../context/GlobalContext'

export const StatusBar = () => {
  const [data] = useContext(DataContext)

  return (
    <div className="fixed left-0 bottom-0 w-full flex items-center justify-between px-4 bg-[#141414] text-white font-thin border-t border-t-[#545454] select-none cursor-row-resize z-50">
      <div className="flex cursor-default">
        <button className="mr-3 px-1 text-sm hover:bg-[#242424]">
          Abu Raihan
        </button>
        <button className="mr-3 px-1 text-sm hover:bg-[#242424]"></button>
      </div>
      <div className="flex cursor-default">
        {Object.keys(data).map(
          (e, i) =>
            e !== 'shortcuts' && (
              <button
                key={i}
                className="ml-3 px-1 text-sm hover:bg-[#242424] capitalize"
              >
                {e}:{data[e].length}
              </button>
            )
        )}
        <div className="ml-3">|</div>
        <button className="ml-2 px-1 text-sm hover:bg-[#242424]">
          Sync:✅
        </button>
        <button className="ml-2 px-1 text-sm hover:bg-[#242424]">
          <Online>Online:✅</Online>
          <Offline>Offline:🚫</Offline>
        </button>
      </div>
    </div>
  )
}
