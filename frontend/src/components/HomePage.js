import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } 
  from "@material-ui/core";
import { BrowserRouter as Router, 
    Switch, Route, Link, 
    Redirect } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        // this.renderHomePage = this.renderHomePage.bind(this);
    }
    
   async componentDidMount() {
       fetch("/api/user-in-room")
         .then((response) => response.json())
         .then((data) => {
             console.log("home componentDidMount:", data.code);
             this.setState({
                 roomCode: data.code,
             });
         });
   }
    renderHomePage() {
        return (
            <Grid container spacing={3} >
              <Grid item xs={12} align="center" >
                  <Typography variant="h3" compact="h3" > House Party
                  </Typography>
              </Grid>
              <Grid item xs={12} align="center" >
                  <ButtonGroup disableElevation variant="contained"
                    color="primary" >
                      <Button color="primary"   to="/join" component={ Link } >join a Room
                      </Button>
                      <Button color="secondary" to="/create" component={ Link } >create a Room
                      </Button>
                  </ButtonGroup>
                     
              </Grid>
            </Grid>
        );
    }

    render() {
        return (
            <fieldset className="fieldclass"><legend>HomePage</legend>
                <Router>
                    <Switch>
                        <Route exact path="/" render={this.renderHomePage} />
                        <Route path="/join" component={RoomJoinPage} />
                        <Route path="/create" component={CreateRoomPage} />
                        <Route path="/room/:roomCode" component={Room} /> {/* params 'match' */}
                    </Switch>
                </Router>
            </fieldset>
        );
    }
}