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
    if (Object.keys(settings).length !== 0) {
      storage.setItem('Newtron-settings', JSON.stringify(settings))
    }
  }, [settings, storage])

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      storage.setItem('Newtron-storage', JSON.stringify(data))
    }
  }, [data, storage])

  useEffect(() => {
    if (Object.keys(editor).length !== 0) {
      storage.setItem('Newtron-editor', JSON.stringify(editor))
    }
  }, [editor, storage])

  return <>{children && children}</>
}

export default DataSync
