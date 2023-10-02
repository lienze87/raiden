import type { EditorState } from "lexical";
import { useState, useRef } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import "./main.css";

const theme = {
  fontSize: "16px",
};

function onError(error: Error) {
  console.error(error);
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>;
}

function MyEditor() {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState();

  const initialConfig = {
    editorState: editorState,
    namespace: "MyEditor",
    theme,
    onError,
  };

  function handleChange(state: EditorState) {
    state.read(() => {
      const root = state._nodeMap.get("root");
      const selection = state._selection?.getTextContent();
    });

    const editorStateJSON = state.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={handleChange} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}

export default MyEditor;
