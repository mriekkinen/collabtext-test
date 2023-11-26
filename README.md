# collabtext-test

![screenshot](screenshot.png)

A few details:

- Uses Slate as a text editing component (https://docs.slatejs.org/)
- Chosen because it advertises a "Collaboration-ready data model", so thought that it might be simpler to set it up (listening for editor ops vs. diffing the contents)
- Sends native Slate operations to a WebSockets server, which then broadcasts them to other clients
- In a proper implementation, that bit would be replaced by a CRDT-based scheme
