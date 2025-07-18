"use client";

import { useState } from "react";
import { CommentItem } from "./CommentItem";
import type { Comment } from "./types";

interface CommentListProps {
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
  postId: number;
}

export function CommentList({
  comments,
  onCommentAdded,
  postId,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Group comments by parent
  const topLevelComments = comments.filter(
    (comment) => !comment.parent || comment.parent === 0
  );
  const replies = comments.filter(
    (comment) => comment.parent && comment.parent !== 0
  );

  const getReplies = (parentId: number) => {
    return replies.filter((reply) => reply.parent === parentId);
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleCommentAdded = (newComment: Comment) => {
    onCommentAdded(newComment);
    setReplyingTo(null);
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {topLevelComments.map((comment) => (
        <div
          key={comment.id}
          className="border-b border-gray-200 pb-6 last:border-b-0"
        >
          <CommentItem
            comment={comment}
            replies={getReplies(comment.id)}
            onReply={handleReply}
            isReplying={replyingTo === comment.id}
            onCommentAdded={handleCommentAdded}
            setReplyingTo={setReplyingTo}
            postId={postId}
          />
        </div>
      ))}
    </div>
  );
}
