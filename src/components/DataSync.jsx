import React, { useContext, useEffect } from 'react'
import { DataContext, SettingsContext } from '../context/GlobalContext'

const DataSync = ({ children }) => {
  const [settings] = useContext(SettingsContext)
  const [data] = useContext(DataContext)

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

  return <>{children && children}</>
}

export default DataSync
