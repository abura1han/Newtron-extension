import { Resizable } from 're-resizable'
import { useState, useEffect, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { StatusBar } from './Status'
import { Editor as DraftEditor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { DataContext, EditorContext } from '../../context/GlobalContext'
import NotesIcon from '../../assets/icons/notes.svg'
import TodosIcon from '../../assets/icons/todos.svg'
import AddIcon from '../../assets/icons/add.svg'

const SidebarIcons = ['', NotesIcon, TodosIcon]

export const Editor = () => {
  const [editor, setEditor] = useContext(EditorContext)

  return (
    <div className="overflow-hidden flex w-screen h-screen items-end">
      <Resizable
        className="z-40"
        size={{ width: '100vw', height: editor.editorHeight }}
        defaultSize={{ height: editor.editorHeight }}
        maxHeight={'100vh'}
        minHeight={25}
        maxWidth={'100vw'}
        minWidth={'100vw'}
        onResizeStop={(e, direction, ref, d) => {
          setEditor((p) => ({
            ...p,
            editorHeight: editor.editorHeight + d.height,
          }))
        }}
      >
        {/* Editor wrapper */}
        <div className="flex left-0 bottom-0 w-full h-full border-t border-t-[#3C3C3C] overflow-hidden">
          <SideBar />
          <ContentEditor />
        </div>
      </Resizable>
      <StatusBar />
    </div>
  )
}

const SideBar = () => {
  const [data, setData] = useContext(DataContext)
  const [editor, setEditor] = useContext(EditorContext)

  const handleAddItem = (sectionName) => {
    setData((p) => ({
      ...p,
      [sectionName]: [
        ...p[sectionName],
        {
          id: uuidv4(),
          title: `Untitled ${sectionName.slice(0, -1)}`,
          content: '',
          isOpened: false,
        },
      ],
    }))
  }

  const handleCollapse = (sectionName) => {
    setEditor((p) => ({
      ...p,
      expandedGroups: {
        ...p.expandedGroups,
        [sectionName]: !p.expandedGroups[sectionName],
      },
    }))
  }

  useEffect(() => {
    if (editor.activeTab?.section)
      setEditor((p) => ({
        ...p,
        expandedGroups: {
          ...p.expandedGroups,
          [editor.activeTab.section]: true,
        },
      }))
  }, [editor.activeTab, setEditor])

  return (
    <div className="w-[300px] h-full flex flex-col select-none overflow-auto border-r border-r-[#545454] bg-[#141414]">
      {Object.keys(data).map(
        (e, i) =>
          e !== 'shortcuts' && (
            <div className="last:mb-5" key={i}>
              <div
                className={`flex items-center justify-start pl-4 pr-2 py-2 border-b border-b-[#545454] ${
                  editor.activeTab?.section === e
                    ? 'bg-[#141414]'
                    : 'bg-[#242424]'
                }
`}
              >
                <button className="flex items-center justify-center">
                  {/* <span className="material-icons text-[#7D7D7D] text-[17px]">
                    summarize
                  </span> */}
                  <img src={SidebarIcons[i]} alt={e} />
                </button>
                <button
                  className="flex-1 flex items-center text-white"
                  onClick={() => handleCollapse(e)}
                >
                  <div className="ml-2 text-[15px] font-normal capitalize">
                    {e}
                  </div>
                  <span
                    className={`material-icons text-white text-base ml-3 ${
                      editor?.expandedGroups[e] && 'rotate-180'
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>
                <button
                  className="flex items-center"
                  onClick={() => handleAddItem(e)}
                >
                  {/* <span className="material-icons text-white">add</span> */}
                  <img src={AddIcon} alt={'add'} />
                </button>
              </div>
              {editor?.expandedGroups[e] && (
                <div className="my-2">
                  {data[e].map((f, i) => (
                    <SideBarTab
                      key={i}
                      id={f.id}
                      title={f.title}
                      isOpened={f.isOpened}
                      sectionName={e}
                    />
                  ))}
                </div>
              )}
            </div>
          )
      )}
    </div>
  )
}

const SideBarTab = ({ id, title, sectionName, isOpened }) => {
  const [data, setData] = useContext(DataContext)
  const [editor, setEditor] = useContext(EditorContext)
  const [isHovered, setIsHovered] = useState(false)

  const handleOpenInTab = (id) => {
    let editedData = data[sectionName]
    const index = editedData.findIndex((e) => e.id === id)

    editedData[index].isOpened = true

    setData((p) => ({ ...p, [sectionName]: [...editedData] }))

    setEditor((p) => ({ ...p, activeTab: { id, section: sectionName } }))
  }

  return (
    <div
      className={`flex justify-between items-center text-white text-sm pl-6 pr-2 py-2  hover:bg-[#242424] ${
        isOpened && 'bg-[#242424]'
      } capitalize`}
      onClick={() => handleOpenInTab(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${
          editor.activeTab.id === id ? 'font-medium' : 'font-light'
        }`}
      >
        {title}
      </div>
      <div className={`${isHovered ? 'visible' : 'invisible'}`}>
        <span className="material-icons text-lg">delete</span>
      </div>
    </div>
  )
}

const EditorOpenedTabs = () => {
  const [data, setData] = useContext(DataContext)
  const [editor, setEditor] = useContext(EditorContext)
  const [openedTabs, setOpenedTabs] = useState([])

  const handleActiveTab = (id, section) => {
    setEditor((p) => ({ ...p, activeTab: { id: id, section } }))
  }

  const handleCloseTab = (id, sectionName) => {
    let editedData = data[sectionName]
    const index = editedData.findIndex((e) => e.id === id)

    editedData[index].isOpened = false

    setData((p) => ({ ...p, [sectionName]: [...editedData] }))
    // setOpenedTabs([...openedTabs.filter((f) => f.id !== id)])

    let newTabStates = Object.keys(data).map((e, i) => {
      const opened = data[e].map((f) =>
        f.isOpened ? { ...f, section: e } : false
      )
      return opened
    })

    newTabStates = newTabStates.flat().filter((e) => e)

    setOpenedTabs([...newTabStates])

    setEditor((p) => ({
      ...p,
      activeTab: {
        id:
          newTabStates.length > 0
            ? newTabStates[newTabStates.length - 1].id
            : '',
        section:
          newTabStates.length > 0
            ? newTabStates[newTabStates.length - 1].section
            : '',
      },
    }))
  }

  useEffect(() => {
    const tabElem = document.querySelector(
      `[data-tabid="${editor?.activeTab?.id}"]`
    )

    if (tabElem) tabElem.scrollIntoView({ behavior: 'smooth' })
  }, [editor])

  useEffect(() => {
    const tabs = Object.keys(data).map((e, i) => {
      const opened = data[e].map((f) =>
        f.isOpened ? { ...f, section: e } : false
      )
      return opened
    })

    setOpenedTabs([...tabs.flat().filter((e) => e)])
  }, [data])

  return (
    <div className="sticky top-0 right-0 z-50 flex items-center justify-start w-full bg-[#141414] border-b border-b-[#343434] select-none overflow-x-auto">
      {openedTabs?.map(
        (e, i) =>
          e && (
            <div
              key={i}
              data-tabid={e.id}
              className={`flex items-center justify-between px-3 py-2 w-full min-w-[200px] max-w-[300px] ${
                editor.activeTab.id === e.id ? 'bg-[#1C1B1B]' : 'bg-[#141414]'
              } border-x border-x-[#242424] cursor-pointer`}
            >
              <div
                className={`text-gray-200 text-ellipsis text-[15px] whitespace-nowrap w-full overflow-hidden ${
                  editor.activeTab.id === e.id ? 'font-medium' : 'font-light'
                }`}
                onClick={() => handleActiveTab(e.id, e.section)}
              >
                {e?.title}
              </div>
              <button
                className="flex items-center justify-center ml-5"
                onClick={() => {
                  handleCloseTab(e.id, e.section, openedTabs)
                }}
              >
                <span className="material-icons text-white text-[16px]">
                  close
                </span>
              </button>
            </div>
          )
      )}
    </div>
  )
}

const EditAction = () => {
  const [content, setContent] = useState(EditorState.createEmpty())

  return (
    <div className="w-full h-max min-h-full px-5 bg-[#141414] text-white overflow-auto">
      <DraftEditor onChange={(e) => setContent(e)} editorState={content} />
    </div>
  )
}

const ContentEditor = () => {
  return (
    <div className="flex-1 w-full overflow-auto">
      <EditorOpenedTabs />
      <EditAction />
    </div>
  )
}
