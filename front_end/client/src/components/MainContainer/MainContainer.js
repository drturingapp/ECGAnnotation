
import React from "react";
import styles from "./MainContainer.module.scss";
//import grid_styles from "../Grid/Grid.module.scss"
//import control_styles from "../ControlPanel/ControlPanel.module.scss"
import Grid from "../Grid/Grid";
import GridItem from "../Grid/GridItem/GridItem";
import Metadata from "../Metadata/Metadata";
import metaData from "../Metadata/meta.csv"
import LoadData from "../LoadData/LoadData";
import Header from "../Header/Header";
import Graph from "../Graph"
//import ControlPanel from "../ControlPanel/ControlPanel";
import * as d3 from 'd3';
//import Canvas from 'canvas'
//import { fontWeight } from "@material-ui/system";
import  KeyHandler,{ KEYPRESS } from 'react-key-handler';
import {SketchField, Tools} from "react-sketch";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import axios from "axios";
let data = "";

// Set constant colors here
let colorP2 = 'rgb(217, 128, 250)';
let colorP = 'rgb(250, 50, 250)';
let colorQ = 'rgb(247, 159, 31)';
let colorR = 'rgb(234, 32, 39)';
let colorR2 = 'rgb(237, 115, 146)';
let colorS = 'rgb(163, 203, 56)';
let colorS2 = 'rgb(0, 230, 0)';
let colorT = 'rgb(6, 82, 221)';
let colorT2 = 'rgb(18, 137, 167)';
let colorOn = 'rgb(27, 20, 100)';
let colorOff = 'rgb(111, 30, 81)';

/**
 * The MainContainer component is the outermost component in the heirarchy and contains the Grid,
 * Metadata, LoadData and Header components. Much of the setup for the application, parsing of CVS,
 * and data passing are done in this file
 */
export default class MainContainer extends React.Component {

    base64String = '';

    /**
     * Constructor is used to set the format for initial state which is later set and passed
     * to downstream components. It also defines some React references and function bindings
     */
    constructor(props){
        super(props);


        // Refs for each radio button
        this.pRef = React.createRef();
        this.p2Ref = React.createRef();
        this.qRef = React.createRef();
        this.rRef = React.createRef();
        this.r2Ref = React.createRef();
        this.sRef = React.createRef();
        this.s2Ref = React.createRef();
        this.tRef = React.createRef();
        this.t2Ref = React.createRef();
        this.onsetRef = React.createRef();
        this.offsetRef = React.createRef();
        this.password = '';

        // Bind functions to 'this'
        this.dataCallBack = this.dataCallBack.bind(this)
        this.changeForm = this.changeForm.bind(this);
        this.setRadioButton = this.setRadioButton.bind(this);
        this.clearRadioButtons = this.clearRadioButtons.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.submitClicked = this.submitClicked.bind(this);
        this.setComment = this.setComment.bind(this);

        // Set initial state
        this.state={
            labels: [],
            i: '', ii: '', iii: '',
            avr: '', avl: '', avf: '',
            v1: '', v2: '', v3: '', v4: '', v5: '', v6: '',
            p: '', q: '', r: '', r2: '', s: '', t: '', t2: '', onset: '', offset: '',
            extra_info: {
                min: 0,
                max: 0,
                selectedAnnotation: -1
            },
            metadata: {
                patientID: 0,
                scanID: 0,
                gender: '',
                age: 0,
                race: '',
                height: 0,
                weight: 0,
                acquisitionDateTime: '',
                sampleBase: 0
            },
            annotatorID: this.props.history.location.state.detail,
            annotations_all: []
        }

        this.createBackgroundImage(250) // Start with a default frequency of 250
    }

