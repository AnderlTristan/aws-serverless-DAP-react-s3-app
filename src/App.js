import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [barcode, setBarcode] = useState("");
  const [servingSize, setServingSize] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("https://6pzjjady0e.execute-api.us-west-1.amazonaws.com/dev/food", {
        method: "POST",
        mode: 'no-cors',
        body: JSON.stringify({
          barcode: barcode,
          servingSize: servingSize,
          name: name,
        }),
      });
      let resJson = await res.json();
      console.log(resJson);
      if (res.status === 200) {
        setName("");
        setBarcode("");
        setServingSize(0);
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch(`https://6pzjjady0e.execute-api.us-west-1.amazonaws.com/dev/foods`)
      .then((response) => {
        console.log(response);
      })
      .then((actualData) => {
        setData(actualData);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Food Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={barcode}
          placeholder="Barcode"
          onChange={(e) => setBarcode(e.target.value)}
        />
        <input
          type="text"
          value={servingSize}
          placeholder="Serving Size (grams)"
          onChange={(e) => setServingSize(e.target.value)}
        />
        <button type="submit">Create</button>
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
      
      <div>
        <h1>Foods</h1>
        {loading && <div>A moment please...</div>}
        {error && (
          <div>{`There is a problem fetching the post data - ${error}`}</div>
        )}
        <ul>
          {data &&
            data.map(datum => (
              <li key={datum.foodId}>
                <h3>{datum.name}</h3>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default App;