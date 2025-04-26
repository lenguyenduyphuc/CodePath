"use client";

import { useState, useEffect } from "react";
import { supabase } from "../client";
import "./MainPage.css";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const MainPage = ({ searchTerm = "" }) => {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      let { data, error } = await supabase.from("Posts").select();

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      // Filter by search term if provided
      if (searchTerm) {
        data = data.filter((post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by flag if not "all"
      if (activeFilter !== "all") {
        data = data.filter((post) => post.flag === activeFilter);
      }

      // Sort posts based on selected order
      if (sortOrder === "newest") {
        data = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      } else if (sortOrder === "mostPopular") {
        data = data.sort((a, b) => b.up_votes - a.up_votes);
      }

      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [sortOrder, searchTerm, activeFilter]);

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="main-container">
      <div className="main-content">
        <div className="controls-container">
          <div className="sort-controls">
            <h4>Order by:</h4>
            <div className="sort-buttons">
              <button
                className={`sort-button ${
                  sortOrder === "newest" ? "active" : ""
                }`}
                onClick={() => handleSortOrderChange("newest")}
              >
                Newest
              </button>
              <button
                className={`sort-button ${
                  sortOrder === "mostPopular" ? "active" : ""
                }`}
                onClick={() => handleSortOrderChange("mostPopular")}
              >
                Most Popular
              </button>
            </div>
          </div>

          <div className="filter-controls">
            <h4>Filter by:</h4>
            <div className="filter-buttons">
              <button
                className={`filter-button ${
                  activeFilter === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("all")}
              >
                All
              </button>
              <button
                className={`filter-button ${
                  activeFilter === "general" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("general")}
              >
                General
              </button>
              <button
                className={`filter-button ${
                  activeFilter === "question" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("question")}
              >
                Questions
              </button>
              <button
                className={`filter-button ${
                  activeFilter === "opinion" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("opinion")}
              >
                Opinions
              </button>
              <button
                className={`filter-button ${
                  activeFilter === "announcement" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("announcement")}
              >
                Announcements
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <LoadingSpinner text="Loading posts..." />
          </div>
        ) : (
          <div className="posts-grid">
            {posts.length === 0 ? (
              <div className="no-posts">
                <h2>No posts found</h2>
                <p>
                  {searchTerm
                    ? "Try a different search term"
                    : activeFilter !== "all"
                    ? "No posts in this category"
                    : "Create your first post!"}
                </p>
              </div>
            ) : (
              posts.map((userPost) => (
                <PostCard key={userPost.id} userPost={userPost} />
              ))
            )}
          </div>
        )}
      </div>

      <Link to="/create" className="create-post-button">
        <span className="button-icon">+</span>
        <span className="button-text">Create Post</span>
      </Link>
    </div>
  );
};

export default MainPage;
