import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Eraser,
  Palette
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children,
  title
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg transition-all ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-sm' 
        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
    }`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const alt = prompt('Enter image alt text', 'Blog image');
        const reader = new FileReader();
        reader.onload = () => {
          if (editor) {
            editor.chain().focus().setImage({ 
              src: reader.result as string,
              alt: alt || 'Blog image'
            }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="w-full border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            isActive={editor.isActive('heading', { level: 1 })}
            title="H1"
          >
            <Heading1 size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            isActive={editor.isActive('heading', { level: 2 })}
            title="H2"
          >
            <Heading2 size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            isActive={editor.isActive('heading', { level: 3 })}
            title="H3"
          >
            <Heading3 size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <MenuButton 
            onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={18} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Add Link">
            <LinkIcon size={18} />
          </MenuButton>
          <MenuButton onClick={addImage} title="Insert Image">
            <ImageIcon size={18} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-1 px-2">
          <div className="relative group">
            <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all flex items-center gap-1">
              <Palette size={18} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#0f172a' }} />
            </button>
            <div className="hidden group-hover:flex absolute top-full left-0 z-50 p-2 bg-white rounded-xl shadow-xl border border-slate-100 grid grid-cols-5 gap-1 mt-1">
              {['#0f172a', '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#64748b'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className="w-6 h-6 rounded-md hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Eraser size={12} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-slate max-w-none min-h-[300px] max-h-[500px] overflow-y-auto p-6 focus:outline-none bg-white">
        <EditorContent editor={editor} />
      </div>
      
      <style>{`
        .ProseMirror {
          min-height: 300px;
          outline: none !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
        }
        .ProseMirror p {
          margin: 0.5em 0;
          font-weight: 300;
        }
        .ProseMirror h1 { font-size: 2em; font-weight: 900; margin: 1em 0 0.5em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: 800; margin: 1em 0 0.5em; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: 700; margin: 1em 0 0.5em; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; }
        .ProseMirror a { color: #4f46e5; text-decoration: underline; }
      `}</style>
    </div>
  );
}
