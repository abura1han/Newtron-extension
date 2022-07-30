import { useContext, useEffect, useRef, useState } from 'react'
import {
  DataContext,
  PopupContext,
  SettingsContext,
} from '../context/GlobalContext'
import useKeyboardShortcut from 'use-keyboard-shortcut'

export const HeroShortCut = () => {
  const [data] = useContext(DataContext)

  return (
    <div className="mt-[45px] flex items-center justify-center flex-wrap max-w-[720px] max-h-[600px] overflow-auto">
      {data?.shortcuts?.map((e, i) => (
        <Shortcut key={i} name={e.name} url={e.url} index={i} />
      ))}
      <AddHeroShortCut />
    </div>
  )
}

const s2ServerUrl = 'http://www.google.com/s2/favicons?domain='

const Shortcut = ({ name, url, index }) => {
  const [isHover, setIsHover] = useState(false)
  const [isImgError, setIsImgError] = useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  const [data, setData] = useContext(DataContext)
  const [, setPopup] = useContext(PopupContext)

  const handleDeleteShortcut = (index) => {
    const newData = data.shortcuts.filter((e, i) => i !== index)
    setData({ ...data, shortcuts: [...newData] })
    setIsOptionsOpen(false)
  }

  const handleUpdateShortcut = () => {
    setIsOptionsOpen(false)
    setPopup({
      isOpen: true,
      children: (
        <AddShortCutPopup index={index} updateName={name} updateUrl={url} />
      ),
    })
  }

  return (
    <div
      className="flex flex-col items-center relative px-6 py-3 mx-1 mb-2 rounded hover:bg-[#141414] max-w-[160px]"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {isHover && (
        <button
          className="absolute right-5 top-1 w-1 h-1 rounded-full"
          onClick={() => {
            setIsOptionsOpen(!isOptionsOpen)
          }}
        >
          <span className="material-icons text-white text-xl">more_vert</span>
        </button>
      )}

      {isOptionsOpen && isHover && (
        <div className="absolute left-0 z-30 flex flex-col items-start bg-[#141414] py-1 rounded">
          <button
            className="text-white text-sm py-2 px-4 min-w-[200px] text-left hover:bg-[#222222]"
            onClick={handleUpdateShortcut}
          >
            Edit
          </button>
          <button
            className="text-white text-sm py-2 px-4 min-w-[200px] text-left hover:bg-[#222222]"
            onClick={() => handleDeleteShortcut(index)}
          >
            Delete
          </button>
        </div>
      )}

      <a
        href={url && url}
        className="flex items-center justify-center w-[60px] h-[60px] rounded-full border border-[#545454] overflow-hidden bg-[#141414]"
      >
        {!isImgError ? (
          <img
            className=""
            onError={() => {
              setIsImgError(true)
            }}
            src={`${url && s2ServerUrl + url}&size=50`}
            alt="google"
          />
        ) : (
          <div>{name.slice(0, 1)}</div>
        )}
      </a>
      <a
        href={url && url}
        className="block mt-2 text-white font-normal text-sm text-ellipsis overflow-hidden w-full text-center"
      >
        {name || url.replace(/(^\w+:|^)\/\//, '')}
      </a>
    </div>
  )
}

const AddShortCutPopup = ({ index, updateName, updateUrl }) => {
  const [, setPopup] = useContext(PopupContext)
  const [data, setData] = useContext(DataContext)

  const [name, setName] = useState(updateName || '')
  const [url, setUrl] = useState(updateUrl || '')

  const handleAddShortcut = (e) => {
    e.preventDefault()

    setData((p) => ({
      ...p,
      shortcuts: [...p.shortcuts, { name: name.trim(), url: url.trim() }],
    }))

    setPopup({ isOpen: false })
  }

  const handleUpdateShortcut = (e) => {
    e.preventDefault()

    let updatedData = data.shortcuts
    updatedData[index] = { name, url }

    setData((p) => ({
      ...p,
      shortcuts: [...updatedData],
    }))

    setPopup({ isOpen: false })
  }

  return (
    <form
      onSubmit={updateUrl ? handleUpdateShortcut : handleAddShortcut}
      className="w-full min-w-[400px] max-w-md mx-auto absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-[#141414] px-3 py-4 rounded shadow-md"
    >
      <h2 className="text-white text-lg">Add shortcut</h2>
      <div className="flex flex-col mt-3">
        <label htmlFor="name" className="text-white text-sm">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="px-2 py-3 text-white bg-[#0e0e0e] rounded mt-1 outline-none"
          onChange={(e) => setName(e.target.value)}
          defaultValue={name}
        />
      </div>
      <div className="flex flex-col mt-3">
        <label htmlFor="url" className="text-white text-sm">
          URL
        </label>
        <input
          type="url"
          name="url"
          id="url"
          className="px-2 py-3 text-white bg-[#0e0e0e] rounded mt-1 outline-none"
          onChange={(e) => setUrl(e.target.value)}
          defaultValue={url}
          required
        />
      </div>
      <div className="flex justify-end mt-5">
        <button
          type="button"
          className="relative px-4 py-3 text-white bg-[#0e0e0e] rounded mr-4 outline-none after:absolute after:left-0 after:top-0 after:w-full after:h-full after:border after:border-gray-600 after:rounded"
          onClick={() => {
            setPopup({ isOpen: false })
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-3 text-white rounded outline-none bg-blue-700 disabled:opacity-80"
          disabled={!url}
        >
          Done
        </button>
      </div>
    </form>
  )
}

export const AddHeroShortCut = ({ name, url }) => {
  const [, setPopup] = useContext(PopupContext)

  return (
    <>
      <div className="flex flex-col items-center px-6 py-3 mx-1 mb-2 rounded">
        <button
          className="w-[60px] h-[60px] flex flex-col justify-center items-center rounded-full border border-[#545454] overflow-hidden bg-[#141414]"
          onClick={() =>
            setPopup((p) => ({
              ...p,
              isOpen: true,
              children: <AddShortCutPopup />,
            }))
          }
        >
          <span className="text-white material-symbols-outlined">add</span>
        </button>
        <span className="block mt-2 text-white font-normal text-sm">
          Add Shortcut
        </span>
      </div>
    </>
  )
}

export const NextViewShortCut = () => {
  const [settings, setSettings] = useContext(SettingsContext)

  const NextViewBtnRef = useRef()

  useKeyboardShortcut(
    ['Control', 'Y'],
    () => {
      NextViewBtnRef.current.click()
    },
    {
      overrideSystem: false,
      ignoreInputFields: false,
      repeatOnHold: false,
    }
  )

  return (
    <button
      className={`flex p-4 rounded-full bg-[#141414] ${
        settings.currentView !== 0 ? 'rotate-180' : 'rotate-0'
      } `}
      onClick={() => {
        setSettings((p) => ({
          ...settings,
          currentView: settings.currentView ? 0 : 1,
        }))
      }}
      ref={NextViewBtnRef}
    >
      <span className="material-symbols-outlined text-white">
        arrow_forward_ios
      </span>
    </button>
  )
}
