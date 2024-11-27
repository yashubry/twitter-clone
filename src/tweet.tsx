// Tweet.js
import React, { useState } from 'react';
import type { Tweets } from './App';

function Tweet({ id, username, content, likes, timestamp }: Tweets) {
  const [numLikes, setLikes] = useState(likes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikes(numLikes + 1); // Increment likes within the component
    } else {
        setLiked(false);
        setLikes(numLikes - 1)
    }
  };

  return (
    <div className="tweet">
      <h4>@{username}</h4>
      <p>{content}</p>
      <p><small>{timestamp} ago</small></p>
      <button onClick={handleLike}>
        {liked ? "❤️" : "🤍"} {numLikes} Like{numLikes === 1 ? "" : "s"}
      </button>
    </div>
  );
}

export default Tweet;
