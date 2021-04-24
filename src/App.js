import React, { useEffect, useState } from "react";

// helper functions would come from another file in real-world use case.
const sortCategoryHelper = (data) => {
  return data.reduce((a,b) => {
    if(a[b.data.subreddit]) {
      return {...a, [b.data.subreddit]: [...a[b.data.subreddit], b.data].sort((a,b) => (a.ups > b.ups) ? -1 : 1)};
    } else {
      return {...a, [b.data.subreddit]: [b.data]};
    }
  }, {})
}

const formatDate = (number) => {
  const pubDate = new Date();
  const jsNumber = pubDate.setTime(number * 1000);
  return new Date(jsNumber).toLocaleDateString("en-US");
}

function App() {
  const [output, setOutput] = useState({});

  useEffect(() => {
    getRedditData();
  },[]);


  const getRedditData = async () => {
   return await fetch('https://www.reddit.com/.json')
    .then(response => response.json())
    .then(({data}) => sortCategoryHelper(data.children))
    .then((sorted) => setOutput(sorted))
  }

  return (
    <div>
        {Object.keys(output).map(category => {
          return (
            <div className="category">
              <h1>{category}</h1>
              {output[category].map(({created, thumbnail, title, ups, url}) => {
                const formattedDate = formatDate(created);
                return (
                  <div>
                    <img src={thumbnail} />
                    <p>{title}</p>
                    <p>{formattedDate}</p>
                    <p>{ups}</p>
                    <p><a href={url} target="_blank"/></p>
                  </div>
                )
              })}
            </div>
          )
        })}
    </div>
  );
}

export default App;
