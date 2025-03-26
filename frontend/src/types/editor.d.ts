import { EditorState } from "draft-js";

export interface EditorProps {
  draftId?: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  onSaveToDrive?: (content: string) => void;
  readOnly?: boolean;
}

export interface EditorToolbarProps {
  editorState: EditorState;
  onToggle: (inlineStyle: string) => void;
  onSave?: () => void;
  onSaveToDrive?: () => void;
}