"use client";

import { useEffect, useRef } from "react";
import { markdown } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { basicSetup } from "codemirror";

import { inspectMarkdown } from "@/lib/editorial/markdown-policy";

const editorTheme = EditorView.theme({
  "&": {
    height: "36rem",
    border: "1px solid var(--border-color)",
    borderRadius: "0.5rem",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
  },
  "&.cm-focused": {
    outline: "2px solid var(--focus-color)",
    outlineOffset: "1px",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.5rem",
    overscrollBehavior: "contain",
  },
  ".cm-content": {
    caretColor: "var(--accent-color)",
    padding: "0.75rem 0",
  },
  ".cm-line": {
    padding: "0 0.75rem",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--accent-color)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, .cm-content ::selection":
    {
      backgroundColor:
        "color-mix(in srgb, var(--accent-color) 28%, transparent)",
    },
  ".cm-gutters": {
    borderRight: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-muted)",
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "color-mix(in srgb, var(--accent-color) 8%, transparent)",
  },
  ".cm-tooltip": {
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-elevated)",
    color: "var(--text-primary)",
  },
  ".cm-tooltip-lint": {
    fontFamily: "var(--font-body)",
  },
});

const markdownHighlightStyle = HighlightStyle.define([
  {
    tag: [
      tags.heading1,
      tags.heading2,
      tags.heading3,
      tags.heading4,
      tags.heading5,
      tags.heading6,
    ],
    color: "var(--accent-color)",
    fontWeight: "700",
  },
  { tag: tags.strong, color: "var(--text-primary)", fontWeight: "700" },
  { tag: tags.emphasis, color: "var(--text-secondary)", fontStyle: "italic" },
  {
    tag: [tags.link, tags.url],
    color: "var(--accent-color)",
    textDecoration: "underline",
  },
  {
    tag: tags.monospace,
    color: "var(--text-primary)",
    backgroundColor: "color-mix(in srgb, var(--accent-color) 10%, transparent)",
  },
  { tag: tags.quote, color: "var(--text-secondary)", fontStyle: "italic" },
  { tag: tags.contentSeparator, color: "var(--text-muted)" },
  { tag: tags.strikethrough, color: "var(--text-muted)" },
]);

function markdownDiagnostics(view: EditorView): Diagnostic[] {
  return inspectMarkdown(view.state.doc.toString()).map((issue) => {
    const lineNumber = Math.min(
      Math.max(issue.line ?? 1, 1),
      view.state.doc.lines,
    );
    const line = view.state.doc.line(lineNumber);
    return {
      from: line.from,
      to: line.to,
      severity: "error",
      source: "ShruggieTech Markdown",
      message: issue.message,
    };
  });
}

export default function MarkdownEditor({
  id,
  value,
  disabled,
  invalid,
  describedBy,
  onChange,
}: {
  id: string;
  value: string;
  disabled: boolean;
  invalid: boolean;
  describedBy: string;
  onChange: (value: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const readOnlyCompartmentRef = useRef(new Compartment());
  const attributesCompartmentRef = useRef(new Compartment());
  const initialPropsRef = useRef({ describedBy, disabled, id, invalid, value });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hostRef.current) return;
    const readOnlyCompartment = readOnlyCompartmentRef.current;
    const attributesCompartment = attributesCompartmentRef.current;
    const initial = initialPropsRef.current;
    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: initial.value,
        extensions: [
          basicSetup,
          markdown(),
          lintGutter(),
          linter(markdownDiagnostics, { delay: 200 }),
          syntaxHighlighting(markdownHighlightStyle),
          editorTheme,
          EditorView.lineWrapping,
          readOnlyCompartment.of([
            EditorState.readOnly.of(initial.disabled),
            EditorView.editable.of(!initial.disabled),
          ]),
          attributesCompartment.of(
            EditorView.contentAttributes.of({
              id: initial.id,
              "aria-label": "Article body in Markdown",
              "aria-describedby": initial.describedBy,
              "aria-invalid": String(initial.invalid),
              "aria-readonly": String(initial.disabled),
            }),
          ),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    });
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: readOnlyCompartmentRef.current.reconfigure([
        EditorState.readOnly.of(disabled),
        EditorView.editable.of(!disabled),
      ]),
    });
  }, [disabled]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: attributesCompartmentRef.current.reconfigure(
        EditorView.contentAttributes.of({
          id,
          "aria-label": "Article body in Markdown",
          "aria-describedby": describedBy,
          "aria-invalid": String(invalid),
          "aria-readonly": String(disabled),
        }),
      ),
    });
  }, [describedBy, disabled, id, invalid]);

  return (
    <div
      ref={hostRef}
      data-markdown-editor
      data-syntax-highlighting="markdown"
      data-lenis-prevent
      className="mt-3 overscroll-contain"
    />
  );
}
