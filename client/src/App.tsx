/**
 * A primitive text editor which syncs edits over a WebSockets connection
 * 
 * Loosely based on: "Real Time Data Sending with SocketIO"
 * https://youtu.be/9HFwJ9hrmls?feature=shared
 */

import React, { useEffect, useState } from "react"
import { createEditor, Descendant } from "slate"
import { Slate, Editable, withReact } from "slate-react"

import "./types"
import { withSync } from "./withSync"

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "" },
    ],
  },
]

const App = () => {
  // Create an editor, and apply two plugis:
  // - withSync: our plugin which adds remote syncing (see withSync.ts)
  // - withReact: adds React support
  const [editor] = useState(() => withReact(withSync(createEditor())))

  useEffect(() => {
    // Note: For some reason, this seems to be called twice
    editor.connect()

    return () => {
      editor.disconnect()
    }
  }, [editor])

  const editorStyle = {
    border: "1px solid black",
    maxWidth: 700,
    height: 250,
  }

  return (
    <>
      <p style={{ color: "gray" }}>
        <b>Instructions:</b> Open two windows, and enter some text below.
        The contents should sync between the windows.
        For this to work, the server needs to be running...
      </p>
      <div>Insert some text here...</div>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable style={editorStyle} />
      </Slate>
    </>
  )
}

export default App
