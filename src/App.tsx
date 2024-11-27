// App.js
import React, {useState, useEffect} from 'react';
import Tweet from './tweet';
import './App.css'

export interface Tweets {
  id: string,
  username: string,
  content: string,
  likes: number,
  timestamp: string
}

function App() {
  const [tweets, setTweets] = useState<Tweets[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingTweet, setAddingTweet] = useState(false);
  const [formData, setFormData] = useState({tweet: ''})

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
  };

  useEffect(() => {
    fetchTweets();
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  async function createNewTweet() {
    await fetch('http://127.0.0.1:8000/tweets/new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ // Takes your javascript object and it turns it into a string
        username: 'KimberGonzalez',
        content: formData.tweet,
        likes: 0,
        timestamp: (new Date()).toLocaleTimeString()
      })
    })
    setFormData({tweet: ""})
    setAddingTweet(false)
    await fetchTweets();
  }

  return (
    <div className="app">
      <h1>Twitter Clone</h1>
      <div className="feed">
        {tweets.map((tweet) => (
          <div className='tweet-container'>
            <div onClick={async ()=>{
              await fetch('http://127.0.0.1:8000/tweets/' + tweet.id, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
              })
              await fetchTweets();
            }} className='delete-tweet'>
              x
            </div>
            <Tweet
              key={tweet.id}
              id={tweet.id}
              username={tweet.username}
              content={tweet.content}
              likes={tweet.likes} // Pass initial likes instead of onLike
              timestamp={tweet.timestamp}
            />
          </div>
        ))}
      </div>

      {!addingTweet && <div onClick={()=>setAddingTweet(!addingTweet)} className='add-tweet'>+</div>}

      {addingTweet && 
        <div className='overlay'>
          <div onClick={()=>setAddingTweet(!addingTweet)} className='close'>
            x
          </div>
          <h2>Add a new tweet!</h2>
          <div className='form'>
            <form>
              <textarea onChange={(e)=>setFormData({tweet: e.target.value})} value={formData.tweet} />
              <button onClick={createNewTweet}>Create</button>
            </form>
          </div>
        </div>
      }

    </div>
  );
}

export default App;
