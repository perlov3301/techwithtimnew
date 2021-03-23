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
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    };
    constructor(props) {
        super(props);
        this.test1 = React.createRef();
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };
        this.handleVotesChange =         this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleRoomButtonPressed =   this.handleRoomButtonPressed.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
        // console.log("createroom constructor props", this.props);
    }
    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }
    handleGuestCanPauseChange(e) {
        const avalue = e.target.value;
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
  method: 'POST', // or 'PUT' or 'PATCH'
  headers: { 'Content-Type': 'application/json', },
  body: JSON.stringify(testdata1),
})
.then(response => { return response.json(); })
.then((data) => {  this.props.history.push("/room/" + data.code); })
.catch((error) => { console.error('createRoom error:', error); });
        fetch('/api/list')
          .then(response => {
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new TypeError("GET list: we haven't got JSON!");
            } 
            return response.json();
         })
          .then((data) => console.log("create createbutton list:", data))
          .catch(error => console.error(error));
    }

    handleUpdateButtonPressed() {
          const testdata2 = { // update
            votes_to_skip:   this.state.votesToSkip,
            guest_can_pause: this.state.guestCanPause,
            code: this.props.roomCode,
         };
       fetch('/api/update-room', {
           method: 'PATCH', 
           headers: { 'Content-Type': 'application/json', },
           body: JSON.stringify(testdata2),
         })
        .then((response) => { 
           if (response.ok) {  
                  this.setState({ successMsg:"Room was updated" }); } 
           else { this.setState({ errorMsg:"Error while updating Room..." }); }
           return response.json(); 
         })
        .then((data) => {  this.props.updateCallback(); })
        .catch((error) => { console.error('create update error:', error); });
    } // handleUpdateButtonPressed

    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center" >
                        <Button color="primary" 
                            variant="contained" 
                            onClick={this.handleRoomButtonPressed} >
                               create a Room
                        </Button>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <Button color="secondary"
                            variant="contained"
                            to="/" component={Link} >back Home
                        </Button>
                    </Grid>
            </Grid>
        );
    }

    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center" >
              <Button color="primary" 
                variant="contained" 
                onClick={this.handleUpdateButtonPressed} >
                   update Room
              </Button>
           </Grid>
        );
    }
    
    render() {
        this.props.guestCanPause=this.state.guestCanPause;
        const title = this.props.update ? "Update Room" : "Create a Room";
        const pauseState = this.state.guestCanPause.toString();
        const pauseProps = this.props.guestCanPause.toString();
        // console.log("create render pausestate", pauseState);
        // console.log("create render pauseProps", pauseProps);
        return (
            <fieldset className="fieldclass" >
                <legend>CreateRoomPage</legend>
                <Grid container spacing={1} >
                    <Grid item xs={12} align="center">
                        <Collapse 
                          in={this.state.successMsg != "" || this.state.errorMsg != ""}
                        >
                            {this.state.successMsg != "" ? // red or green
                              (<Alert severity="success" // green
                                onClose={() => { this.setState({ successMsg: "" }) }} >
                                    {this.state.successMsg}</Alert>) :
                              (<Alert severity="error"
                                onClose={() => { this.setState({ errorMsg: "" }) }} >
                                    {this.state.errorMsg}</Alert>) }
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <Typography component="h4" variant="h4" >
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center" >
                        <FormControl component="fieldset" >
                            <FormHelperText >
                                <div align="center" >Guest Control of Playback State</div>
                                <RadioGroup row 
                                    alignItems="center"
                                    defaultValue={pauseProps}// {pauseState}
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
                                defaultValue={this.state.votesToSkip}
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
                    {this.props.update 
                     ? this.renderUpdateButtons() 
                     : this.renderCreateButtons()}
                    <Grid item xs={12} align="center" >
                        <div contentEditable="true" ref="test1" >data: </div>
                    </Grid>
                </Grid>
            </fieldset>
        );
    }
}
