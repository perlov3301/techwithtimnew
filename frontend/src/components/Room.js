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
            spotifyAuthenticated: false,
        } ;
        this.roomCode = this.props.match.params.roomCode;// get component /room/:roomCode
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.upadateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings =       this.renderSettings.bind(this);
        this.getRoomDetails =       this.getRoomDetails.bind(this);
        this.authenticatedSpotify = this.authenticateSpotify.bind(this);
        this.getRoomDetails();
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
              console.log("room getroomdetails data.is_host", data.is_host);
              this.setState({
                  votesToSkip: data.votes_to_skip,
                  guestCanPause: data.guest_can_pause,
                  isHost: data.is_host
              });
              console.log("room getroomdetails state.isHost:", this.state.isHost);
              // if (this.state.isHost) 
              if (data.is_host)
                { this.authenticateSpotify(); }
          });
    }
    sampleMethod() {
        fetch('https://example.com/profile', {
            method: 'POST', // or 'PUT'
            headers: { 'Content-Type': 'application/json', }, // two added comas
            body: JSON.stringify(data),
          })
          .then(response => response.json())
          .then(data => { console.log('Success:', data); })
          .catch((error) => { console.error('Error:', error); });
    }
    authenticateSpotify() {
        fetch("/spotify/is-authenticated")
          //.then(response => response.json())
          .then((response) => {
            console.log("room authenticatespotify;fetch response:", response);
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new TypeError("room authenticatespotify: we haven't got JSON!");
            } 
            return response.json();
         })
          .then((data) => {
              console.log("room authenticatespotify data.status:", data.status);
              this.setState({ spotifyAuthenticated: data.status });
              console.log("room auth state.spotifyAuth:", this.state.spotifyAuthenticated);
              if (!data.status) {
                  fetch("/spotify/get-auth-url")
                    .then(
                      //  (response) => response.json();
                      (response) => {
                        console.log("room auth;fetch !data.status fetch response:", response);
                        const contentType = response.headers.get('Content-Type');
                        if (!contentType || !contentType.includes('application/json')) {
                          throw new TypeError("room auth !data.status: we haven't got JSON!");
                        } 
                        return response.json();
                     }
                        )
                    .then((data) => { // redirect to athorization
                        console.log("room authenticate !data.status=> data.url:", data.url)
                        window.location.replace(data.url);  
                        // window.location.replace("htts://developer.spotify.net");
                    })
              }
          })
          .catch((error) => { console.error("room authenticate catch error:", error); })
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
    async updateShowSettings(value) {
        console.log("room updateShowSettings value:", value);
        this.setState({
            showSettings: value,
        });
        await console.log("room settings:", this.state);
        return true;
    }
    renderSettings () {
        return (
            <fieldset className="fieldclass"><legend> Settings</legend>
            <Grid container spacing={1}>
                
              <Grid item xs={12} align="center">
                 <CreateRoomPage 
                  update={true} 
                  votesToSkip={this.state.votesToSkip}
                  guestCanPause={this.state.guestCanPause} 
                  roomCode={this.roomCode} 
                  updateCallback={this.getRoomDetails} />
                  
              </Grid>
              <Grid item xs={12} align="center">
                <Button 
                  color="secondary"
                  variant="contained"
                  onClick={() => this.updateShowSettings(false)} >Close
                </Button>
              </Grid>
            </Grid>
            <div>renderSettings will be soon here</div>
          </fieldset>
        );
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
        if (this.state.showSettings) {
            return this.renderSettings();
        }
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