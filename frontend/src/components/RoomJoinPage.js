import React, { Component } from "react";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
export default class RoomJoinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "", //  "testcode",
            error: ""
        } ;
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.roomButtonPressed = this.roomButtonPressed.bind(this);
        this.cleanTextField = this.cleanTextField.bind(this);
        
    }
    render() {
        return (
            <fieldset className="fieldclass"> <legend>RoomJoinPage</legend>
                {/* alignItems="center" */}
                <Grid container spacing={1}  >
                    <Grid item xs={12} align="center" >
                        <Typography variant="h4" component="h4" >
                            join a Room
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center" > 
                      <TextField 
                        error={this.state.error}
                        label="Code"
                        placeholder="enter a Room Code" 
                        value={this.state.roomCode}
                        helperText={this.state.error} 
                        variant="outlined" 
                        onChange={this.handleTextFieldChange} />&nbsp;&nbsp;
                        <Button variant="contained" color="primary" 
                          onClick={this.cleanTextField} >reset
                        </Button>
                    </Grid> 
                    <Grid item xs={12} align="center" >
                        <Button variant="contained" color="primary" 
                          onClick={this.roomButtonPressed} 
                          >
                            Enter Room
                        </Button>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <Button  variant="contained" color="secondary"
                          to="/" component={Link} >back Home</Button>
                    </Grid>
                    
                </Grid>
            </fieldset>
        );
    }
    cleanTextField() {
        this.setState({
            roomCode: "",
            error: ""
        });
    }
    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value,
        });
    }
    roomButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: this.state.roomCode
            })
        } ;
        fetch('/api/join-room', requestOptions)
          .then( async (response) => {
              console.log("join-room code:", this.state.roomCode);
              console.log(requestOptions);
              console.log(response);
              if (response.ok) { this.props.history.push(`/room/${this.state.roomCode}`) }
              else { 
                  this.setState({ error: "Room not found" }); 
              }
          }).catch((error) => {
              console.log(error);
          });
    }
}