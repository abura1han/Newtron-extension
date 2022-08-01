import { Resizable } from 're-resizable'
import { useState, useEffect, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { v4 as uuidv4 } from 'uuid'
import { StatusBar } from './Status'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { DataContext, EditorContext } from '../../context/GlobalContext'
import NotesIcon from '../../assets/icons/notes.svg'
import TodosIcon from '../../assets/icons/todos.svg'
import AddIcon from '../../assets/icons/add.svg'
import CheckIcon from '../../assets/icons/check.svg'
import TrashIcon from '../../assets/icons/trash.svg'
import CloseIcon from '../../assets/icons/close.svg'

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
        sectionName === 'notes'
          ? {
              id: uuidv4(),
              title: `Untitled ${sectionName.slice(0, -1)}`,
              content: '',
              isOpened: false,
            }
          : {
              id: uuidv4(),
              title: `Untitled ${sectionName.slice(0, -1)}`,
              todos: [],
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

  const handleDeleteItem = () => {
    handleCloseTab(id, sectionName)
    setData((p) => ({
      ...p,
      [sectionName]: p[sectionName].filter((e) => e.id !== id),
    }))
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

  return (
    <div
      className={`flex justify-between items-center text-white text-sm pl-6 pr-2 hover:bg-[#242424] ${
        isOpened && 'bg-[#242424]'
      } capitalize`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex-1 py-3 ${
          editor.activeTab.id === id ? 'font-medium' : 'font-light'
        }`}
        onClick={() => handleOpenInTab(id)}
      >
        {title}
      </div>
      <button
        className={`${isHovered ? 'visible' : 'invisible'}`}
        onClick={handleDeleteItem}
      >
        <img src={TrashIcon} alt="Delete" />
      </button>
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

  // scroll to selected tab
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
              className={`flex items-center justify-between px-3 w-full min-w-[200px] max-w-[300px] ${
                editor.activeTab.id === e.id ? 'bg-[#1C1B1B]' : 'bg-[#141414]'
              } border-x border-x-[#242424] cursor-pointer`}
            >
              <div
                className={`text-gray-200 text-ellipsis text-[15px] whitespace-nowrap w-full py-3 overflow-hidden ${
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

const ContentEditor = () => {
  const [editor] = useContext(EditorContext)

  return (
    <div className="flex-1 w-full overflow-auto bg-[#141414]">
      <EditorOpenedTabs />
      {editor.activeTab?.id ? (
        <EditAction
          group={editor.activeTab?.section}
          id={editor.activeTab?.id}
        />
      ) : (
        <EditorBlankScreen />
      )}
    </div>
  )
}

const EditAction = ({ id, group }) => {
  const [editor] = useContext(EditorContext)
  const [data] = useContext(DataContext)

  const item = data[group].find((e) => e.id === id)

  return (
    <div>
      <div className="pt-10 md:px-10 px-6">
        <ItemTitle defaultValue={item?.title || ''} id={id} group={group} />
        {editor.activeTab.section === 'notes' ? (
          <MarkdownEditor id={id} group={group} />
        ) : (
          editor.activeTab.section === 'todos' && (
            <TodoEditor id={id} group={group} />
          )
        )}
      </div>
    </div>
  )
}

const ItemTitle = ({ id, group }) => {
  const [title, setTitle] = useState('')

  const [data, setData] = useContext(DataContext)

  // Updata title
  const handleUpdateTitle = (e) => {
    if (e.key === 'Enter') {
      if (!title) return

      const section = data[group]
      const index = section.findIndex((e) => e.id === id)
      section[index].title = title

      setData((p) => ({ ...p, [group]: section }))
    }
  }

  // Get title
  useEffect(() => {
    const findTitle = data[group].find((e) => e.id === id)
    setTitle(findTitle?.title)
  }, [data, group, id])

  return (
    <input
      className="w-full px-3 py-3 bg-transparent text-xl outline-none text-white bg-black rounded"
      type={'text'}
      placeholder={'Enter a title...'}
      value={
        title === 'Untitled todo' || title === 'Untitled note' ? '' : title
      }
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={handleUpdateTitle}
    />
  )
}

const EditorBlankScreen = () => {
  return (
    <div className="flex items-end justify-center h-72">
      <div className="font-bold text-3xl text-white">Newtron</div>
    </div>
  )
}

const MarkdownEditor = ({ id, group }) => {
  const [data, setData] = useContext(DataContext)

  const [content, setContent] = useState('')

  // Get content
  useEffect(() => {
    const findContent = data[group].find((e) => e.id === id)
    setContent(findContent?.content)
  }, [data, group, id])

  const handleAddContent = (e) => {
    if (!content) return
    const findGroup = data[group]
    const index = findGroup.findIndex((e) => e.id === id)
    findGroup[index].content = content

    setData((p) => ({ ...p, [group]: findGroup }))
  }

  return (
    <div className="flex newtron-editor h-full">
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="w-full h-[calc(100% - 400px)] text-white bg-transparent outline-none px-5 mt-10 border-r border-r-black"
        placeholder="Start writing here"
        onKeyUp={handleAddContent}
        rows={30}
      />
      <ReactMarkdown
        className="w-full text-white bg-transparent outline-none px-5 mt-10"
        children={content}
        remarkPlugins={[remarkGfm]}
      />
    </div>
  )
}

const TodoEditor = ({ id, group }) => {
  const [data, setData] = useContext(DataContext)

  const [todos, setTodos] = useState([])

  // Get todo
  useEffect(() => {
    const findTodo = data[group].find((e) => e.id === id)
    setTodos(findTodo?.todos)
  }, [data, group, id])

  const handleCompleteTodo = (i) => {
    const allTodos = data.todos
    const index = data[group].findIndex((e) => e.id === id)
    allTodos[index].todos[i].isCompleted = !allTodos[index].todos[i].isCompleted

    setData((p) => ({ ...p, todos: allTodos }))
  }

  const handleDeleteTodo = (i) => {
    const allTodos = data.todos
    const index = data[group].findIndex((e) => e.id === id)
    allTodos[index].todos = allTodos[index].todos.filter(
      (e, index) => index !== i
    )

    setData((p) => ({ ...p, todos: allTodos }))
  }

  return (
    <div>
      {/* Todo list */}
      <div className="mt-10">
        <h2 className="text-white font-bold text-xl">Todos</h2>
        {todos?.map((e, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-2 py-2 my-2 bg-black rounded"
          >
            <div
              className={`text-white ${e.isCompleted && 'italic opacity-80'}`}
            >
              {e?.content}
            </div>
            <div className="text-white">
              <button
                className="px-1 py-2 mx-2"
                onClick={() => handleCompleteTodo(i)}
              >
                <img src={CheckIcon} alt="complete" />
              </button>
              <button
                className="px-1 py-2 mx-2"
                onClick={() => handleDeleteTodo(i)}
              >
                <img src={CloseIcon} alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-10 w-full max-w-[800px]">
        <AddTodo id={id} group={group} />
      </div>
    </div>
  )
}

const AddTodo = ({ id, group }) => {
  const [data, setData] = useContext(DataContext)
  const [todo, setTodo] = useState({ content: '', isCompleted: false })

  const handleAddTodo = (e) => {
    if (e.key === 'Enter') {
      if (!todo) return

      const findGroup = data[group]
      const index = findGroup.findIndex((e) => e.id === id)
      findGroup[index].todos = [...findGroup[index].todos, todo]

      setData((p) => ({ ...p, todos: findGroup }))

      setTodo({ content: '', isCompleted: false })
    }
  }

  return (
    <input
      type={'text'}
      placeholder={'Enter todo here'}
      className={'w-full px-4 py-3 rounded'}
      onChange={(e) => setTodo({ content: e.target.value, isCompleted: false })}
      value={todo.content}
      onKeyUp={handleAddTodo}
    />
  )
}
