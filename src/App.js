import "./App.css";
import React, { Component } from "react";
import axios from "axios";
import Poll from "react-polls";

//Edit Poll Question and Options Here
const pollQuestion = "Which Team Will Win?";
const pollAnswers = [
  { option: "Home Team", votes: 0 },
  { option: "Draw", votes: 0 },
  { option: "Away Team", votes: 0 }
];

class App extends Component {
  // Here State will apply to the posts object which is set to loading by default
  state = {
    pollingData: [],
    isLoading: true,
    click: -1,
    errors: null,
    pollAnswers: [...pollAnswers],
    voteAnswer: ""
  };
  //On click Increase the click count

  // Make a axious request to use data
  getPollData() {
    axios
      // Host the data here
      .get(
        "https://s3-eu-west-1.amazonaws.com/test-assignment/test-assignment.json"
      )
      // get the response and store the data from JSON, and change the loading state here
      .then(({ data }) => {
        var temp = JSON.parse(JSON.stringify(data));
        var answer_in_local_storage = this.handleStorage();
        // Generating random Sports Polls
        var click_temp = Math.floor(Math.random() * Math.floor(temp.length));
        console.log(click_temp);
        this.setState({
          pollingData: data,
          /* awayTeam:awayTeam,
          homeTeam:homeTeam, */
          isLoading: false,
          click: click_temp,
          voteAnswer: answer_in_local_storage
        });
      })

      // If we have trouble connecting we can catch the errors here and update it
      .catch(error => this.setState({ error, isLoading: false }));
  }
  // Ready to render the data
  componentDidMount() {
    this.getPollData();
  }
  //To increment the vote on select
  handleVote = voteAnswer => {
    const { pollAnswers, click } = this.state;
    var items = localStorage.getItem(click);
    if (items === undefined || items === null || items.length === 0) {
      const votes = 0;
      var temp;
      const newPollAnswers = pollAnswers.map(answer => {
        if (answer.option === voteAnswer) {
          answer.votes++;
          temp = answer;
          window.location.reload();
          /* window.onload = window.localStorage.clear(); */
        }
        return answer;
      });
      this.setState({
        pollAnswers: newPollAnswers,
        votes: votes
      });
      //console.log(temp["option"])
      localStorage.setItem(click, temp["option"]);
    }
    // To Check if the Poll has already been answered or not
    else {
      const votes = 0;
      var temp;
      const newPollAnswers = pollAnswers.map(answer => {
        if (answer.option === items) {
          answer.votes++;
          temp = answer;
        }
        window.location.reload();
      });
      this.setState({
        pollAnswers: newPollAnswers,
        votes: votes
      });
      alert("you've already voted");
    }
  };
  // To store data in browser local storage
  handleStorage = () => {
    const { click } = this.state;
    var items = localStorage.getItem(click);
    if (items === undefined || items === null || items.length === 0) {
      return "";
    } else {
      console.log("" + items);
      return items;
    }
  };
  // To Clear the Local Storage Data
  clearData = () => {
    window.localStorage.clear();
  };
  // Rendering the data and using it to get our output
  render() {
    const { click, pollingData, pollAnswers } = this.state;
    var temp = JSON.parse(JSON.stringify(pollingData));
    console.log(click);
    var temp2 = JSON.stringify(temp[click]);
    var homeTeam = "";
    var awayTeam = "";
    var name = "";
    if (temp2 != undefined) {
      temp2 = JSON.parse(temp2);
      homeTeam = JSON.stringify(temp2["homeName"]);
      awayTeam = JSON.stringify(temp2["awayName"]);
      name = "Tournament Name:" + JSON.stringify(temp2["name"]);
    }
    var items = localStorage.getItem(click);
    var itemsLength= Object.keys(localStorage.length);
    var answers = pollAnswers;
    console.log(itemsLength);
    if (items === undefined || items === null || items.length === 0) {
    } else {
      answers = items;
    }
    if (itemsLength === 18) {
      alert("You have voted all the Events")
    }
    
    // Display the data
    return (
      <React.Fragment>
        <div>
          <h1 className="header">Sports Polling</h1>
        </div>
        <div className="main">
          <h2 className="tournament">{name}</h2>
          <ul>
            <a className="homeTeamTitle">Home Team</a>
            <p className="homeTeam">{homeTeam}</p>
          </ul>
          <ul>
            <a className="awayTeamTitle">Away Team</a>
            <p className="awayTeam">{awayTeam}</p>
            <br />
          </ul>
          <Poll
            question={pollQuestion}
            answers={pollAnswers}
            onVote={this.handleVote}
            noStorage
            vote={this.handleStorage()}
          />
        </div>
        <div>
          <button className="button" onClick={this.clearData}>
            Reset Voting
          </button>
        </div>
      </React.Fragment>
    );
  }
}
export default App;