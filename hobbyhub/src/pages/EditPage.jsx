"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../client";
import "./EditPage.css";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
  });

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("Posts")
          .select()
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching Post:", error);
          navigate("/");
        } else {
          setFormData({
            title: data.title || "",
            content: data.content || "",
            image_url: data.image_url || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.trim() === "") {
      alert("Title is mandatory. Please enter a title.");
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("Posts")
        .update({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating Post:", error);
        alert("Error updating post. Please try again.");
      } else {
        alert("Post updated successfully.");
        navigate(`/details/${id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h1 className="page-title">Edit Post</h1>

        {formData.image_url && (
          <div className="image-preview">
            <img src={formData.image_url || "/placeholder.svg"} alt="Preview" />
          </div>
        )}

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(`/details/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
