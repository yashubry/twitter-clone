import React, { useState, useEffect } from 'react';
import Tweet from './tweet';
import './App.css';

export interface Tweets {
  id: string;
  username: string;
  content: string;
  likes: number;
  timestamp: string;
}

function App() {
  const [tweets, setTweets] = useState<Tweets[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingTweet, setAddingTweet] = useState(false);
  const [formData, setFormData] = useState({ tweet: '' });

  // Fetch tweets from API
  async function fetchTweets() {
    try {
      const response = await fetch('http://127.0.0.1:8000/tweets'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: Tweets[] = await response.json();
      setTweets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTweets();
  }, []); // Empty dependency array ensures this runs only once

  // Handle like/unlike functionality
  async function toggleLike(tweetId: string, currentLikes: number) {
    try {
      // Toggle the like count (increment or decrement)
      const updatedLikes = currentLikes === 0 ? 1 : 0; // Toggle between 0 and 1 for simplicity, or use a counter

      await fetch(`http://127.0.0.1:8000/tweets/${tweetId}/like`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likes: updatedLikes,
        }),
      });

      // Update the local state to reflect the change
      setTweets(tweets.map((tweet) =>
        tweet.id === tweetId
          ? { ...tweet, likes: updatedLikes }
          : tweet
      ));
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Handle tweet deletion
  async function deleteTweet(tweetId: string) {
    try {
      await fetch(`http://127.0.0.1:8000/tweets/${tweetId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      await fetchTweets(); // Refresh the tweet list after deletion
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Create a new tweet
  async function createNewTweet() {
    await fetch('http://127.0.0.1:8000/tweets/new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'KimberGonzalez',
        content: formData.tweet,
        likes: 0,
        timestamp: (new Date()).toLocaleTimeString(),
      }),
    });

    setFormData({ tweet: '' });
    setAddingTweet(false);
    await fetchTweets(); // Refresh tweet list after adding
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app">
      <h1>Twitter Clone</h1>
      <div className="feed">
        {tweets.map((tweet) => (
          <div className="tweet-container" key={tweet.id}>
            <div
              onClick={() => deleteTweet(tweet.id)}
              className="delete-tweet"
            >
              x
            </div>
            <Tweet
              id={tweet.id}
              username={tweet.username}
              content={tweet.content}
              likes={tweet.likes}
              timestamp={tweet.timestamp}
              toggleLike={toggleLike} // Pass toggleLike function
            />
          </div>
        ))}
      </div>

      {!addingTweet && (
        <div
          onClick={() => setAddingTweet(!addingTweet)}
          className="add-tweet"
        >
          +
        </div>
      )}

      {addingTweet && (
        <div className="overlay">
          <div
            onClick={() => setAddingTweet(!addingTweet)}
            className="close"
          >
            x
          </div>
          <h2>Add a new tweet!</h2>
          <div className="form">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createNewTweet();
              }}
            >
              <textarea
                onChange={(e) => setFormData({ tweet: e.target.value })}
                value={formData.tweet}
              />
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
