import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokesToGet: 10,
  };
  constructor(props) {
    super(props);

    //alternative for useState
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  //at mount, get jokes
  componentDidMount() {
    // this.getJokes();
    if (this.state.jokes.length === 0) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  async getJokes() {
    let j = [...this.state.jokes];

    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      //alternative to setJokes(j)
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  }

  /* empty joke list and then call getJokes */

  generateNewJokes() {
    this.setState({ jokes: [] });
    this.componentDidMount();
  }

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    this.setState({
      jokes: this.state.jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    });
  }

  render() {
    const { jokes } = this.state;

    /* render: either loading spinner or list of sorted jokes. */

    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote}
            />
          ))}

        </div>
      );
    }

    return null;
  }
}

export default JokeList;
