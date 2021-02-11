import React, { Component } from "react";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        } ;
        // match is prop how get component /room/:roomCode
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails();
    }
    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode)
          .then((response) => response.json())
          .then((data) => {
              this.setState({
                  votesToSkip: data.votes_to_skip,
                  guestCanPause: data.guest_can_pause,
                  isHost: data.is_host
              })
          });
    }

    render() {
        let a = '1_' + this.state.guestCanPause ;
        let b = '2_' + this.state.isHost;
        return (
            <fieldset className="fieldclass">
                <legend>Room</legend>
                <div>
                    <h3>Room's Code: {this.roomCode}</h3>
                    <p>Votes: {this.state.votesToSkip}</p>
                    <p>Guest can pause: {this.state.guestCanPause.toString()}</p>
                    <p>is a Host: {this.state.isHost.toString()}</p>
                </div>
            </fieldset>
        );
    }
}