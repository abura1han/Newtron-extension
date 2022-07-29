import React from 'react'

const Newtron_SETTINGS = {
  editorTheme: 'Key Dark',
  editorHeight: 25,
  currentView: 0,
}

const Newtron_DATA = {
  shortcuts: [],
  notes: [],
  todos: [],
  links: [],
}

const DataContext = React.createContext(Newtron_DATA)
const UserContext = React.createContext(null)
const PopupContext = React.createContext(null)
const EditorContext = React.createContext(null)

const SettingsContext = React.createContext(Newtron_SETTINGS)

export {
  DataContext,
  SettingsContext,
  UserContext,
  PopupContext,
  EditorContext,
}
