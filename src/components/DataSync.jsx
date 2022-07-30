import React, { useContext, useEffect } from 'react'
import {
  DataContext,
  EditorContext,
  SettingsContext,
} from '../context/GlobalContext'

// Sync all updated data
const DataSync = ({ children }) => {
  const [settings] = useContext(SettingsContext)
  const [data] = useContext(DataContext)
  const [editor] = useContext(EditorContext)

  const storage = window.localStorage

  useEffect(() => {
    console.log(settings)

    if (Object.keys(settings).length !== 0) {
      storage.setItem('Newtron-settings', JSON.stringify(settings))
    }
  }, [settings, storage])

  useEffect(() => {
    console.log(data)

    if (Object.keys(data).length !== 0) {
      storage.setItem('Newtron-storage', JSON.stringify(data))
    }
  }, [data, storage])

  useEffect(() => {
    console.log(editor)

    if (Object.keys(editor).length !== 0) {
      storage.setItem('Newtron-editor', JSON.stringify(editor))
    }
  }, [editor, storage])

  return <>{children && children}</>
}

export default DataSync
