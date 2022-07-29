import { Resizable } from 're-resizable'
import { useState, useEffect, useRef } from 'react'
import { StatusBar } from './Status'
import { Editor as DraftEditor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'

export const Editor = () => {
  const [size, setSize] = useState({ height: 25 })

  return (
    <div className="overflow-hidden flex w-screen h-screen items-end">
      <Resizable
        className="z-40"
        size={{ width: '100vw', height: size.height }}
        maxHeight={'100vh'}
        minHeight={25}
        maxWidth={'100vw'}
        minWidth={'100vw'}
        onResizeStop={(e, direction, ref, d) => {
          setSize({ height: size.height + d.height })
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
  return (
    <div className="w-[300px] h-full flex flex-col select-none overflow-auto border-r border-r-[#545454] bg-[#141414]">
      {Array(10)
        .fill(1)
        .map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-start pl-4 pr-2 py-2 border-b border-b-[#545454] bg-[${
              i === 0 ? '#141414' : '#242424'
            }] last-of-type:mb-6`}
          >
            <button className="flex items-center">
              <span className="material-icons text-[#7D7D7D] text-[17px]">
                summarize
              </span>
            </button>
            <div className="flex-1 items-center text-white">
              <div className="ml-2 text-[15px] font-normal">Notes</div>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-white">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        ))}
    </div>
  )
}

const EditorOpenedTabs = () => {
  return (
    <div className="sticky top-0 right-0 z-50 flex items-center justify-start w-full bg-[#141414] border-b border-b-[#343434] select-none overflow-x-auto">
      <div
        className={`flex items-center justify-between px-3 py-2 w-full max-w-[200px] bg-[#141414] cursor-pointer`}
      >
        <div
          className={`text-white text-ellipsis text-[15px] whitespace-nowrap w-full overflow-hidden font-normal`}
        >
          Note 11
        </div>
        <div className="flex items-center justify-center ml-5">
          <span className="material-icons text-white text-[16px]">close</span>
        </div>
      </div>
      <div
        className={`flex items-center justify-between px-3 py-2 w-full max-w-[200px] bg-[#1C1B1B]`}
      >
        <div
          className={`text-white text-ellipsis text-[15px] whitespace-nowrap w-full overflow-hidden`}
        >
          Note 11
        </div>
        <div className="flex items-center justify-center ml-5">
          <span className="material-icons text-white text-[16px]">close</span>
        </div>
      </div>
      <div
        className={`flex items-center justify-between px-3 py-2 w-full max-w-[200px] bg-[#141414] cursor-pointer`}
      >
        <div
          className={`text-white text-ellipsis text-[15px] whitespace-nowrap w-full overflow-hidden font-normal`}
        >
          Note 11
        </div>
        <div className="flex items-center justify-center ml-5">
          <span className="material-icons text-white text-[16px]">close</span>
        </div>
      </div>
      <div
        className={`flex items-center justify-between px-3 py-2 w-full max-w-[200px] bg-[#141414] cursor-pointer`}
      >
        <div
          className={`text-white text-ellipsis text-[15px] whitespace-nowrap w-full overflow-hidden font-normal`}
        >
          Note 11
        </div>
        <div className="flex items-center justify-center ml-5">
          <span className="material-icons text-white text-[16px]">close</span>
        </div>
      </div>
    </div>
  )
}

const EditAction = () => {
  const [content, setContent] = useState(EditorState.createEmpty())

  return (
    <div className="w-full h-max min-h-full px-5 bg-[#141414] text-white overflow-auto">
      {/* <div
        className="mx-auto my-10 min-w-[500px] w-[80%] outline-none overflow-x-auto"
        contentEditable
        placeholder="Write down here"
      ></div> */}
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
