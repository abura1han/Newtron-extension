import './App.css'
import { useEffect, useState } from 'react'
import { Branding, BrandProfile, Clock } from './components/Branding'
import { Editor } from './components/editor/Editor'
import { HeroSearch } from './components/Input'
import { HeroShortCut, NextViewShortCut } from './components/Shortcuts'
import { Profile } from './components/User'
import {
  DataContext,
  EditorContext,
  PopupContext,
  SettingsContext,
  UserContext,
} from './context/GlobalContext'
import DataSync from './components/DataSync'
import { Popup } from './components/Popup'

const Newtron_SETTINGS = {
  editorTheme: 'Key Dark',
  editorHeight: 25,
  currentView: 0,
}

const Newtron_EDITOR = {
  activeTab: { id: '', section: '' },
  editorHeight: 25,
  expandedGroups: {},
}

const Newtron_DATA = {
  shortcuts: [],
  notes: [],
  todos: [],
}

function App() {
  // Storage for all contexts
  const [data, setData] = useState([])
  const [user, setUser] = useState({})
  const [settings, setSettings] = useState({})
  const [popup, setPopup] = useState({ isOpen: false, children: <></> })
  const [editor, setEditor] = useState({})

  const [isUserInteracted, setIsUserInteracted] = useState(0)

  const storage = window.localStorage

  // Handle local data
  useEffect(() => {
    if (!storage.getItem('Newtron-storage')) {
      storage.setItem('Newtron-storage', JSON.stringify(Newtron_DATA))
      setData(Newtron_DATA)

      console.log('Storage setuped')
    } else {
      const dataFromLocal = storage.getItem('Newtron-storage')
      setData(JSON.parse(dataFromLocal))

      console.log('Reading data from existings')
    }

    // Settings
    if (!storage.getItem('Newtron-settings')) {
      storage.setItem('Newtron-settings', JSON.stringify(Newtron_SETTINGS))
      setSettings(Newtron_SETTINGS)

      console.log('Settings installed ✅')
    } else {
      const settingsFromLocal = storage.getItem('Newtron-settings')
      setSettings(JSON.parse(settingsFromLocal))

      console.log('Reading settings from existings')
    }

    // Settings
    if (!storage.getItem('Newtron-editor')) {
      storage.setItem('Newtron-editor', JSON.stringify(Newtron_EDITOR))
      setEditor(Newtron_EDITOR)

      console.log('Editor installed ✅')
    } else {
      const editorFromLocal = storage.getItem('Newtron-editor')
      setEditor(JSON.parse(editorFromLocal))

      console.log('Reading editor from existings')
    }
  }, [storage])

  useEffect(() => {
    window.addEventListener('click', () => {
      setIsUserInteracted((p) => p + 1)
    })

    return () => {
      window.removeEventListener('click', () => {
        setIsUserInteracted((p) => p)
      })
    }
  }, [])

  return (
    <PopupContext.Provider value={[popup, setPopup]}>
      <UserContext.Provider value={[user, setUser]}>
        <SettingsContext.Provider value={[settings, setSettings]}>
          <EditorContext.Provider value={[editor, setEditor]}>
            <DataContext.Provider value={[data, setData]}>
              <DataSync>
                <div className="App">
                  {popup.isOpen && (
                    <Popup>{popup.children && popup.children}</Popup>
                  )}

                  {/* Top absolute section */}
                  <div className="fixed w-full top-5 flex justify-between px-5 left-0 z-20">
                    <di></di>
                    <Profile />
                  </div>

                  {/* Action area */}
                  <div
                    className={`w-full max-w-[800px] fixed top-2/4 left-2/4 ${
                      settings.currentView
                        ? '-translate-x-[600%]'
                        : '-translate-x-2/4'
                    } -translate-y-2/3 flex flex-col items-center justify-center flex-wrap ${
                      isUserInteracted ? 'transition-all' : ''
                    }`}
                  >
                    {/* Branding */}
                    <Branding />

                    {/* Search box */}
                    <div className="w-full">
                      {settings.currentView === 0 && <HeroSearch />}
                    </div>

                    {/* Shortcuts */}
                    <HeroShortCut />
                  </div>

                  {/* Action area */}
                  <div
                    className={`w-full max-w-[800px] fixed top-1/3 left-2/4 ${
                      !settings.currentView
                        ? 'translate-x-[600%]'
                        : '-translate-x-2/4'
                    } -translate-y-2/3 flex flex-col items-center justify-center flex-wrap ${
                      isUserInteracted ? 'transition-all' : ''
                    }`}
                  >
                    <Clock />

                    {/* Search box */}
                    <div className="w-full mt-16">
                      {settings.currentView === 1 && <HeroSearch />}
                    </div>
                  </div>

                  <div className="fixed bottom-11 right-5">
                    <NextViewShortCut />
                  </div>

                  {/* Editor */}
                  <Editor />
                </div>
              </DataSync>
            </DataContext.Provider>
          </EditorContext.Provider>
        </SettingsContext.Provider>
      </UserContext.Provider>
    </PopupContext.Provider>
  )
}

export default App
