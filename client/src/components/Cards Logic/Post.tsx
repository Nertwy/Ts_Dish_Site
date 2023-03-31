import React, { FC, useState } from "react";
import { addComment } from "../../app/CommentSlice";
import { useAppSelector, useAppDispatch } from "../../app/store";
import { Comment } from "../../../../interfaces/Ingridient";
import { apiPostComment } from "../../api/api";
interface PostInterface {
  postId: number;
}
const Post: FC<PostInterface> = ({ postId }) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.posts.posts);
  const [newComment, setNewComment] = useState<Comment>({
    postId,
    text: "",
    id: 0,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    dispatch(addComment({ comment: newComment, postId }));
    await apiPostComment(newComment);
    setNewComment({
      postId,
      text: "",
      id: 0,
    });
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Comments</h2>
      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} className="mb-4">
            <p className="text-gray-700">{comment.body}</p>
            <span className="text-gray-500 text-base">
              {comment.comments.map((comment) => {
                return <div>{comment.text}</div>;
              })}
            </span>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label
            htmlFor={`new-comment-${postId}`}
            className="block text-gray-700 font-bold mb-2"
          >
            Add a comment
          </label>
          <textarea
            id={`new-comment-${postId}`}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newComment.text}
            onChange={(e) =>
              setNewComment({
                ...newComment,
                text: e.currentTarget.value,
              })
            }
            rows={3}
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Post;
