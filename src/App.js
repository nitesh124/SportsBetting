import './App.css';
import React, { Component }from 'react';
import axios from 'axios';
import Poll from 'react-polls';

//Edit Poll Question and Options Here
const pollQuestion = 'Which Team Will Win?'
const pollAnswers = [
  { option: 'Home Team', votes: 0 },
  { option: 'Draw', votes: 0 },
  { option: 'Away Team', votes: 0 }
] 

class App extends Component {
   // Here State will apply to the posts object which is set to loading by default
  state = {
    pollingData: [],
    isLoading: true,
    click: -1,
    errors: null,
    pollAnswers: [...pollAnswers],
    voteAnswer: ''
  };
   //On click Increase the click count
  
  // Make a axious request to use data
  getPolls() {
    axios
       // Host the data here
      .get("https://s3-eu-west-1.amazonaws.com/test-assignment/test-assignment.json")
      // get the response and store the data from JSON, and change the loading state here
      .then(({ data })=> {
        var temp = JSON.parse(JSON.stringify(data));
        const { click } = this.state;
        var answer_in_local_storage = this.handleStorage();
    // Generating random Sports Polls
    var click_temp = Math.floor(Math.random() * Math.floor(temp.length));
    console.log(click);
    this.setState({
          pollingData:data,
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
    this.getPolls();
  }
  //To increment the vote on select
 handleVote = voteAnswer => {
    const { pollAnswers, click } = this.state
    var items = localStorage.getItem(click);
    if (items === undefined || items === null || items.length === 0){
    const votes= 0
    var temp
    const newPollAnswers = pollAnswers.map(answer => { 
      if (answer.option === voteAnswer) {
        answer.votes++
        temp = answer
      }
      return answer
    })
    this.setState({
      pollAnswers: newPollAnswers,
      votes:votes
    })
    console.log(temp["option"])
    localStorage.setItem(click, temp["option"])
  } 
  // To Check if the Poll has already been answered or not
  else {
    
    const votes= 0
    var temp
    const newPollAnswers = pollAnswers.map(answer => { 
      if (answer.option === items) {
        answer.votes++
        temp = answer
      }
      return answer
    })
    this.setState({
      pollAnswers: newPollAnswers,
      votes:votes
    })
    alert("you've already voted");
  }
    
  }
  // To store data in browser local storage
  handleStorage= () => {
    const { click } = this.state;
    var items = localStorage.getItem(click);
    if (items === undefined || items === null || items.length === 0)
  {
    return '';
  } else {
    console.log(""+items);
    return items;
  }
  }
  // Rendering the data and using it to get our output
  render() {
    const {  click, isLoading, pollingData, pollAnswers, voteAnswer  } = this.state;
    var temp = JSON.parse(JSON.stringify(pollingData));
    console.log(click);
    var temp2 = JSON.stringify(temp[click]);
    var homeTeam = '';
    var awayTeam = '';
    var name= '';
    if ( temp2 != undefined) {
      temp2 = JSON.parse(temp2);
      homeTeam = "Home Team:" + JSON.stringify(temp2["homeName"]);
      awayTeam = "Away Team:" + JSON.stringify(temp2["awayName"]);
      name = "Tournament Name:" + JSON.stringify(temp2["name"]);
    }
    var items = localStorage.getItem(click);
    var answers = pollAnswers;
    if (items === undefined || items === null || items.length === 0)
  {
  } else {
    answers = items;
  }
// Display the data
    return (
      
      <React.Fragment>
        <div>
          <h1 className="header">Sports Polling</h1>
          </div>
        <div className="main">
          <h2 className="tournament">{name}</h2>
          <a className="homeTeam">{homeTeam}</a>
          <a className="awayTeam">{awayTeam}</a><br/>
          <Poll question={pollQuestion} answers={pollAnswers} onVote={this.handleVote} noStorage vote={this.handleStorage()}/>
          
        </div>
        
      </React.Fragment>
      
    );
  }
}
export default App;
