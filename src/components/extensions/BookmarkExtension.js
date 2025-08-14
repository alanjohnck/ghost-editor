import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import BookmarkComponent from './BookmarkComponent';

export default Node.create({
  name: 'bookmark',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="bookmark"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'bookmark' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BookmarkComponent);
  },
});
