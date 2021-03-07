import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { CreateRoomPage  } from "./CreateRoomPage";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
        } ;
        // match is prop how get component /room/:roomCode
        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.getRoomDetails();
        this.upadateShowSettings = this.updateShowSettings.bind(this);
    }
    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode)
          .then((response) => {
              if (!response.ok) {
                  this.props.leaveRoomCallback();
                  this.props.history.push("/");
              }
              return response.json();
          } )
          .then((data) => {
              this.setState({
                  votesToSkip: data.votes_to_skip,
                  guestCanPause: data.guest_can_pause,
                  isHost: data.is_host
              });
          });
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        } ;
        fetch("/api/leave-room", requestOptions)
          .then((response) => {
              console.log("room leaveButton response:", response);
              this.props.leaveRoomCallback();
              this.props.history.push("/");
          } )
          .catch((error) => console.log(error) );
    }

    updateShowSettings(value) {
        console.log("room updateShowSettings value:", value);
        this.setState({
            showSettings: value,
        });
        console.log("showSettings:", this.state.showSettings);
    }

    renderSettings () {
        <fieldset className="fieldclass"><legend>Room</legend>
          <Grid container spacing={1}>
          <Grid item xs={12} align="center">
              { CreateRoomPage }
          </Grid>
          <Grid item xs={12} align="center"></Grid>
          </Grid>
        </fieldset>
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center" >
                <Button variant="contained" 
                  color="primary"
                  onClick={async () =>{ 
                      await console.log("click settings Button");
                      this.updateShowSettings(true);
                      return true;
                    } } >
                      Settings
                </Button> 
            </Grid>
        );
    }

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
                  {this.state.isHost ? this.renderSettingsButton() : null}
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