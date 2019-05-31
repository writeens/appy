import React, { Component } from 'react'
import uuid from "uuid/v4";
import "./Board.css";
import Joke from "./Joke";
import axios from 'axios';
const JOKE_API = "https://icanhazdadjoke.com/";

class Board extends Component{
    static defaultProps = {
        numJokesToGet: 10
    };
    constructor(props){
        super(props);

        this.state = {jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]" ),
                        loading: false};
        this.jokeSeen = new Set(this.state.jokes.map(joke => joke.text))
        this.updateVote = this.updateVote.bind(this);
        this.getJokes = this.getJokes.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    
    componentDidMount(){
        if(this.state.jokes.length === 0){
            this.getJokes();
        }
    }
    async getJokes(){
        // Load Jokes
        try {
            let jokes = [];
            while(jokes.length < this.props.numJokesToGet){
                this.setState({loading: true})
                let joke = await axios.get(JOKE_API, {
                    headers: { Accept: "application/json" }
                });
                let newJoke = joke.data.joke
                if(!this.jokeSeen.has(newJoke)){
                    jokes.push({id:uuid(), text:newJoke, votes:0})
                }
            }
            // set the state to the jokes retrieved after request and append new jokes to the end
            this.setState(st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes]
            }), () => {
                window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
            })
        } catch(err){
            alert(err);
            this.setState({loading: false})
        }
    }
    // Update votes  
    updateVote(id, change){
        let newJokes = this.state.jokes.map(joke => {
            if(joke.id === id){
                return {...joke, votes: joke.votes + change}
            }else{
                return joke;
            }
        })
        // Passing a callback to setState
        this.setState({jokes: newJokes}, () => {
            window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        })
    }
    handleClick(){
        this.setState({ loading: true}, this.getJokes)
    }
    // Remove Jokes based on Id
    removeJoke(id){
        let newJokes = this.state.jokes.filter(joke => joke.id !== id)
        this.setState({jokes: newJokes}, () => {
            window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        })
    }
    render(){
        if(this.state.loading){
            return(
                <div className="Board-spinner">
                    <i className="far fa-8x fa-spin fa-laugh"></i>
                    <h1 className="Board-title">Loading...</h1>
                </div>
            )
        }
        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes)
        return(
            <div className="Board">
                <div className="Board-sidebar">
                    <h1 className="Board-title">
                        <span>Jokes</span></h1>
                    <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt="laughing Emoji"/>
                    <button onClick={this.handleClick} className="Board-button">New Jokes</button>
                </div>
                <div className="Board-sm">
                    <span className="Board-sm-title">Appy</span>
                    <button onClick={this.handleClick} className="Board-sm-button">New Jokes</button>
                </div>
                <div className="Board-jokes">
                    {jokes.map(joke => <Joke 
                                key={joke.id} 
                                text={joke.text} 
                                id={joke.id} 
                                upvote={() => this.updateVote(joke.id, 1)} 
                                downvote={() => this.updateVote(joke.id, -1)} 
                                vote={joke.votes} remove={() => this.removeJoke(joke.id)} />)}
                </div>
            </div>
        )
    }
}

export default Board;