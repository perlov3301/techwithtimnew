import React, { Component } from "react";
import { Button, ButtonGroup } from     "@material-ui/core";
import Grid from       "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from  "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from      "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link } from "react-router-dom";

export default class CreateRoomPage extends Component {
    defaultVotes = 2;
    constructor(props) {
        super(props);
        this.test1 = React.createRef();
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        };
        this.handleVotesChange =         this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    }
    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }
    handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false
        });
    }
    async handleRoomButtonPressed() {
        const testdata1 = { 
            votes_to_skip:   this.state.votesToSkip,
            guest_can_pause: this.state.guestCanPause,
         };

await fetch('/api/create-room', {
  method: 'POST', // or 'PUT'
  headers: { 'Content-Type': 'application/json', },
  body: JSON.stringify(testdata1),
})
.then(response => { 
    console.log("createRoom response:", response);
    return response.json(); })
.then((data) => { 
    console.log('createRoom data', data); 
    console.log("createRoom history:", this.props.history);
    // this.props.history.push("/room/" + data.code);
    window.location.href = "/room/" + data.code;
  })
.catch((error) => { console.error('createRoom error:', error); });

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                votes_to_skip:   this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        // await fetch("/api/create-room", requestOptions)
        //   .then(response => {
        //     const contentType = response.headers.get('Content-Type');
        //     if (!contentType || !contentType.includes('application/json')) {
        //       throw new TypeError("POST create: we have not got JSON!");
        //     } 
        //     return response.json();
        //   })
        //   .then((data) => {
        //       console.log(data );
        //       this.props.history.push("/room/" + data.code);
        //   })
        //   .catch((error) => { console.error("Error:", error) });

        await fetch('/api/list')
          .then(response => {
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new TypeError("GET list: we haven't got JSON!");
            } 
            return response.json();
         })
          .then((data) => console.log(data))
          .catch(error => console.error(error));
    }
    render() {
        return (
            <fieldset className="fieldclass" >
                <legend>CreateRoomPage</legend>
                <Grid container spacing={1} >
                    <Grid item xs={12} align="center" >
                        <Typography component="h4" variant="h4" >Create A Room</Typography>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <FormControl component="fieldset" >
                            <FormHelperText >
                                <div align="center" >Guest Control of Playback State</div>
                                <RadioGroup row defaultValue="true" alignItems="center"
                                    onChange={this.handleGuestCanPauseChange} >
                                    <FormControlLabel 
                                       value="true" 
                                       control={<Radio color="primary" />}
                                       label="Play/Pause"
                                       labelPlacement="bottom" />
                                    <FormControlLabel 
                                       value="false" 
                                       control={<Radio color="secondary" />}
                                       label="No Control"
                                       labelPlacement="bottom" />
                                </RadioGroup>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <FormControl >
                            <TextField required={true} 
                                type="number"
                                defaultValue={this.defaultVotes}
                                inputProps={{
                                    min: 1,
                                    style: {textAlign: "center"}
                                }}
                                onChange={this.handleVotesChange} />
                                <FormHelperText>
                                    <div align="center">Votes Requered to skip a Song</div>
                                </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <Button color="primary" 
                            variant="contained" 
                            onClick={this.handleRoomButtonPressed} >Create a Room
                        </Button>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <Button color="secondary"
                            variant="contained"
                            to="/" component={Link} >back Home
                        </Button>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <div contentEditable="true" ref="test1" >data: </div>
                    </Grid>
                </Grid>
            </fieldset>
        );
    }
}