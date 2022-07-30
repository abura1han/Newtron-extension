import { Resizable } from 're-resizable'
import { useState, useEffect, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { StatusBar } from './Status'
import { Editor as DraftEditor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { DataContext, EditorContext } from '../../context/GlobalContext'

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
  const [collapse, setCollapse] = useState({})

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
    setCollapse((p) => ({ ...p, [sectionName]: !p[sectionName] }))
  }

  const handleOpenInTab = (sectionName, id) => {
    let editedData = data[sectionName]
    const index = editedData.findIndex((e) => e.id === id)

    editedData[index].isOpened = true

    setData((p) => ({ ...p, [sectionName]: [...editedData] }))
  }

  return (
    <div className="w-[300px] h-full flex flex-col select-none overflow-auto border-r border-r-[#545454] bg-[#141414]">
      {Object.keys(data).map(
        (e, i) =>
          e !== 'shortcuts' && (
            <div className="last:mb-5">
              <div
                key={i}
                className={`flex items-center justify-start pl-4 pr-2 py-2 border-b border-b-[#545454] bg-[${
                  i === 0 ? '#141414' : '#242424'
                }]`}
              >
                <button className="flex items-center justify-center">
                  <span className="material-icons text-[#7D7D7D] text-[17px]">
                    summarize
                  </span>
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
                      collapse[e] && 'rotate-180'
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>
                <button
                  className="flex items-center"
                  onClick={() => handleAddItem(e)}
                >
                  <span className="material-icons text-white">add</span>
                </button>
              </div>
              {collapse[e] && (
                <div className="my-2">
                  {data[e].map((f, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center text-white text-sm pl-6 pr-2 py-2 hover:bg-[#242424] ${
                        f.isOpened && 'bg-[#242424]'
                      } capitalize`}
                      onClick={() => handleOpenInTab(e, f.id)}
                    >
                      <div className="font-light">{f?.title}</div>
                      <div>
                        <span className="material-icons text-lg">delete</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
      )}
    </div>
  )
}

const EditorOpenedTabs = () => {
  const [data, setData] = useContext(DataContext)
  const [openedTabs, setOpenedTabs] = useState([])

  useEffect(() => {
    const tabs = Object.keys(data).map((e, i) => {
      const opened = data[e].filter((f) => f.isOpened)
      return opened
    })

    console.log(tabs)

    setOpenedTabs([...tabs.flat()])
  }, [data])

  const handleActiveTab = (id) => {}

  return (
    <div className="sticky top-0 right-0 z-50 flex items-center justify-start w-full bg-[#141414] border-b border-b-[#343434] select-none overflow-x-auto">
      {openedTabs?.map((e, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-3 py-2 w-full min-w-[200px] max-w-[300px] bg-[${
            e.active ? '#1C1B1B' : '#141414'
          }] cursor-pointer`}
          onClick={() => handleActiveTab(e.id)}
        >
          <div
            className={`text-gray-200 text-ellipsis text-[15px] whitespace-nowrap w-full overflow-hidden font-light`}
          >
            {e?.title}
          </div>
          <div className="flex items-center justify-center ml-5">
            <span className="material-icons text-white text-[16px]">close</span>
          </div>
        </div>
      ))}
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
