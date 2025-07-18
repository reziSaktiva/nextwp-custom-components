"use client";

import { useState, useEffect } from "react";

interface CommentCountProps {
  postId: number;
  className?: string;
}

export function CommentCount({ postId, className = "" }: CommentCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments/${postId}`);
        if (response.ok) {
          const comments = await response.json();
          setCount(comments.length);
        }
      } catch (error) {
        console.error("Error fetching comment count:", error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentCount();
  }, [postId]);

  if (loading) {
    return (
      <span className={`text-gray-500 ${className}`}>
        <span className="animate-pulse">...</span>
      </span>
    );
  }

  if (count === null) {
    return null;
  }

  return (
    <span className={`text-gray-600 ${className}`}>
      {count === 0 ? "Belum ada komentar" : `${count} komentar`}
    </span>
  );
}
