import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"

export type RemoteEditor = BaseEditor & ReactEditor & {
  connect(): void,
  disconnect(): void,
}

export type ParagraphElement = {
  type: "paragraph"
  children: CustomText[]
}

export type CustomElement = ParagraphElement // | ... | ...
export type CustomText = { text: string }

declare module "slate" {
  interface CustomTypes {
    Editor: RemoteEditor
    Element: CustomElement
    Text: CustomText
  }
}
