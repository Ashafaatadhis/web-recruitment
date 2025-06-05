"use client";

import { useEffect, useState } from "react";
import { lexicalToHtml } from "@/lib/utils/lexical-to-html";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

export default function JobRichTextViewer({
  serialized,
}: {
  serialized: string | SerializedEditorState<SerializedLexicalNode>;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!serialized) return;

    let parsed: SerializedEditorState<SerializedLexicalNode>;
    try {
      parsed =
        typeof serialized === "string" ? JSON.parse(serialized) : serialized;
    } catch {
      setHtml("<p>Invalid JSON</p>");
      return;
    }

    const htmlResult = lexicalToHtml(parsed);
    setHtml(htmlResult || "<p>(No HTML generated)</p>");
  }, [serialized]);

  return (
    <div
      className="lexical-content prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
