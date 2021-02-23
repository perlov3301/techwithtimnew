import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

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
        this.getRoomDetails();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettings.bind(this);
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
    updateShowSettings(value) {
        this.setState({ showSettings: value });
    }
    renderSettings() {
       return ( <div>renderSettings</div>
    //        <Grid container spacing={1} >
    //         <Grid item xs={12} align="center" >
    //             <CreateRoomPage 
    //               update={true} 
    //               votesToSkip={this.state.votesToSkip} 
    //               guestCanPause={this.state.guestCanPause}
    //               roomCode={this.roomCode}
    //               updateCallback={() => {}}
    //               />
    //         </Grid>
    //         <Grid iter xs={12} align="center" >
    //             <Button variant="contained" 
    //                color="secondary" 
    //                onClick={() => this.updateShowSettings(false)} >
    //                   Close
    //             </Button>
    //         </Grid>
    //     </Grid>
       );
    }

    renderSettingsButton() {// if you are a Host
        return (
            <Grid item xs={12} align="center" >
                <Button variant="contained" 
                  color="primary" 
                  onClick={() => 
                   {
                       console.log("before click settings Button");
                       return this.updateShowSettings(true);
                   }
                  } >
                      Settings
                  </Button>
            </Grid>
        );
    }

    render() {
        let a = '1_' + this.state.guestCanPause ;
        let b = '2_' + this.state.isHost;
        // if (this.state.showSettings) {
        //     console.log("we are about to render renderSettings");
        //     return this.renderSettings();
        // }
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
                      <Button color="secondary" 
                        variant="contained" 
                        onClick={ this.leaveButtonPressed } >Leave Room
                      </Button>
                  </Grid>
              </Grid>
            </fieldset>
        );
    }
}