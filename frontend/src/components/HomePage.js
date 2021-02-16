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
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }
    
   async componentDidMount() {
       fetch("/api/user-in-room")
         .then((response) => {
             let a = response.json();
             console.log("home componentDdMount:", a);
             return a;
         } )
         .then((data) => {
             console.log("home componentDidMount data.code:", data.code);
             this.setState({ roomCode: data.code, });
         })
         .catch((error) => { console.log("home:", error) });
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
    clearRoomCode() {
        console.log("home clearRoomCode");
        this.setState({
            roomCode: null,
        });
    }

    render() {
        return (
            <fieldset className="fieldclass"><legend>HomePage</legend>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => {
                            return this.state.roomCode ? 
                              ( <Redirect to={`/room/${this.state.roomCode}`} /> ) : ( 
                                  this.renderHomePage() )
                        }} />
                        <Route path="/join" component={RoomJoinPage} />
                        <Route path="/create" component={CreateRoomPage} />
                        <Route 
                          path="/room/:roomCode" 
                          render={(props) => 
                            {
                              return (<Room {...props} leaveRoomCallback={this.clearRoomCode} />);
                            }
                          }
                        />
                        {/* component={Room} /> params 'match' */}
                    </Switch>
                </Router>
            </fieldset>
        );
    }
}