'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlock from '@tiptap/extension-code-block';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useState, useEffect, useRef } from 'react';
import FormatMenu from './FormatMenu';
import BookmarkExtension from './extensions/BookmarkExtension';
import HtmlExtension from './extensions/HtmlExtension';
import UnsplashPicker from './UnsplashPicker';
import Placeholder from '@tiptap/extension-placeholder';

const TiptapEditor = ({ content, onChange,placeholder }) => {
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [toolMenuPosition, setToolMenuPosition] = useState({ x: 0, y: 0 });
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [formatMenuPosition, setFormatMenuPosition] = useState({ x: 0, y: 0 });
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [plusButtonPosition, setPlusButtonPosition] = useState({ x: 0, y: 0 });
  const [showEmbedInput, setShowEmbedInput] = useState(false);
  const [embedInputPosition, setEmbedInputPosition] = useState({ x: 0, y: 0 });
  const [embedType, setEmbedType] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [showUnsplashPicker, setShowUnsplashPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUploadPosition, setImageUploadPosition] = useState({ x: 0, y: 0 });
  const [hoveredLine, setHoveredLine] = useState(null);

  // Refs for click outside detection
  const toolMenuRef = useRef(null);
  const embedInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        // Disable lists in StarterKit to avoid conflicts
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      // Explicitly add list extensions for better control
      BulletList.configure({
        HTMLAttributes: {
          class: 'bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'ordered-list',
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'list-item',
        },
      }),
       Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-lg p-4 font-mono text-sm',
        },
      }),
      Underline,
      HtmlExtension,
      BookmarkExtension,
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-6 border-gray-300',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Check if we should show the plus button (on cursor movement/typing)
      const { view, state } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Show plus button if we're in an empty paragraph or at the start of a line
      const currentNode = $from.parent;
      const isEmptyParagraph = currentNode.type.name === 'paragraph' && currentNode.content.size === 0;
      const isAtStartOfLine = $from.parentOffset === 0;
      
      if (isEmptyParagraph || isAtStartOfLine) {
        const coords = view.coordsAtPos($from.pos);
        const rect = view.dom.getBoundingClientRect();
        
        setPlusButtonPosition({
          x: window.innerWidth <= 768 ? 20 : coords.left - rect.left - 60, // Mobile: fixed left position, Desktop: relative to cursor
          y: coords.top - rect.top,
        });
        setShowPlusButton(true);
      } else {
        setShowPlusButton(false);
      }
    },
    onCreate: ({ editor }) => {
      // Focus the editor when it's created
      editor.commands.focus();
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        // Text is selected, show format menu
        const { view } = editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);
        const rect = view.dom.getBoundingClientRect();
        
        setFormatMenuPosition({
          x: (start.left + end.left) / 2 - rect.left,
          y: start.top - rect.top - 10,
        });
        setShowFormatMenu(true);
        setShowPlusButton(false); // Hide plus button when text is selected
      } else {
        setShowFormatMenu(false);
        
        // Check if we should show the plus button
        const { view, state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Show plus button if we're in an empty paragraph or at the start of a line
        const currentNode = $from.parent;
        const isEmptyParagraph = currentNode.type.name === 'paragraph' && currentNode.content.size === 0;
        const isAtStartOfLine = $from.parentOffset === 0;
        
        if (isEmptyParagraph || isAtStartOfLine) {
          const coords = view.coordsAtPos($from.pos);
          const rect = view.dom.getBoundingClientRect();
          
          setPlusButtonPosition({
            x: window.innerWidth <= 768 ? 20 : coords.left - rect.left - 60, // Mobile: fixed left position, Desktop: relative to cursor
            y: coords.top - rect.top,
          });
          setShowPlusButton(true);
          setHoveredLine(null); // Clear hover state when cursor is active
        } else {
          // Only hide if we're not in a hover state
          if (!hoveredLine) {
            setShowPlusButton(false);
          }
        }
      }
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          const { selection } = view.state;
          const { $from } = selection;
          
          // Check if we're at the start of a line or after whitespace
          const textBefore = $from.nodeBefore?.text || '';
          const isAtStartOfLine = $from.parentOffset === 0;
          const isAfterSpace = textBefore.endsWith(' ') || textBefore.endsWith('\n');
          
          if (isAtStartOfLine || isAfterSpace) {
            // Don't prevent default, let the "/" be typed first
            setTimeout(() => {
              // Get position for tool menu after the "/" is inserted
              const coords = view.coordsAtPos(view.state.selection.$from.pos);
              const rect = view.dom.getBoundingClientRect();
              
              setToolMenuPosition({
                x: coords.left - rect.left,
                y: coords.top - rect.top + 25,
              });
              setShowToolMenu(true);
              setShowPlusButton(false); // Hide plus button when tool menu is shown
            }, 0);
          }
        }
        
        // Close tool menu on Escape
        if (event.key === 'Escape') {
          setShowToolMenu(false);
          setShowFormatMenu(false);
        }
        
        return false;
      },
      handleDOMEvents: {
        mousemove: (view, event) => {
          // Don't show plus button on hover if tool menu is open or text is selected
          if (showToolMenu || showFormatMenu || !view.state.selection.empty) {
            return false;
          }

          const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (pos) {
            const { state } = view;
            const resolvedPos = state.doc.resolve(pos.pos);
            const currentNode = resolvedPos.parent;
            
            // Check if we're hovering over an empty paragraph
            const isEmptyParagraph = currentNode.type.name === 'paragraph' && currentNode.content.size === 0;
            
            if (isEmptyParagraph && !showPlusButton) {
              const coords = view.coordsAtPos(pos.pos);
              const rect = view.dom.getBoundingClientRect();
              
              setPlusButtonPosition({
                x: window.innerWidth <= 768 ? 20 : coords.left - rect.left - 60,
                y: coords.top - rect.top,
              });
              setShowPlusButton(true);
              setHoveredLine(pos.pos);
            } else if (!isEmptyParagraph && hoveredLine && showPlusButton) {
              // Hide plus button when moving away from empty line (unless cursor is in it)
              const { selection } = state;
              const { $from } = selection;
              const cursorNode = $from.parent;
              const isCursorInEmptyLine = cursorNode.type.name === 'paragraph' && cursorNode.content.size === 0;
              
              if (!isCursorInEmptyLine) {
                setShowPlusButton(false);
                setHoveredLine(null);
              }
            }
          }
          return false;
        },
        mouseleave: (view, event) => {
          // Hide plus button when mouse leaves editor area (unless cursor is in empty line)
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          const cursorNode = $from.parent;
          const isCursorInEmptyLine = cursorNode.type.name === 'paragraph' && cursorNode.content.size === 0;
          
          if (!isCursorInEmptyLine && hoveredLine) {
            setShowPlusButton(false);
            setHoveredLine(null);
          }
          return false;
        },
      },
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside tool menu
      if (showToolMenu && toolMenuRef.current && !toolMenuRef.current.contains(event.target)) {
        setShowToolMenu(false);
      }
      
      // Check if click is outside embed input
      if (showEmbedInput && embedInputRef.current && !embedInputRef.current.contains(event.target)) {
        setShowEmbedInput(false);
        setEmbedUrl('');
        setEmbedType('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showToolMenu, showEmbedInput]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const insertContent = (type, data) => {
    setShowToolMenu(false);
    
    // Remove the "/" character that triggered the menu (only if it exists)
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    
    // Find and delete the "/" character before the cursor if it exists
    const textBefore = $from.nodeBefore?.text || '';
    if (textBefore.endsWith('/')) {
      editor.chain().focus().deleteRange({ from: $from.pos - 1, to: $from.pos }).run();
    }
    
    switch (type) {
      case 'image-upload':
        // Show image upload component
        const coords = editor.view.coordsAtPos($from.pos);
        const rect = editor.view.dom.getBoundingClientRect();
        setImageUploadPosition({
          x: coords.left - rect.left,
          y: coords.top - rect.top + 25,
        });
        setShowImageUpload(true);
        break;
      case 'youtube-embed':
        // Show embed input for YouTube
        const coordsYT = editor.view.coordsAtPos($from.pos);
        const rectYT = editor.view.dom.getBoundingClientRect();
        setEmbedInputPosition({
          x: coordsYT.left - rectYT.left,
          y: coordsYT.top - rectYT.top + 25,
        });
        setEmbedType('youtube');
        setEmbedUrl('');
        setShowEmbedInput(true);
        break;
      case 'bookmark-embed':
        // Show embed input for Bookmark
        const coordsBM = editor.view.coordsAtPos($from.pos);
        const rectBM = editor.view.dom.getBoundingClientRect();
        setEmbedInputPosition({
          x: coordsBM.left - rectBM.left,
          y: coordsBM.top - rectBM.top + 25,
        });
        setEmbedType('bookmark');
        setEmbedUrl('');
        setShowEmbedInput(true);
        break;
      case 'html-embed':
        // Show embed input for HTML
        const coordsHTML = editor.view.coordsAtPos($from.pos);
        const rectHTML = editor.view.dom.getBoundingClientRect();
        setEmbedInputPosition({
          x: coordsHTML.left - rectHTML.left,
          y: coordsHTML.top - rectHTML.top + 25,
        });
        setEmbedType('html');
        setEmbedUrl('');
        setShowEmbedInput(true);
        break;
      case 'unsplash-embed':
        // Show Unsplash image picker
        setShowUnsplashPicker(true);
        break;
      case 'divider':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'image':
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
        break;
      case 'youtube':
        if (data.url) {
          editor.chain().focus().setYoutubeVideo({ src: data.url }).run();
        }
        break;
      case 'hr':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'bookmark':
        if (data.url) {
          editor.chain().focus().insertContent({
            type: 'bookmark',
            attrs: { url: data.url }
          }).run();
        }
        break;
      default:
        break;
    }
  };

  const handlePlusButtonClick = () => {
    // If we're in a hover state, move cursor to the hovered line
    if (hoveredLine) {
      editor.commands.setTextSelection(hoveredLine);
      editor.commands.focus();
    }
    
    setShowPlusButton(false);
    setHoveredLine(null);
    
    // Position the tool menu relative to the plus button
    setToolMenuPosition({
      x: plusButtonPosition.x + 40, // Position menu to the right of the plus button
      y: plusButtonPosition.y,
    });
    setShowToolMenu(true);
  };

  const handleEmbedSubmit = () => {
    if (embedUrl.trim()) {
      switch (embedType) {
        case 'image':
          editor.chain().focus().setImage({ src: embedUrl.trim() }).run();
          break;
        case 'youtube':
          editor.chain().focus().setYoutubeVideo({ src: embedUrl.trim() }).run();
          break;
        case 'bookmark':
          editor.chain().focus().insertContent({
            type: 'bookmark',
            attrs: { url: embedUrl.trim() }
          }).run();
          break;
        case 'html':
          // Insert HTML as a rendered HTML block
          editor.chain().focus().insertContent({
            type: 'htmlBlock',
            attrs: {
              htmlContent: embedUrl.trim()
            }
          }).run();
          break;
      }
    }
    setShowEmbedInput(false);
    setEmbedUrl('');
    setEmbedType('');
  };

  const handleEmbedCancel = () => {
    setShowEmbedInput(false);
    setEmbedUrl('');
    setEmbedType('');
  };

  const handleUnsplashImageSelect = (imageUrl) => {
    console.log('Inserting image URL into editor:', imageUrl);
    
    // Insert the selected image into the editor
    try {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      console.log('Image inserted successfully');
    } catch (error) {
      console.error('Error inserting image:', error);
    }
    
    setShowUnsplashPicker(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset the file input so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleImageUpload = (file) => {
    if (file) {
      // Create a URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      
      // Insert the image into the editor
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    // Always close the upload component after handling
    setShowImageUpload(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      <div className="prose prose-lg max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>
      
      {/* Plus Button */}
      {showPlusButton && (
        <button
          onClick={handlePlusButtonClick}
          className="absolute z-40 w-[30px] h-[30px] bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-70 hover:opacity-100"
          style={{
            left: plusButtonPosition.x,
            top: plusButtonPosition.y,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}
      
      {showToolMenu && (
        <div
          ref={toolMenuRef}
          className="absolute z-150 bg-white border border-gray-300 rounded-lg shadow-lg py-2 w-48 tool-menu"
          style={{
            left: toolMenuPosition.x,
            top: toolMenuPosition.y,
          }}
        >
          <div className="space-y-1">
            <button
              onClick={() => insertContent('image-upload')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
            >
              <img src="/media.png" alt="Media" width={16} height={16} className="opacity-70" />
              <span>Media</span>
            </button>
            <button
              onClick={() => insertContent('html-embed')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
                <polyline points="16,18 22,12 16,6"/>
                <polyline points="8,6 2,12 8,18"/>
              </svg>
              <span>HTML</span>
            </button>
            <button
              onClick={() => insertContent('divider')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
                <line x1="3" y1="12" x2="21" y2="12"/>
              </svg>
              <span>Divider</span>
            </button>
            <button
              onClick={() => insertContent('bookmark-embed')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
            >
              <img src="/bookmark.png" alt="Bookmark" width={16} height={16} className="opacity-70" />
              <span>Bookmark</span>
            </button>
             <button
              onClick={() => insertContent('youtube-embed')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
            >
              <img src="/youtube.png" alt="YouTube" width={16} height={16} className="opacity-70" />
              <span>YouTube</span>
            </button>
            <button
              onClick={() => insertContent('unsplash-embed')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-200"
            >
              <img src="/unsplash.png" alt="Unsplash" width={16} height={16} className="opacity-70" />
              <span>Unsplash</span>
            </button>
           
            
            
            
          </div>
        </div>
      )}
      
      {showFormatMenu && (
        <FormatMenu
          editor={editor}
          position={formatMenuPosition}
          onClose={() => setShowFormatMenu(false)}
        />
      )}

      {/* Embed Input */}
      {showEmbedInput && (
        <div
          ref={embedInputRef}
          className="absolute z-50 bg-[#F4F4F5] border border-gray-300 rounded-lg p-4 w-[700px] embed-input"
          style={{
            left: embedInputPosition.x,
            top: embedInputPosition.y,
          }}
        >
          <div className="">
            
            {embedType === 'html' ? (
              <textarea
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEmbedSubmit();
                  } else if (e.key === 'Escape') {
                    handleEmbedCancel();
                  }
                }}
                placeholder="Paste HTML code... (Enter to submit)"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-transparent resize-none font-mono text-sm"
                rows="6"
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEmbedSubmit();
                  } else if (e.key === 'Escape') {
                    handleEmbedCancel();
                  }
                }}
                placeholder={
                  embedType === 'image' ? 'Paste or type an image URL...' :
                  embedType === 'youtube' ? 'Paste a YouTube URL...' :
                  embedType === 'bookmark' ? 'Paste any URL to create a bookmark...' :
                  embedType === 'unsplash' ? 'Paste an Unsplash image URL...' :
                  'Paste URL to add embedded content...'
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-transparent"
                autoFocus
              />
            )}
            
 
          </div>
         
        </div>
      )}

      {/* Image Upload Component */}
      {showImageUpload && (
        <div
          className="absolute z-50 "
          style={{
            left: imageUploadPosition.x,
            top: imageUploadPosition.y,
          }}
        >
          <div className="mb-[20px] w-[700px] h-[300px] bg-[#F9FAFB] rounded-lg shadow-lg border border-gray-200 image-upload-component">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center"
            >
              <div className="h-[20px] w-[18px] mb-[16px]">
                <img className="w-full h-full" src="./upload.png" alt="Upload" />
              </div>
              <p className="text-sm mb-2 text-gray-400">
                <span className="font-bold text-gray-500">Click to upload post cover</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                SVG, PNG, JPG or GIF (recommended: 1600x840)
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
            
            {/* Close button */}
            <button
              onClick={() => setShowImageUpload(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 rounded-full w-8 h-8 flex items-center justify-center "
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Unsplash Image Picker */}
      {showUnsplashPicker && (
        <UnsplashPicker
          onClose={() => setShowUnsplashPicker(false)}
          onSelectImage={handleUnsplashImageSelect}
        />
      )}
    </div>
  );
};

export default TiptapEditor;
