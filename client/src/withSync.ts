import { Editor, Operation } from "slate"

/**
 * The on-the-wire representations of a remote operations
 */
interface BaseOp {
  clientId: string  // The original sender's ID
}

interface EditorOp extends BaseOp {
  type: "editor-operation"  // The type of this op (used for type narrowing)
  op: string                // Serialized Slate operation
}

type RemoteOp = EditorOp   // | ... | ...

/**
 * A simple Slate plugin for syncing remote editors
 * 
 * Forwards native Slate operations, without any transformation,
 * which is simple but also very fragile
 */
export const withSync = (e: Editor) => {
  const id = "" + Date.now()

  let socket: WebSocket | undefined
  let isRemote = false

  e.connect = () => {
    console.log("Trying to open a connection...")
    socket = new WebSocket(
      "ws://localhost:4040/socketserver",
      "protocolOne",
    )

    socket.onerror = console.log

    socket.onopen = () => {
      console.log("Connection established...")
    }

    // On receipt of a remote operation...
    socket.onmessage = event => {
      const msg = JSON.parse(event.data) as RemoteOp
      switch (msg.type) {
        case "editor-operation":
          if (msg.clientId !== id) {
            // Apply this operation locally
            isRemote = true
            e.apply(JSON.parse(msg.op) as Operation)
            isRemote = false
          }
          break;
      }
    }
  }

  e.disconnect = () => {
    console.log("Closing the connection...")
    socket?.close()
  }

  const { apply } = e

  // The apply method is called for each operation
  // This syntax might seem a little strange, but
  // this is the way to extend apply
  e.apply = op => {
    if (isRemote) {
      // This call was triggered by applying a remote op
      // --> do not emit (no need to apply twice)
    } else {
      // A new local op --> send
      // Send this operation to the remote
      // (exclude selection operations (i.e. cursor movements))
      if (Operation.isNodeOperation(op) || Operation.isTextOperation(op)) {
        const remoteOp: EditorOp = {
          type: "editor-operation",
          clientId: id,
          op: JSON.stringify(op),
        }

        socket?.send(JSON.stringify(remoteOp))
      }
    }

    apply(op)
  }

  return e
}
