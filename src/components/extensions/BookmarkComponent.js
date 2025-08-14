'use client';
import { NodeViewWrapper } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';

const BookmarkComponent = ({ node, deleteNode }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // For demo purposes, we'll simulate fetching metadata
        // In a real app, you'd fetch this from your backend or a metadata service
        setTimeout(() => {
          const mockMetadata = {
            title: getPageTitle(node.attrs.url),
            description: 'Build your site with CodeDesign and cool web apps! Dive into the world of innovative web applications and discover how you can enhance your online presence.',
            image: null,
            domain: getDomain(node.attrs.url),
          };
          setMetadata(mockMetadata);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    if (node.attrs.url) {
      fetchMetadata();
    }
  }, [node.attrs.url]);

  const getPageTitle = (url) => {
    try {
      const domain = getDomain(url);
      return `Build your site with ${domain} and cool web apps!`;
    } catch {
      return 'Unknown Title';
    }
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'unknown-domain.com';
    }
  };

  if (loading) {
    return (
      <NodeViewWrapper className="bookmark-wrapper">
        <div className="border border-gray-200 rounded-lg p-4 my-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  if (error) {
    return (
      <NodeViewWrapper className="bookmark-wrapper">
        <div className="border border-red-200 rounded-lg p-4 my-4 bg-red-50">
          <div className="flex items-center justify-between">
            <p className="text-red-600">Failed to load bookmark</p>
            <button
              onClick={deleteNode}
              className="text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="bookmark-wrapper">
      <div className="border border-gray-200 rounded-lg my-4 overflow-hidden hover:shadow-md transition-shadow group">
        <a 
          href={node.attrs.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex items-start">
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                    {metadata?.title || 'Untitled'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {metadata?.description || 'No description available'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ExternalLink size={12} />
                    <span>{metadata?.domain}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteNode();
                  }}
                  className="ml-4 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            {metadata?.image && (
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                <img 
                  src={metadata.image} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </a>
      </div>
    </NodeViewWrapper>
  );
};

export default BookmarkComponent;
