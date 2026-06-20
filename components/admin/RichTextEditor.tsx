import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import FontFamily from '@tiptap/extension-font-family';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Palette,
  Highlighter,
  Table as TableIcon,
  Minus,
  Code2,
  Eye,
  RemoveFormatting,
  TableProperties,
  Rows3,
  Columns3,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode; 
  title?: string;
}) => (
  <Button
    type="button"
    variant={isActive ? 'default' : 'ghost'}
    size="icon"
    className="h-8 w-8"
    onClick={onClick}
    disabled={disabled}
    title={title}
  >
    {children}
  </Button>
);

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-border self-center mx-1" />
);

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [htmlSource, setHtmlSource] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg my-4' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Youtube.configure({
        HTMLAttributes: { class: 'w-full aspect-video rounded-lg my-4' },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setHtmlSource(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setHtmlSource(content);
    }
  }, [content, editor]);

  const handleModeChange = useCallback((newMode: string) => {
    if (newMode === 'html') {
      setHtmlSource(editor?.getHTML() || '');
      setMode('html');
    } else {
      if (editor) {
        editor.commands.setContent(htmlSource);
        onChange(htmlSource);
      }
      setMode('visual');
    }
  }, [editor, htmlSource, onChange]);

  const handleHtmlChange = useCallback((value: string) => {
    setHtmlSource(value);
    onChange(value);
  }, [onChange]);

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl('');
    }
  };

  const colors = ['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'];
  const highlightColors = ['#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fecdd3', '#fed7aa'];

  const fontFamilies = [
    { label: 'Default', value: '' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Verdana', value: 'Verdana' },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Mode Tabs */}
      <Tabs value={mode} onValueChange={handleModeChange}>
        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-2">
          <TabsList className="h-9 bg-transparent">
            <TabsTrigger value="visual" className="text-xs gap-1.5">
              <Eye size={14} /> Visual Editor
            </TabsTrigger>
            <TabsTrigger value="html" className="text-xs gap-1.5">
              <Code2 size={14} /> HTML Source
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="mt-0">
          {/* Toolbar Row 1 */}
          <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
              <Redo size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Font Family */}
            <Select
              value={editor.getAttributes('textStyle').fontFamily || ''}
              onValueChange={(val) => val ? editor.chain().focus().setFontFamily(val).run() : editor.chain().focus().unsetFontFamily().run()}
            >
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(f => (
                  <SelectItem key={f.value} value={f.value || 'default'} className="text-xs">{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
              <Heading1 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
              <Heading2 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
              <Heading3 size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text Formatting */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
              <UnderlineIcon size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
              <Strikethrough size={16} />
            </ToolbarButton>

            {/* Text Color */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Text Color">
                  <Palette size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <p className="text-xs font-medium mb-2">Text Color</p>
                <div className="flex gap-1 flex-wrap max-w-[180px]">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setColor(color).run()}
                    />
                  ))}
                </div>
                <Button type="button" variant="ghost" size="sm" className="mt-2 w-full text-xs" onClick={() => editor.chain().focus().unsetColor().run()}>
                  Reset Color
                </Button>
              </PopoverContent>
            </Popover>

            {/* Highlight */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Highlight">
                  <Highlighter size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <p className="text-xs font-medium mb-2">Highlight Color</p>
                <div className="flex gap-1">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    />
                  ))}
                </div>
                <Button type="button" variant="ghost" size="sm" className="mt-2 w-full text-xs" onClick={() => editor.chain().focus().unsetHighlight().run()}>
                  Remove Highlight
                </Button>
              </PopoverContent>
            </Popover>

            <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
              <RemoveFormatting size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
              <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
              <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
              <AlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
              <AlignJustify size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists & Blocks */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
              <ListOrdered size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
              <Quote size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
              <Code size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
              <Minus size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Table */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Table">
                  <TableIcon size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <p className="text-xs font-medium mb-2">Table</p>
                <div className="space-y-1">
                  <Button type="button" size="sm" variant="outline" className="w-full text-xs justify-start gap-2"
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                    <TableProperties size={14} /> Insert 3×3 Table
                  </Button>
                  {editor.isActive('table') && (
                    <>
                      <Button type="button" size="sm" variant="outline" className="w-full text-xs justify-start gap-2"
                        onClick={() => editor.chain().focus().addRowAfter().run()}>
                        <Rows3 size={14} /> Add Row
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="w-full text-xs justify-start gap-2"
                        onClick={() => editor.chain().focus().addColumnAfter().run()}>
                        <Columns3 size={14} /> Add Column
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="w-full text-xs justify-start gap-2"
                        onClick={() => editor.chain().focus().deleteRow().run()}>
                        <Rows3 size={14} /> Delete Row
                      </Button>
                      <Button type="button" size="sm" variant="outline" className="w-full text-xs justify-start gap-2"
                        onClick={() => editor.chain().focus().deleteColumn().run()}>
                        <Columns3 size={14} /> Delete Column
                      </Button>
                      <Button type="button" size="sm" variant="destructive" className="w-full text-xs justify-start gap-2"
                        onClick={() => editor.chain().focus().deleteTable().run()}>
                        <Trash2 size={14} /> Delete Table
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <ToolbarDivider />

            {/* Link */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant={editor.isActive('link') ? 'default' : 'ghost'} size="icon" className="h-8 w-8" title="Link">
                  <LinkIcon size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter URL..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={addLink}>Add Link</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => editor.chain().focus().unsetLink().run()}>Remove</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Image */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Image">
                  <ImageIcon size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  />
                  <Button type="button" size="sm" onClick={addImage}>Insert Image</Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* YouTube */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="YouTube">
                  <YoutubeIcon size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter YouTube URL..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addYoutube()}
                  />
                  <Button type="button" size="sm" onClick={addYoutube}>Insert Video</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Editor Content */}
          <EditorContent editor={editor} />
        </TabsContent>

        <TabsContent value="html" className="mt-0">
          <Textarea
            value={htmlSource}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm rounded-none border-0 focus-visible:ring-0 resize-y"
            dir="ltr"
            placeholder="<div>Your HTML content here...</div>"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;
