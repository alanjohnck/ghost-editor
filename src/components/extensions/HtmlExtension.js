import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'htmlBlock',

  group: 'block',

  content: '',

  addAttributes() {
    return {
      htmlContent: {
        default: '',
        parseHTML: element => element.getAttribute('data-html-content'),
        renderHTML: attributes => {
          if (!attributes.htmlContent) {
            return {};
          }
          return {
            'data-html-content': attributes.htmlContent,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-html-content]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      class: 'html-block border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50',
      'data-html-content': HTMLAttributes.htmlContent,
    }), ['div', {
      innerHTML: HTMLAttributes.htmlContent || '',
      class: 'html-content'
    }]];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'html-block border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 relative';
      
      // Create content container
      const contentContainer = document.createElement('div');
      contentContainer.className = 'html-content';
      
      // Create label
      const label = document.createElement('div');
      label.className = 'absolute top-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded';
      label.textContent = 'HTML';
      
      // Set the HTML content
      if (node.attrs.htmlContent) {
        try {
          contentContainer.innerHTML = node.attrs.htmlContent;
        } catch (error) {
          contentContainer.textContent = 'Invalid HTML';
          contentContainer.className += ' text-red-500';
        }
      }
      
      dom.appendChild(label);
      dom.appendChild(contentContainer);
      
      return {
        dom,
        contentDOM: null, // This prevents Tiptap from trying to manage content
      };
    };
  },

  addCommands() {
    return {
      setHtmlBlock: (htmlContent) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            htmlContent,
          },
        });
      },
    };
  },
});
