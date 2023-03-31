import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, Comment } from "../../../interfaces/Ingridient";

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [{ id: 0, comments: [], title: "", body: "" }],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    getPostsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getPostsSuccess(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    getPostsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addComment(
      state,
      action: PayloadAction<{ postId: number; comment: Comment }>
    ) {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.comments.push(comment);
      } else {
        state.posts.push({
          body: "",
          comments: [comment],
          id: postId,
          title: "",
        });
      }
    },
    pushNewPost(state, action: PayloadAction<{ postId: number }>) {
      const { postId } = action.payload;
      state.posts.push({ id: postId, body: "", title: "", comments: [] });
    },
  },
});

export const { getPostsStart, getPostsSuccess, getPostsFailure, addComment } =
  postsSlice.actions;

export default postsSlice.reducer;
