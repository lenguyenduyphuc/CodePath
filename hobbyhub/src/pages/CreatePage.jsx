"use client";

import { useState } from "react";
import { supabase } from "../client";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "./CreatePage.css";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
    image_url: "",
    flag: "general", // Default flag
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createPost = async (event) => {
    event.preventDefault();
    const titleInput = document.getElementById("title");

    if (titleInput.value.trim() === "") {
      alert("Title is mandatory. Please enter a title.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("Posts")
        .insert({
          title: post.title,
          content: post.content,
          image_url: post.image_url,
          flag: post.flag,
          author_id: userId, // Add the user ID to the post
        })
        .select();

      if (error) {
        console.log(error);
        alert("Error creating post. Please try again.");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-page-container">
      <div className="create-page-card">
        <h1 className="page-title">Create New Post</h1>
        <form className="form-container" onSubmit={createPost}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter a descriptive title"
              value={post.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="flag">Post Type</label>
            <select
              id="flag"
              name="flag"
              value={post.flag}
              onChange={handleChange}
              className="form-input"
            >
              <option value="general">General</option>
              <option value="question">Question</option>
              <option value="opinion">Opinion</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your post content here..."
              value={post.content}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              placeholder="Enter an image URL (optional)"
              value={post.image_url}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {post.image_url && (
            <div className="image-preview">
              <img src={post.image_url || "/placeholder.svg"} alt="Preview" />
            </div>
          )}

          <button
            className="submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" text="" /> Creating...
              </>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
