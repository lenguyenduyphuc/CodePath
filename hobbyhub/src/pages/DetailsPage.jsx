"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "./DetailsPage.css";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [userPost, setUserPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUserPost() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("Posts")
          .select()
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching Post:", error);
        } else {
          setUserPost(data);
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserPost();
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      alert("Cannot post a blank comment.");
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedComments = [
        ...comments,
        {
          text: newComment,
          timestamp: new Date(),
          author_id: userId,
        },
      ];

      const { error } = await supabase
        .from("Posts")
        .update({ comments: updatedComments })
        .eq("id", id);

      if (error) {
        console.error("Error adding comment:", error);
      } else {
        setComments(updatedComments);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const updatedUpvotes = userPost.up_votes + 1;
      setUserPost({ ...userPost, up_votes: updatedUpvotes });

      const { error } = await supabase
        .from("Posts")
        .update({ up_votes: updatedUpvotes })
        .eq("id", id);

      if (error) {
        console.error("Error updating upvotes:", error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    // Check if user is the author of the post
    if (userPost.author_id && userPost.author_id !== userId) {
      alert("You can only delete posts that you created.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const { error } = await supabase.from("Posts").delete().eq("id", id);

        if (error) {
          console.error("Error deleting Post:", error);
        } else {
          alert("Post deleted successfully.");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatTimeAgo = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  // Get flag color based on post type
  const getFlagColor = (flag) => {
    switch (flag) {
      case "question":
        return "flag-question";
      case "opinion":
        return "flag-opinion";
      case "announcement":
        return "flag-announcement";
      default:
        return "flag-general";
    }
  };

  if (isLoading) {
    return (
      <div className="details-container">
        <LoadingSpinner text="Loading post..." />
      </div>
    );
  }

  return (
    <div className="details-container">
      {userPost ? (
        <div className="post-detail-card">
          <div className="post-header">
            <div className="post-meta">
              <span className="post-time">
                Posted{" "}
                {formatTimeAgo(new Date() - new Date(userPost.created_at))}
              </span>
              {userPost.flag && (
                <span
                  className={`post-flag-label ${getFlagColor(userPost.flag)}`}
                >
                  {userPost.flag.charAt(0).toUpperCase() +
                    userPost.flag.slice(1)}
                </span>
              )}
            </div>
            <h1 className="post-title">{userPost.title}</h1>
          </div>

          {userPost.image_url && (
            <div className="post-image-container">
              <img
                className="post-image"
                src={userPost.image_url || "/placeholder.svg"}
                alt={userPost.title}
              />
            </div>
          )}

          <div className="post-content">
            <p>{userPost.content}</p>
          </div>

          <div className="post-actions">
            <div className="action-group">
              <button
                className="action-button upvote-button"
                onClick={handleUpvote}
              >
                <span className="action-icon">👍</span>
                <span className="action-count">{userPost.up_votes}</span>
              </button>
            </div>

            <div className="action-group">
              {(!userPost.author_id || userPost.author_id === userId) && (
                <>
                  <Link
                    to={`/edit/${userPost.id}`}
                    className="action-button edit-button"
                  >
                    <span className="action-icon">✏️</span>
                    <span>Edit</span>
                  </Link>
                  <button
                    className="action-button delete-button"
                    onClick={handleDelete}
                  >
                    <span className="action-icon">🗑️</span>
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="comments-section">
            <h2 className="section-title">Comments ({comments.length})</h2>

            {comments.length > 0 ? (
              <ul className="comments-list">
                {comments.map((comment, index) => (
                  <li key={index} className="comment-item">
                    <p>{comment.text}</p>
                    {comment.author_id === userId && (
                      <span className="comment-author-badge">You</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-comments">
                No comments yet. Be the first to comment!
              </p>
            )}

            <div className="comment-form">
              <textarea
                className="comment-input"
                placeholder="Write a comment..."
                value={newComment}
                onChange={handleCommentChange}
              ></textarea>
              <button
                className="comment-submit"
                onClick={handleAddComment}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" text="" /> Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="not-found">Post not found</div>
      )}
    </div>
  );
};

export default DetailsPage;
