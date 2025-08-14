'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, clearCurrentPost } from '@/store/postsSlice';
import TiptapEditor from '@/components/TiptapEditor';
import debounce from 'lodash.debounce';
import { ArrowLeft, Settings, Eye } from 'lucide-react';

export default function EditorPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPost = useSelector(state => state.posts.currentPost);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Draft - Saved'); // "Saving..." or "Saved"
  const fileInputRef = useRef(null);

  // Create a debounced save function only ONCE
  const debouncedSave = useCallback(
    debounce((id, postData) => {
      if (id) {
        dispatch(updatePost({
          id,
          ...postData
        }));
         setSaveStatus('Draft - Saved');

      }
    }, 500),
    [dispatch] // depends only on dispatch
  );

  useEffect(() => {
    // Create a new post when component mounts
    const newPost = {
      title: '',
      content: '',
      featuredImage: null
    };

    const action = dispatch(createPost(newPost));
    // The createPost action updates both posts array and currentPost
  }, [dispatch]);

  // Sync local state with currentPost from Redux
  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title || '');
      setContent(currentPost.content || '');
      setFeaturedImage(currentPost.featuredImage || null);
    }
  }, [currentPost]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch]);

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setSaveStatus('Saving...');
    debouncedSave(currentPost?.id, {
      title: newTitle,
      content,
      featuredImage
    });
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setSaveStatus('Saving...');
    debouncedSave(currentPost?.id, {
      title,
      content: newContent,
      featuredImage
    });
  };

  const handleImageUpload = (imageData) => {
    setFeaturedImage(imageData);
    debouncedSave(currentPost?.id, {
      title,
      content,
      featuredImage: imageData
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageUpload(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col editor-page">
      {/* Header */}
      <div className="border-gray-200 p-2 md:p-[20px] flex-shrink-0 editor-header">
        <div className="w-full max-w-[500px] md:max-w-[1238px] mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <img src="./back.png" className='w-[18px] h-[18px] cursor-pointer'></img>
              </button>
              <span className="text-sm text-black text-[14px] sm:text-[16px] font-medium">Posts</span>
              <span className="text-xs sm:text-sm text-gray-500">{saveStatus}</span>
            </div>

            <div className="flex items-center  sm:gap-2 md:gap-3 header-buttons">
              <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition-colors">
                <img src='./window.png' className='w-[16px] h-[16px]'></img>
              </button>
              <button className="flex items-center w-[60px] sm:w-[74px] h-[30px] sm:h-[34px] px-2 sm:px-[12px] py-1 sm:py-[6px] text-[12px] sm:text-[14px] bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
                Preview
              </button>
              <button className="px-2 sm:px-[12px] py-1 sm:py-[6px] w-[60px] sm:w-[74px] h-[30px] sm:h-[34px] text-[12px] sm:text-[14px] bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content - Scrollable */}
      <div className="flex-1 ">
        <div className="w-full mx-auto flex flex-col justify-center items-center py-4 sm:py-6">
        {/* Featured Image Upload Area */}
        <div className="mb-[15px] sm:mb-[20px] w-[calc(100vw-2rem)] sm:w-full max-w-[800px] h-[250px] sm:h-[300px] bg-[#F9FAFB] featured-image-container mx-4 sm:mx-0">
          {featuredImage ? (
            <div className="w-full h-full relative rounded-lg overflow-hidden">
              <img
                src={featuredImage}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleImageUpload(null)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white bg-opacity-50 hover:bg-opacity-75 cursor-pointer p-1.5 sm:p-2 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center"
            >
              <div className="h-[16px] sm:h-[20px] w-[14px] sm:w-[18px] mb-3 sm:mb-[16px]">
                <img className='w-full h-full' src="./upload.png" alt="Upload" />
              </div>
              <p className="text-xs sm:text-sm mb-2 text-gray-400">
                  <span className='font-bold text-gray-500'>Click to upload post cover</span> or drag and drop              
               </p>
              <p className="text-xs text-gray-400">
                SVG, PNG, JPG or GIF (recommended: 1600x840)
              </p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Title Input */}
       <div className='w-full flex flex-col items-center'>
        <div className='w-[calc(100vw-2rem)] sm:w-full max-w-[700px]    px-4 sm:px-0 editor-content-container'>
          <textarea
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className="w-full text-left  resize-none text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold placeholder-gray-400 border-none outline-none  sm:mb-6 bg-transparent overflow-hidden"
          style={{
            lineHeight: '1.1',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
          onInput={(e) => {
            // Auto-resize textarea based on content
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
           />
          <hr className='border-[#D1D5DC] mb-4 sm:mb-6' />

        {/* Rich Text Editor */}
          <div className="w-full">
            <TiptapEditor content={content} onChange={handleContentChange} placeholder="Begin writing your post..." />
          </div>
        </div>
       </div>
        </div>
      </div>
    </div>
  );
}
