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
      class: 'custom-html-content',
      'data-html-content': HTMLAttributes.htmlContent,
    })];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'custom-html-content';
      
      // Set the HTML content directly without decorations
      if (node.attrs.htmlContent && node.attrs.htmlContent.trim()) {
        try {
          dom.innerHTML = node.attrs.htmlContent;
        } catch (error) {
          dom.textContent = 'Invalid HTML: ' + error.message;
          dom.className += ' text-red-500';
        }
      }
      
      return {
        dom,
        contentDOM: null,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) {
            return false;
          }
          
          // Update content when node changes
          if (updatedNode.attrs.htmlContent !== node.attrs.htmlContent) {
            if (updatedNode.attrs.htmlContent && updatedNode.attrs.htmlContent.trim()) {
              try {
                dom.innerHTML = updatedNode.attrs.htmlContent;
                dom.className = 'custom-html-content';
              } catch (error) {
                dom.textContent = 'Invalid HTML: ' + error.message;
                dom.className = 'custom-html-content text-red-500';
              }
            } else {
              dom.innerHTML = '';
              dom.className = 'custom-html-content';
            }
          }
          
          return true;
        }
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