    // Callback function passed to LoadData, to get which CSV to load in
    dataCallBack(update, annotations, scan){
        // Clear all radio buttons
        this.pRef.current.checked = false;
        this.p2Ref.current.checked = false;
        this.qRef.current.checked = false;
        this.rRef.current.checked = false;
        this.r2Ref.current.checked = false;
        this.sRef.current.checked = false;
        this.s2Ref.current.checked = false;
        this.tRef.current.checked = false;
        this.t2Ref.current.checked = false;
        this.onsetRef.current.checked = false;
        this.offsetRef.current.checked = false;

        //console.log(update)
        data = update
        this.parseData();
        //console.log("THIS is update: " + update)
        this.parseMetaData(scan)


        var annotations = new Array(12);

        for (var i = 0; i < annotations.length; i++) {
            annotations[i] = new Array(11);
            for (var j = 0; j < annotations[i].length; j++) {
                annotations[i][j] = new Array(4);
                //var temp = this.state.metadata.scanID;
                let scanID = Number(scan.replace(/\D/g,''));
                let annID = this.state.annotatorID;
                let leadID = i;
                switch (leadID) {
                    case 1:
                        leadID = 4;
                        break;
                    case 2:
                        leadID = 1;
                        break;
                    case 3:
                        leadID = 2;
                        break;
                    case 4:
                        leadID = 5;
                        break;
                    case 5:
                        leadID = 3;
                        break;
                }
                annotations[i][j] = [scanID, leadID, annID, j];
            }
        }

        this.setState({
            data: update,
            annotations_all: annotations
        })
        this.forceUpdate();
    }


    parseMetaData(scan){
        let scanID = Number(scan.replace(/\D/g,''))
        /*console.log('scanID')
        console.log(scanID)
        console.log('scan')
        console.log(scan)*/
        let ecg_ID = [];
        let patient_ID = [];
        let gender = [];
        let race = [];
        let age = [];
        let height = [];
        let weight = [];
        let ac_Date = [];
        let ac_Time = [];
        let sample_base = [];

        let correctDataRead = false;
        let md = {
            ECGID: 0,
            PatientID: 0,
            Gender: 0,
            Race: 0,
            Age: 0,
            Height: 0,
            Weight: 0,
            AcquisitionDate: 0,
            AcquisitionTime: 0,
            SampleBase: 0
        }
        //metaData is a globle variable containing the hardcoded location of the same metadata CSV
        var metadata = d3.csv(metaData, function(metaData) {
            let ecgID = Number(metaData["ECG ID"]);

            if(ecgID === scanID && !correctDataRead){
                //console.log('   correct data read inn');
                correctDataRead = true
                md.ECGID = metaData["ECG ID"]
                md.PatientID = metaData["Patient ID"]
                md.Gender = metaData["Gender"];
                md.Race = metaData["Race"];
                md.Age = metaData["Age"];
                md.Height = metaData["Height"];
                md.Weight = metaData["Weight"];
                md.AcquisitionDate = metaData["Date"];
                md.AcquisitionTime = metaData["Time"];
                md.SampleBase = metaData["Frequency"];
            }
            return md;
        });

        metadata.then(data => {
            if(data[1]) {
                ecg_ID.push(data[1].ECGID);
                patient_ID.push(data[1].PatientID);
                gender.push(data[1].Gender);
                race.push(data[1].Race);
                age.push(data[1].Age);
                height.push(data[1].Height);
                weight.push(data[1].Weight);
                ac_Date.push(data[1].AcquisitionDate);
                ac_Time.push(data[1].AcquisitionTime);
                sample_base.push(data[1].SampleBase);

                let annID = this.state.annotatorID;
                var annName = '';
                if (annID == 1) {
                    annName = 'Gab';
                } else if (annID == 2) {
                    annName = 'Jake';
                } else if (annID == 3) {
                    annName = 'Baha';
                } else if (annID == 4) {
                    annName = 'Seb';
                }

                this.setState({
                    metadata: {
                        patientID: patient_ID[0],
                        scanID: ecg_ID[0],
                        gender: gender[0],
                        age: age[0],
                        race: race[0],
                        height: height[0],
                        weight: weight[0],
                        acquisitionDateTime: ac_Date[0] + " @ " + ac_Time[0],
                        sampleBase: sample_base[0],
                        annName: annName
                    }
                });

                // Reparse the data bc the frequency has been updated...
                //this.parseData();
                this.createBackgroundImage(this.state.metadata.sampleBase)

                this.parseData();
            } else {
                // Otherwise no data was found with the corresponding metadata file
                console.log('no metadata information was found with the scanID given')
            }

            // setState and createBackgroundImage was here before...

        });
    }

