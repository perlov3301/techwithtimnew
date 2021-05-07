import React, { Component } from "react";
import { Grid, Button, Typgraphy } from "@material-ui/core";

export default class PlayList extends Component {
    constructor(props) {
        super(props);
        list1=this.props.mylist;
    }
     
    render( ) {
        return (
            <fieldset className="fieldclass">
                <legend>PlayList</legend>
                <Gried item xs={12} align="center" >
                    <Typography variant="h4" component="h4">
                        play List
                    </Typography>
                </Gried>
            </fieldset>
        );
    }
}