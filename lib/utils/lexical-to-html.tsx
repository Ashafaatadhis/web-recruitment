import {
  createEditor,
  SerializedEditorState,
  SerializedLexicalNode,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
// Import the table plugin
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
// Import list nodes
import { ListNode, ListItemNode } from "@lexical/list";

import { LinkNode, AutoLinkNode } from "@lexical/link";
import { HeadingNode } from "@lexical/rich-text";

// Use Lexical's built-in type for serialized state
export function lexicalToHtml(
  serializedState: SerializedEditorState<SerializedLexicalNode>
): string {
  // Only run in the browser
  if (typeof window === "undefined") {
    return "";
  }

  // Create editor with table nodes registered
  const editor = createEditor({
    nodes: [
      TableNode,
      TableCellNode,
      TableRowNode,
      ListNode,
      ListItemNode,
      HeadingNode,
      LinkNode,
      AutoLinkNode,
    ],
  });

  let html = "";

  try {
    // Set the editor state first
    const editorState = editor.parseEditorState(serializedState);
    editor.setEditorState(editorState);

    editor.update(() => {
      html = $generateHtmlFromNodes(editor);
    });
  } catch (error) {
    console.error("Error parsing Lexical content:", error);
    return "<p>Error rendering content</p>";
  }

  return html;
}
