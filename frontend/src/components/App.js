import React, { Component  }  from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

const appDiv = document.getElementById("app");

export default class App extends Component {
    constructor (props) {
        super(props);
       // this.state = {};
    }
awidth () {
    return document.documentElement.clientWidth;
}
    render() {
        let a = document.documentElement.clientWidth;
        let b = document.documentElement.clientHeight;
        let appstyle = window.getComputedStyle(appDiv);
        let appwidth = appstyle.getPropertyValue("width");
        let appheight = appstyle.getPropertyValue("height");
        // appDiv.style.width = a;
        return (
            <fieldset className="fieldclass center"><legend>App</legend>
                {/* <BrowserRouter>
                  <ul>
                      <li> <Link to="/join">
                             <svg version="1.1"
                                baseProfile="full"
                                width="50" height="32">
                                <rect width="100%" height="100%" fill="blue" />
                                <text x="10" y="17"   fill="white">Join</text>
                              </svg>
                           </Link>  </li>
                      <li> <Link to="/create">
                              <svg version="1.1" baseProfile="full"
                                width="50" height="32">
                                <rect width="100%" height="100%" fill="blue" />
                                <text x="2" y="17"   fill="white">Create</text>
                              </svg>
                           </Link></li>
                  </ul>
                  <Switch>
                      <Route path="/join"   render={(routeProps) => <RoomJoinPage   {...routeProps} />}  />
                      <Route path="/create" render={(routeProps) => <CreateRoomPage {...routeProps} />} />
                  </Switch>
                </BrowserRouter> */}
                <h4>{this.props.name} {this.props.email} document:{a}x{b} app.js:{appwidth}x{appheight}</h4>
                <HomePage />
            </fieldset>
        );
    }
}

render(<App name="Alex" email="a@gmail.com" />, appDiv);