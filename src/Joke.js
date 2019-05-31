import React, { Component } from 'react'
import "./Joke.css";

class Joke extends Component{
    getStyle(){
        const {vote} = this.props;
        if(vote >= 15){
            return  {color: "#4CAF50", emoji: "em em-rolling_on_the_floor_laughing"};
        } else if(vote >= 12){
            return {color: "#8BC34A", emoji: "em em-laughing"};
        } else if(vote >= 9){
            return {color: "#CDDC39", emoji: "em em-smiley"};
        } else if(vote >= 6){
            return {color: "#FFEB3B", emoji: "em em-slightly_smiling_face"};
        } else if(vote >= 3){
            return {color: "#FFC107", emoji: "em em-neutral_face"};
        } else if(vote >= 0){
            return {color: "#FF9800", emoji: "em em-confused"};
        } else{
            return {color: "#F44336", emoji: "em em-angry"};
        }
    }

    render(){
        let style = this.getStyle();
        return(
            <div className="Joke">
                <div className="Joke-top">
                    <div className="Joke-emoji">
                        <i className={style.emoji}></i>
                    </div>
                    <div className="Joke-joke">{this.props.text}</div>
                    <i onClick={this.props.remove} className="Joke-clear far fa-window-close"></i>
                </div>
                <div className="Joke-vote">
                    <i className="far fa-thumbs-up" onClick={this.props.upvote}></i>
                    <span id="Joke-vote-circle" style={{borderColor: style.color}}>{this.props.vote}</span>
                    <i className="far fa-thumbs-down" onClick={this.props.downvote}></i>
                </div>
            </div>
        )
    }
}

export default Joke;