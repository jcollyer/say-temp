import React, { useEffect, useState } from "react";
import './index.css';

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

// most popular StackOverflow url validator function: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
const validURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

// https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
const kFormatter = (num) => {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
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
    <>
      {Object.keys(output).map(category => {
        return (
          <div className="category">
            <h1>{category}</h1>
            {output[category].map(({created, thumbnail, title, ups, url}) => {
              return (
                <div className="post">
                  <div className="image">
                    {validURL(thumbnail) && <img src={thumbnail} />}
                  </div>
                  <div className="info">
                    <p className="title">{title}</p>
                    <p>👍 {kFormatter(ups)}</p>
                    <p>🗓 {formatDate(created)}</p>
                    <p>🔗 <a href={url} target="_blank">{url}</a></p>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  );
}

export default App;