    createData(type, mimetype) {
        return {
            type:type,
            value:mimetype
        }
    }

    /**
     * @brief This method is used to dynamically size the background grid based on sampling frequency
     */
    createBackgroundImage(freq){
        let canvas = document.createElement('canvas');
        //console.log(freq)

        const CONSTANT = 15;
        const TIME = 5;
        let winWidth = window.screen.width;
        let containerSize = winWidth * .95
        let actualWidth = containerSize - CONSTANT
        const boxesper10 = (TIME/0.2)

        // Calculate the correct size of the box
        let side_length = Math.ceil(actualWidth/boxesper10) - 2

        canvas.height = side_length;
        canvas.width = side_length;

        console.log('Window width = ' + winWidth);
        console.log('Actual width = ' + actualWidth);
        console.log('Side length = ' + side_length);

        let context = canvas.getContext("2d");
        context.lineWidth = 0.75;
        context.strokeStyle = "gray";
        context.rect(0,0,side_length,side_length); // x-pos,y-pos,width,height
        context.stroke(); // Draw the main rectangle

        // Change line settings for minor ticks
        context.lineWidth = 0.5;
        context.strokeStyle = "lightgray";

        // One main tick is 0.2s, each minor is 0.04 so there are 5 minor ticks to 1 major tick
        let unit = side_length/5;
        // Loop through and fill the big square with small squares
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                if(i > 0){
                    context.rect(i*unit,j*unit,unit, unit) // x-pos,y-pos,width,height
                } else {
                    context.rect(i*unit,j*unit,unit, unit) // x-pos,y-pos,width,height
                }
            }
        }
        context.stroke(); // Draw all the minor rectangles

        // Convert to base64 and set as variable
        this.base64String = canvas.toDataURL("grid_background/png");
    }


    /**
     * @brief This method handles parsing the data of a selected CSV using d3.csv
     * After parsing, it sets the state accordingly. It also saves the max and min
     * input values for a data set which we leverage to dynamically size graphs in graph.js
     */
    parseData(){

        //console.log('parseData() entered');
        //Define arrays
        let lead_i = [];
        let lead_ii = [];
        let lead_iii = [];
        let lead_avr = [];
        let lead_avl = [];
        let lead_avf = [];
        let lead_v1 = [];
        let lead_v2 = [];
        let lead_v3 = [];
        let lead_v4 = [];
        let lead_v5 = [];
        let lead_v6 = [];

        let labels = [];

        //Define Min/Max trackers
        let max = 0;
        let min = 0;
        var parsed_csv = d3.csv(data, function(d)
        {
            //console.log(this.state.data)
            //Function is neccessary to handle the fact that the CSV has spaces AND commas
            //The left hand side of each line defines a new field to handle spaces before field names
            //The + is used to convert each data point to an integer since they are read in as strings w/ leading space
            return {
                I: +d["I"],
                II: +d["II"],
                III: +d["III"],
                aVR: +d["aVR"],
                aVL: +d["aVL"],
                aVF: +d["aVF"],
                V1: +d["V1"],
                V2: +d["V2"],
                V3: +d["V3"],
                V4: +d["V4"],
                V5: +d["V5"],
                V6: +d["V6"]
            }
        });

        //Resolve the returned promise to gain access to the newly created array
        //Then iterate through it and assign the correct values to the correct arrays
        //console.log('parsing data csv');
        parsed_csv.then((data) => {
            let freq = Number(this.state.metadata.sampleBase);
            //console.log("data[0]");
            //console.log(data[0]);
            for(var i = 0; i < data.length; i++){
                labels.push(i);
                // Way to create scatterplot data
                lead_i.push({
                    x:(i * 1/freq),
                    y:data[i].I
                });
                lead_ii.push({
                    x:(i * 1/freq),
                    y:data[i].II
                });
                lead_iii.push({
                    x:(i * 1/freq),
                    y:data[i].III
                });
                lead_avr.push({
                    x:(i * 1/freq),
                    y:data[i].aVR
                });
                lead_avl.push({
                    x:(i * 1/freq),
                    y:data[i].aVL
                });
                lead_avf.push({
                    x:(i * 1/freq),
                    y:data[i].aVF
                });
                lead_v1.push({
                    x:(i * 1/freq),
                    y:data[i].V1
                });
                lead_v2.push({
                    x:(i * 1/freq),
                    y:data[i].V2
                });
                lead_v3.push({
                    x:(i * 1/freq),
                    y:data[i].V3
                });
                lead_v4.push({
                    x:(i * 1/freq),
                    y:data[i].V4
                });
                lead_v5.push({
                    x:(i * 1/freq),
                    y:data[i].V5
                });
                lead_v6.push({
                    x:(i * 1/freq),
                    y:data[i].V6
                });

                // Check for max / min for each array

                if (lead_i[i].y < min){ min = lead_i[i].y }
                if (lead_i[i].y > max){ max = lead_i[i].y }

                if (lead_ii[i].y < min){ min = lead_ii[i].y }
                if (lead_ii[i].y > max){ max = lead_ii[i].y }

                if (lead_iii[i].y < min){ min = lead_iii[i].y }
                if (lead_iii[i].y > max){ max = lead_iii[i].y }

                if (lead_avr[i].y < min){ min = lead_avr[i].y }
                if (lead_avr[i].y > max){ max = lead_avr[i].y }

                if (lead_avl[i].y < min){ min = lead_avl[i].y }
                if (lead_avl[i].y > max){ max = lead_avl[i].y }

                if (lead_avl[i].y < min){ min = lead_avl[i].y }
                if (lead_avl[i].y > max){ max = lead_avl[i].y }

                if (lead_avf[i].y < min){ min = lead_avf[i].y }
                if (lead_avf[i].y > max){ max = lead_avf[i].y }

                if (lead_v1[i].y < min){ min = lead_v1[i].y }
                if (lead_v1[i].y > max){ max = lead_v1[i].y }

                if (lead_v2[i].y < min){ min = lead_v2[i].y }
                if (lead_v2[i].y > max){ max = lead_v2[i].y }

                if (lead_v3[i].y < min){ min = lead_v3[i].y }
                if (lead_v3[i].y > max){ max = lead_v3[i].y }

                if (lead_v4[i].y < min){ min = lead_v4[i].y }
                if (lead_v4[i].y > max){ max = lead_v4[i].y }

                if (lead_v5[i].y < min){ min = lead_v5[i].y }
                if (lead_v5[i].y > max){ max = lead_v5[i].y }

                if (lead_v6[i].y < min){ min = lead_v6[i].y }
                if (lead_v6[i].y > max){ max = lead_v6[i].y }

            }

            // Update the state and cause a re-render
            this.setState({
                labels: labels,
                i: lead_i,
                ii: lead_ii,
                iii: lead_iii,
                avr: lead_avr,
                avl: lead_avl,
                avf: lead_avf,
                v1: lead_v1,
                v2: lead_v2,
                v3: lead_v3,
                v4: lead_v4,
                v5: lead_v5,
                v6: lead_v6,
                extra_info: {
                    min: min,
                    max: max
                }
            })
        })
    }

    /**
     * @brief React method called here in order to ensure parseMetaData() and parseAnnotations()
     * are called when the component is rendered.
     */
    componentWillMount(){
        //console.log('componentWillMount()')
        // Parse the metaData
        // this.parseMetaData();

        // Parse the data
        this.parseData();

    }

    // Takes a number, not an event
    // The number should be from 0-4 and is gotten in the event from event.target.value
    // Theses are the values of the radioButtons and will tell which annotation set to add
    changeForm(value){
        this.setState({
            extra_info:{
                min: this.state.extra_info.min,
                max: this.state.extra_info.max,
                selectedAnnotation: Number(value)
            }
        });
    }

    /**
     *
     * @brief Method that takes an event representing a key press and correctly sets the radio selection
     * representing which annotation will be added. Used to enable hotkey selection for rapid addition
     *
     * @param {*} event
     */
    setRadioButton(event){
        // Check the selected button as well as make sure to call the
        // function that changes the state to reflect the button change
        if(event.key === 'p'){
            this.pRef.current.checked = true;
            this.changeForm('0');
        }
        else if(event.key === 'o'){
            this.p2Ref.current.checked = true;
            this.changeForm('1');
        }
        else if(event.key === 'q'){
            this.qRef.current.checked = true;
            this.changeForm('2');
        }
        else if(event.key === 'r'){
            this.rRef.current.checked = true;
            this.changeForm('3');
        }
        else if(event.key === 'f'){
            this.r2Ref.current.checked = true;
            this.changeForm('4');
        }
        else if(event.key === 's'){
            this.sRef.current.checked = true;
            this.changeForm('5');
        }
        else if(event.key === 'd'){
            this.s2Ref.current.checked = true;
            this.changeForm('10');
        }
        else if(event.key === 't'){
            this.tRef.current.checked = true;
            this.changeForm('6');
        }
        else if(event.key === 'b'){
            this.t2Ref.current.checked = true;
            this.changeForm('7');
        }
        else if(event.key === 'z'){
            this.onsetRef.current.checked = true;
            this.changeForm('8');
        }
        else if(event.key === 'x'){
            this.offsetRef.current.checked = true;
            this.changeForm('9');
        }
    }

    // Clears all the radio buttons and sets the selected radio button value to -1 (none selected)
    clearRadioButtons(event){
        // Handles ONLY the escape key
        if(event.keyCode === 27){
            //console.log('esc');

            // Uncheck all the radio buttons
            this.pRef.current.checked = false;
            this.p2Ref.current.checked = false;
            this.qRef.current.checked = false;
            this.rRef.current.checked = false;
            this.sRef.current.checked = false;
            this.s2Ref.current.checked = false;
            this.tRef.current.checked = false;
            this.r2Ref.current.checked = false;
            this.t2Ref.current.checked = false;
            this.onsetRef.current.checked = false;
            this.offsetRef.current.checked = false;

            // Set 'selected annotaion value to -1'
            this.changeForm('-1');
        }
    }

    // Use this only for handling the escape key
    componentDidMount(){
        document.addEventListener("keydown", this.clearRadioButtons, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.clearRadioButtons, false);
    }

    submitClicked = () => {
        let comment = this.comment;
    };

    setComment(value) {
        this.comment = value;
    }

    render() {
        // Style json for radio button
        const radioStyle= {
            position: 'sticky',
            marginRight: 0,
            top: 50,
            float: 'right',
            width: 40,
            height: 100,
            fontWeight: 'bold'
        };

        return (
            <React.Fragment>

                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue='escape'
                    onKeyHandle={this.clearRadioButtons}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="p"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="o"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="q"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="r"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="f"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="s"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="d"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="t"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="b"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="z"
                    onKeyHandle={this.setRadioButton}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="x"
                    onKeyHandle={this.setRadioButton}
                />

                <div className={styles.container}>
                    <div className={styles.headerGrid}>
                        <Header annID={this.state.annotatorID}/>
                        <div className={styles.directions}>
                            <h2 className={styles.directionText}>Please select a file from the dropdown below</h2>
                        </div>
                    </div>
                    <div className={styles.metadataGrid}>
                        <Metadata metadata= {this.state.metadata}/>
                        <LoadData annotatorID={this.state.annotatorID} callBack={this.dataCallBack} className={styles.loadData}/>
                    </div>




                    <div style={radioStyle} onChange={(e) => this.changeForm(e.target.value)}>
                        <div style={{position:'absolute', fontWeight: 'bold'}}>ADD</div>
                        <br />
                        <div style={{position:'absolute', color: colorP, marginTop: 0}}>
                            <input type="radio" ref={this.pRef} value="0" name="annotation"/> P
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorP2, marginTop: 0}}>
                            <input type="radio" ref={this.p2Ref} value="1" name="annotation"/> P2
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorQ, marginTop: 0}}>
                            <input type="radio" ref={this.qRef} value="2" name="annotation"/> Q
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorR, marginTop: 0}}>
                            <input type="radio" ref={this.rRef} value="3" name="annotation"/> R
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorR2, marginTop: 0}}>
                            <input type="radio" ref={this.r2Ref} value="4" name="annotation"/> R2
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorS, marginTop: 0}}>
                            <input type="radio" ref={this.sRef} value="5" name="annotation"/> S
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorS2, marginTop: 0}}>
                            <input type="radio" ref={this.s2Ref} value="10" name="annotation"/> S2
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorT, marginTop: 0}}>
                            <input type="radio" ref={this.tRef} value="6" name="annotation"/> T
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorT2, marginTop: 0}}>
                            <input type="radio" ref={this.t2Ref} value="7" name="annotation"/> T2
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorOn, marginTop: 0}}>
                            <input type="radio" ref={this.onsetRef} value="8" name="annotation"/> +
                        </div>
                        <br />
                        <div style={{position:'absolute', color: colorOff, marginTop: 5}}>
                            <input type="radio" ref={this.offsetRef} value="9" name="annotation"/> -
                        </div>
                        <br />
                    </div>

                    <Grid >
                            <div className={styles.graphBackground} style = {{ backgroundImage: 'url('+this.base64String+')', backgroundRepeat: 'repeat'}}>
                                <GridItem inputArr={{data: this.state.i, title: "I", labels: this.state.labels, annotations_all: this.state.annotations_all[0], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.avl, title: "aVL", labels: this.state.labels, annotations_all: this.state.annotations_all[1], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.ii, title: "II", labels: this.state.labels, annotations_all: this.state.annotations_all[2], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.iii, title: "III", labels: this.state.labels, annotations_all: this.state.annotations_all[3], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.avf, title: "aVF", labels: this.state.labels, annotations_all: this.state.annotations_all[4], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.avr, title: "aVR", labels: this.state.labels, annotations_all: this.state.annotations_all[5], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.v1, title: "V1", labels: this.state.labels, annotations_all: this.state.annotations_all[6], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.v2, title: "V2", labels: this.state.labels, annotations_all: this.state.annotations_all[7], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.v3, title: "V3", labels: this.state.labels, annotations_all: this.state.annotations_all[8], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.v4, title: "V4", labels: this.state.labels, annotations_all: this.state.annotations_all[9], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.v5, title: "V5", labels: this.state.labels, annotations_all: this.state.annotations_all[10], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                                <GridItem inputArr={{data: this.state.v6, title: "V6", labels: this.state.labels, annotations_all: this.state.annotations_all[11], extra_info: this.state.extra_info, freq: this.state.metadata.sampleBase, scanID: this.state.metadata.scanID, annotatorID: this.state.annotatorID, all_data: this.state}}/>
                            </div>
                        </Grid>


                </div>
            </React.Fragment>
        );
    }
}
