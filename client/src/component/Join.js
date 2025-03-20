import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="OuterContiner">
      <div className="InnerContainer">
        <h1 className="heading"></h1>
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-30"
            type="text"
            onChange={(event) => setRoom(event.target.value)}
          />
        </div>
        <Link  onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?${name}&room=${room}`}>
          <button className="button mt-30" type="submit"> Sign in</button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
