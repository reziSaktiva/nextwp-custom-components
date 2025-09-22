"use client";

import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import type { Comment } from "./types";

interface CommentsProps {
  postId: number;
  status?: string;
}

export function Comments({ postId, status }: CommentsProps) {
  const disabled = status !== "publish" ? true : false;
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load comments"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Komentar</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Komentar ({comments.length})</h3>

      <CommentForm
        disabled={disabled}
        postId={postId}
        onCommentAdded={handleCommentAdded}
      />

      <CommentList
        comments={comments}
        onCommentAdded={handleCommentAdded}
        postId={postId}
      />
    </div>
  );
}
