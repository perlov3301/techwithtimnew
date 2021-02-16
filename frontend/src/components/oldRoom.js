import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";

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
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.getRoomDetails();
    }
    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode)
          .then(async (response) => {
              if (!response.ok) {
                 await  this.props.leaveRoomCallback();
                  this.props.history.push("/");
              }
              return response.json();
          } )
          .then((data) => {
              this.setState({
                  votesToSkip: data.votes_to_skip,
                  guestCanPause: data.guest_can_pause,
                  isHost: data.is_host
              })
          });
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        } ;
        fetch("/api/leave-room", requestOptions)
          .then(async (response) => {
              await this.props.leaveRoomCallback();
              this.props.history.push("/");
          } )
          .catch((error) => console.log(error) );
    }
    // leaveRoomCallback() {}

    render() {
        let a = '1_' + this.state.guestCanPause ;
        let b = '2_' + this.state.isHost;
        return (
            <fieldset className="fieldclass"><legend>Room</legend>
              <Grid container spacing={1}>
                  <Grid item xs={12} align="center">
                      <Typography variant="h4" component="h4">
                          Code: {this.roomCode}
                      </Typography>
                  </Grid>
                  <Grid item xs={12} align="center">
                        <Typography variant="h6" component="h6">
                          Votes: {this.state.votesToSkip}
                        </Typography>
                  </Grid>
                  <Grid item xs={12} align="center">
                  <Typography variant="h6" component="h6">
                          Guest can pause: {this.state.guestCanPause.toString()}
                      </Typography>
                  </Grid>
                  <Grid item xs={12} align="center">
                      <Typography variant="h6" component="h6">
                          Host: {this.state.isHost.toString()}
                      </Typography>
                  </Grid>
                  <Grid item xs={12} align="center">
                      <Button color="secondary" variant="contained" 
                        onClick={ this.leaveButtonPressed } >Leave Room
                      </Button>
                  </Grid>
              </Grid>
            </fieldset>
        );
    }
}