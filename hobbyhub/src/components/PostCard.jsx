import { Link } from "react-router-dom";
import "./PostCard.css";

const PostCard = ({ userPost }) => {
  const createdDate = new Date(userPost.created_at);
  const now = new Date();
  const timeDifference = now - createdDate;

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

  const commentsCount = userPost.comments ? userPost.comments.length : 0;

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

  return (
    <div className="post-card-wrapper">
      <Link className="text-card-link" to={"/details/" + userPost.id}>
        <div className="post-card">
          {userPost.flag && (
            <div className={`post-flag ${getFlagColor(userPost.flag)}`}>
              {userPost.flag.charAt(0).toUpperCase() + userPost.flag.slice(1)}
            </div>
          )}
          <div className="posted-ago-container">
            <h4>
              <span className="posted-label">Posted</span>{" "}
              {formatTimeAgo(timeDifference)}
            </h4>
          </div>
          <div className="post-title-container">
            <h2>{userPost.title}</h2>
          </div>
          <div className="post-up-votes-container">
            <div className="metric">
              <h4>
                {userPost.up_votes} <span>Upvotes</span>
              </h4>
            </div>
            <div className="separator"></div>
            <div className="metric">
              <h4>
                {commentsCount}{" "}
                <span>Comment{commentsCount !== 1 ? "s" : ""}</span>
              </h4>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
