'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deletePost } from '@/store/postsSlice';
import { useDispatch } from 'react-redux';
export default function Home() {
  const posts = useSelector(state => state.posts.posts);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPost = () => {
    router.push('/editor');
  };

  const handleEditPost = (postId) => {
    router.push(`/editor/${postId}`);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-white p-4 sm:p-[40px]">
      {/* Header */}
      <div className="">
        <div className=" flex flex-col gap-4 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Posts</h1>
          </div>
          
          {/* Search Bar */}
          <div className='flex flex-col md:flex-row justify-between relative gap-4 md:gap-6'>
           <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search Posts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[419px] h-[36px] pl-10 pr-4 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
           </div>
           <button
              onClick={handleNewPost}
              className="w-full md:w-[87px] h-[34px] flex items-center justify-center gap-2 bg-black text-white px-4 py-1 rounded-[7px] text-[12px]"
            >
              New post
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-full mt-[33px] ">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found</p>
          </div>
        ) : (
          <div className="">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white  border-t border-t-gray-200   cursor-pointer group"
                onClick={() => handleEditPost(post.id)}
              >
                <div className="flex items-center justify-center">
                  <div className="flex-1 flex-col py-[12px] ">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-600">
                      {post.title}
                    </h2>
                    <div 
                      className="text-gray-600 text-sm my-[4px]"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                      }}
                    />
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(post.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPost(post.id);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deletePost(post.id));
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
