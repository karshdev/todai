import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import TodaiTooltip from "../tooltip";

export const TipTapEditor = ({ content, onChange }: any) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 10,
        },
      }),
      Underline,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-4",
      },
    },
  });

  // Add effect to update content when quote changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Add keyboard event listeners for undo/redo
  React.useEffect(() => {
    if (editor) {
      const handleKeyDown = (e: any) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            editor.commands.redo();
          } else {
            editor.commands.undo();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [editor]);

  return (
    <div className="w-full border border-gray-200 rounded-lg flex flex-col text-base">
      <EditorContent editor={editor} />
      <MenuBar editor={editor} />
    </div>
  );
};

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 p-2 border-0 border-t rounded-b-lg bg-white">
      {/* Text Formatting Group */}
      <div className="flex gap-1">
        <TodaiTooltip
          triggerContent={
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive("bold") ? "bg-gray-200" : ""
              }`}>
              <Bold className="w-4 h-4" />
            </button>
          }
          tooltipContent={<p className="text-xs">Bold (Ctrl+B)</p>}
        />
        <TodaiTooltip
          triggerContent={
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive("italic") ? "bg-gray-200" : ""
              }`}
              title="">
              <Italic className="w-4 h-4" />
            </button>
          }
          tooltipContent={<p className="text-xs">Italic (Ctrl+I)</p>}
        />
        <TodaiTooltip
          triggerContent={
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor.isActive("underline") ? "bg-gray-200" : ""
              }`}
              title="">
              <UnderlineIcon className="w-4 h-4" />
            </button>
          }
          tooltipContent={<p className="text-xs">Underline (Ctrl+U)</p>}
        />
      </div>
      <div className="flex gap-1 mr-2 border-l pl-2">
        <TodaiTooltip
          triggerContent={
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className={`p-2 rounded hover:bg-gray-100 ${
                !editor.can().undo() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="">
              <Undo2 className="w-4 h-4" />
            </button>
          }
          tooltipContent={<p className="text-xs">Undo (Ctrl+Z)</p>}
        />
        <TodaiTooltip
          triggerContent={
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className={`p-2 rounded hover:bg-gray-100 ${
                !editor.can().redo() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="">
              <Redo2 className="w-4 h-4" />
            </button>
          }
          tooltipContent={<p className="text-xs">Redo (Ctrl+Shift+Z)</p>}
        />
      </div>
    </div>
  );
};