'use client';
import { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Heading2,
  Heading3,
  Quote,
  Link
} from 'lucide-react';

const FormatMenu = ({ editor, position, onClose }) => {
  const menuRef = useRef(null);
  const linkInputRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  const handleLinkSubmit = () => {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
    onClose();
  };

  const handleLinkCancel = () => {
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handleLinkKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLinkSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleLinkCancel();
    }
  };

  const formatButtons = [
    {
      icon: () => <img src="/B.png" alt="Bold" width={9} height={11} />,
      label: 'Bold',
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: () => <img src="/italic.png" alt="Italic" width={9} height={11} />,
      label: 'Italic',
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: () => (
        <span className="font-bold text-sm" style={{ textDecoration: 'underline' }}>
          U
        </span>
      ),
      label: 'Underline',
      isActive: () => editor.isActive('underline'),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: () => (
        <span className="font-bold text-sm" style={{ textDecoration: 'line-through' }}>
          S
        </span>
      ),
      label: 'Strikethrough',
      isActive: () => editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon:() => <img src="/H.png" alt="Heading" width={9} height={11} />,
      label: 'Heading 2',
      isActive: () => editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: () => <img src="/H.png" alt="Heading" width={7} height={9} />,
      label: 'Heading 3',
      isActive: () => editor.isActive('heading', { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: () => <img src="/quotes.png" alt="Quote" width={15} height={11} />,
      label: 'Quote',
      isActive: () => editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
      label: 'Bullet List',
      isActive: () => editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="6" x2="21" y2="6"/>
          <line x1="10" y1="12" x2="21" y2="12"/>
          <line x1="10" y1="18" x2="21" y2="18"/>
          <path d="M4 6h1v4"/>
          <path d="M4 10h2"/>
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-1-1.5"/>
        </svg>
      ),
      label: 'Numbered List',
      isActive: () => editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    // {
    //   icon: () => (
    //     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    //       <line x1="3" y1="12" x2="21" y2="12"/>
    //     </svg>
    //   ),
    //   label: 'Horizontal Rule',
    //   isActive: () => false,
    //   onClick: () => editor.chain().focus().setHorizontalRule().run(),
    // },
    {
      icon: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16,18 22,12 16,6"/>
          <polyline points="8,6 2,12 8,18"/>
        </svg>
      ),
      label: 'Inline Code',
      isActive: () => editor.isActive('code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
    // {
    //   icon: () => (
    //     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    //       <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    //       <polyline points="8,12 12,16 16,8"/>
    //     </svg>
    //   ),
    //   label: 'Code Block',
    //   isActive: () => editor.isActive('codeBlock'),
    //   onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    // },
    {
      icon: () => <img src="/attachments.png" alt="Link" width={18} height={14} />,
      label: 'Link',
      isActive: () => editor.isActive('link'),
      onClick: () => setShowLinkInput(true),
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white text-black rounded-lg border border-[#D1D5DC] p-1 shadow-md max-w-lg format-menu"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%) translateY(-100%)',
      }}
    >
      {showLinkInput ? (
        <div className="p-2">
          <input
            ref={linkInputRef}
            type="text"
            placeholder="Enter URL and press Enter"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKeyPress}
            className="w-full px-3 py-2  rounded-md text-sm focus:outline-none focus:border-transparent"
          />
        </div>
      ) : (
        <div className="flex items-center gap-1 flex-wrap">
          {formatButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`p-2 rounded-md transition-colors hover:bg-[#F3F4F6] ${
                button.isActive() ? 'bg-[#F3F4F6] text-black' : 'text-gray-600'
              }`}
              title={button.label}
            >
              <button.icon size={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormatMenu;
