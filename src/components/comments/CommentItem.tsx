"use client";

import { CommentForm } from "./CommentForm";
import type { Comment } from "./types";

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onReply: (commentId: number) => void;
  isReplying: boolean;
  onCommentAdded: (comment: Comment) => void;
  setReplyingTo: (commentId: number | null) => void;
  postId: number;
}

export function CommentItem({
  comment,
  replies,
  onReply,
  isReplying,
  onCommentAdded,
  setReplyingTo,
  postId,
}: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {comment.author_name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-sm font-semibold text-gray-900">
              {comment.author_name}
            </h4>
            <span className="text-sm text-gray-500">
              {formatDate(comment.date)}
            </span>
          </div>

          <div
            className="text-sm text-gray-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
          />

          <div className="mt-3">
            <button
              onClick={() => onReply(comment.id)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Balas
            </button>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-13">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onCommentAdded={onCommentAdded}
            onCancel={() => setReplyingTo(null)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-13 space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
              <CommentItem
                comment={reply}
                replies={[]}
                onReply={onReply}
                isReplying={false}
                onCommentAdded={onCommentAdded}
                setReplyingTo={setReplyingTo}
                postId={postId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
