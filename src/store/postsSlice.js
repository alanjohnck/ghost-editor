import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [
    {
      id: 1,
      title: "Future Projections",
      content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>",
      featuredImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "User Feedback Collection",
      content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>",
      featuredImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Trends & Cost Reduction",
      content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>",
      featuredImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Market Expansion Strategies",
      content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>",
      featuredImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: "Innovative Product Development",
      content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>",
      featuredImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  currentPost: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    createPost: (state, action) => {
      const newPost = {
        id: Date.now(),
        title: action.payload.title ,
        content: action.payload.content ,
        featuredImage: action.payload.featuredImage || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.posts.unshift(newPost);
      state.currentPost = newPost;
    },
    updatePost: (state, action) => {
      const { id, ...updates } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === id);
      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        if (state.currentPost && state.currentPost.id === id) {
          state.currentPost = state.posts[postIndex];
        }
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
      if (state.currentPost && state.currentPost.id === action.payload) {
        state.currentPost = null;
      }
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
});

export const { createPost, updatePost, deletePost, setCurrentPost, clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer;
