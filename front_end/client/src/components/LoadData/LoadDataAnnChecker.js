import React from "react";

import styles from "./LoadData.module.scss";
import Select from 'react-select';
import * as d3 from "d3";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
//import MainContainer from "../MainContainer/MainContainer";
//import files from '../../csv_files'
//import * as Items from '../../csv_files';
//import listReactFiles from 'list-react-files'
var file_list = [];
//var file_names = [];
const options = [];
//import TextField from 'material-ui';


let serverURL = "http://localhost:3000/";


export default class LoadDataAnnChecker extends React.Component {

    // Loads first CSV and imports the list of CSVs

    constructor(props) {
        super(props);


        this.state = {
            comment: '',
            previousComment: '',
            annID: this.props.annotatorID,
            ecgID: -1
        };

        this.annotation = [];

        file_list = this.importAll(require.context('../../ludb_csv_files', false,  /\.csv$/));
        var file_string = this.importAllNames(require.context('../../ludb_csv_files', false,  /\.csv$/));

        //const {callBack} = this.props

        for(var i = 0; i < file_list.length; i++){
            options.push({ label: file_string[i], value: file_list[i]});
        }

        this.submitClicked = this.submitClicked.bind(this);
        this.setComment = this.setComment.bind(this);
        this.selectFromDB = this.selectFromDB.bind(this);
        this.insertIntoDB = this.insertIntoDB.bind(this);
        this.updateDB = this.updateDB.bind(this);


    }

    // Imports list of CSV files
    importAll(r) {
        return r.keys().map(r);
    }

    // Imports list of CSV file names (readable), to be used for selection
    importAllNames(r){
        return r.keys();
    }




    importAnnotations(csv_name){

        let all_annotations = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
        return all_annotations
    }


    // Sets state for options, and handles which CSV is loaded upon selection
    state = {
        selectedOption: null,
    };
    handleChange = selectedOption => {
        this.clear();
        let ecgID = parseInt(selectedOption.label.substring(2, selectedOption.label.length-4), 10);
        this.selectFromDB(ecgID, this.state.annID);
        this.setState(
            { selectedOption },
            () => this.props.callBack(this.state.selectedOption.value, this.importAnnotations(this.state.selectedOption.label), this.state.selectedOption.label)
        );
    };

    submitClicked = () => {

        let comment = this.state.comment;
        let prev_comment = this.state.previousComment;


        if (comment.length > 0) {

            this.clear();
            if (prev_comment.length > 0) {
                this.updateDB(this.state.ecgID, this.state.annID, comment);
            } else { // Must insert
                this.insertIntoDB(this.state.ecgID, this.state.annID, comment);
            }

        }

    };

    clear = () => {
        // return the state to initial
        this.setState({
            comment: '',
            previousComment: ''
        })
    }

    setComment(value) {
        this.comment = value;
    }


    insertIntoDB(ecgID, annID, comment) {

        var that = this;

        Axios.post(serverURL + "insertCommentLUDB",   {ecgID: ecgID, annID: annID, comment: comment})
            .then(function (response) {
                //handle success
                console.log(response);
                that.selectFromDB(ecgID, annID);
            })
            .catch(function (error) {
                //handle error
                console.log(error);
            });
    }

    updateDB(ecgID, annID, comment) {

        var that = this;

        Axios.post(serverURL + "updateCommentLUDB",   {ecgID: ecgID, annID: annID, comment: comment})
            .then(function (response) {
                //handle success
                console.log(response);
                that.selectFromDB(ecgID, annID);
            })
            .catch(function (error) {
                //handle error
                console.log(error);
            });
    }

    selectFromDB(ecgID, annotatorID) {

        this.state.ecgID = ecgID;

        var that = this;

        const url = new URL(serverURL + "getCommentLUDB"),
            params = {ecgID: ecgID,
                annID: annotatorID};
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        fetch(url)
            .then(function (response) {
                return response.json()
            }).then(function (body) {
            var commentText = '';
            body.forEach(item => {

                commentText += item.Comment;
                that.setState({comment: commentText});
                that.setState({previousComment: commentText});

            });

        });

        //return result;
    }

    // Renders the selectable list at the top
    render () {
        const { selectedOption } = this.state;
        //const { file_names } = this.state;

        return (
            <div className={styles.LoadData}>
                <Select
                    value={selectedOption}
                    onChange={this.handleChange}
                    options={options}
                />
                <div className={styles.commentContainer}>
                    <div className={styles.commentContainer}>
                        <Typography component="subtitle1">
                            Comment:
                        </Typography>
                        <div className={styles.textField}>
                            <TextField

                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="comment"
                                //label="Comment"
                                name="comment"
                                autoComplete="comment"
                                color="secondary"
                                value={this.state.comment}
                                //onChange={e => this.setComment(e.target.value)}
                                onChange={(e)=>{this.setState({comment: e.target.value})}}

                            />
                        </div>
                        <div className={styles.submitButton}>
                            <Button
                                variant="contained"
                                color="primary"

                                //className={classes.submit}
                                onClick = {this.submitClicked}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}