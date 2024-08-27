import React, {Component} from 'react';
import {Scatter} from 'react-chartjs-2';
import * as d3 from 'd3';
import Axios from 'axios';
import {SketchField, Tools} from 'react-sketch';
import { Line } from 'react-lineto';

// Set constant colors here
let lightOpacity = .2;
let colorP = 'rgb(250, 50, 250)';
let colorPOpacity = 'rgb(250, 50, 250,' + lightOpacity + ')';
let colorP2 = 'rgb(217, 128, 250)';
let colorP2Opacity = 'rgb(217, 128, 250,' + lightOpacity + ')';
let colorQ = 'rgb(247, 159, 31)';
let colorQOpacity = 'rgb(247, 159, 31,' + lightOpacity + ')';
let colorR = 'rgb(234, 32, 39)';
let colorROpacity = 'rgb(234, 32, 39,' + lightOpacity + ')';
let colorR2 = 'rgb(237, 115, 146)';
let colorR2Opacity = 'rgb(237, 115, 146,' + lightOpacity + ')';
let colorS = 'rgb(163, 203, 56)';
let colorSOpacity = 'rgb(163, 203, 56,' + lightOpacity + ')';
let colorS2 = 'rgb(0, 230, 0)';
let colorS2Opacity = 'rgb(0, 230, 0,' + lightOpacity + ')';
let colorT = 'rgb(6, 82, 221)';
let colorTOpacity = 'rgb(6, 82, 221,' + lightOpacity + ')';
let colorT2 = 'rgb(18, 137, 167)';
let colorT2Opacity = 'rgb(18, 137, 167,' + lightOpacity + ')';
let colorOn = 'rgb(27, 20, 100)';
let colorOnOpacity = 'rgb(27, 20, 100,' + lightOpacity + ')';
let colorOff = 'rgb(111, 30, 81)';
let colorOffOpacity = 'rgb(111, 30, 81,' + lightOpacity + ')';

let colorDisagFirst = 'rgb(255, 191, 0)';
let colorDisagFirstOpacity = 'rgb(255, 191, 0,' + lightOpacity + ')';

let colorDisagSecond = 'rgb(63, 224, 208)';
let colorDisagSecondOpacity = 'rgb(163, 224, 208,' + lightOpacity + ')';

let serverURL = "http://localhost:3000/";

class GraphAnnChecker extends Component {

    constructor(props) {
        super(props);


        this.chartRef = React.createRef();
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.getLeadID = this.getLeadID.bind(this);
        this.insertIntoDB = this.insertIntoDB.bind(this);
        this.deleteFromDB = this.deleteFromDB.bind(this);
        this.updateDB = this.updateDB.bind(this);
        this.updateDBDisag = this.updateDBDisag.bind(this);


        this.state = ({
            data: {
                datasets: {
                    dataRead: false,
                    radius: 0, // Makes the dots go away
                    label: this.props.inputArr.title,
                    fill: false,
                    borderColor: ['black'],
                    data: this.props.inputArr.data,
                    all_data: this.props.inputArr.all_data,
                    backgroundColor: ['rgba(255,99,132,0.6)',],
                    borderWidth: 1
                },
                annotation: {
                    p: [{x: 0, y: 10000}],
                    p2: [{x: 0, y: 10000}], // y's need an initial point, which is outside of range of graph
                    q: [{x: 0, y: 10000}], // however, they are removed on the first update
                    r: [{x: 0, y: 10000}],
                    r2: [{x: 0, y: 10000}],
                    s: [{x: 0, y: 10000}],
                    s2: [{x: 0, y: 10000}],
                    t: [{x: 0, y: 10000}],
                    t2: [{x: 0, y: 10000}],
                    onset: [{x: 0, y: 10000}],
                    offset: [{x: 0, y: 10000}],
                    selectedAnnotation: -1,
                    oldP: [''],
                    oldP2: [''],
                    oldQ: [''],
                    oldR: [''],
                    oldR2: [''],
                    oldS: [''],
                    oldS2: [''],
                    oldT: [''],
                    oldT2: [''],
                    oldOnset: [''],
                    oldOffset: [''],
                    p_flag: false,
                    p2_flag: false,
                    q_flag: false,
                    r_flag: false,
                    r2_flag: false,
                    s_flag: false,
                    s2_flag: false,
                    t_flag: false,
                    t2_flag: false,
                    onset_flag: false,
                    offset_flag: false,

                    disagFirst: [{x: 0, y: 10000, type: 0}],
                    oldDisagFirst: [''],
                    disagFirst_flag: false,


                },
                scanID: 0,
                freq: 0,
                max: this.props.inputArr.extra_info.max,
                min: this.props.inputArr.extra_info.min,
                parent_width: 0,
                annos: [],
                shouldUpdate: false,
                events: '',
                p_pair: [], q_pair: [], r_pair: [], s_pair: [], t_pair: []  //temp
            }
        })
    }

    getLeadID(label) {
        switch (label) {
            case 'I': return 0;
            case 'II': return 1;
            case 'III': return 2;
            case 'aVR': return 3;
            case 'aVL': return 4;
            case 'aVF': return 5;
            case 'V1': return 6;
            case 'V2': return 7;
            case 'V3': return 8;
            case 'V4': return 9;
            case 'V5': return 10;
            case 'V6': return 11;
        }
    }

    // UI Delete Function
    deleteAnnotation(annotationArray, arraryIndex, event) {
        annotationArray.splice(arraryIndex, 1)
        event[0]._chart.chart.update();
    }

    //UI Add Function
    addAnnotation(annotationArray, event, point) {
        annotationArray.push({x: point.x, y: point});
        event[0]._chart.chart.update();
    }

    // DB Insert Function
    insertIntoDB(ecgID, leadID, pointIndex, pointType) {

        let annotatorID = this.props.inputArr.annotatorID;

        if (annotatorID == 6) {
            Axios.post(serverURL + "insertLUDBFirst",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                    alert("Connection Error! Please Retry");
                });
        } else if (annotatorID == 7) {
            Axios.post(serverURL + "insertLUDBSecond",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                    alert("Connection Error! Please Retry");
                });
        }


    }

    // DB Delete Function
    deleteFromDB(ecgID, leadID, pointIndex, annotatorID) {

        if (annotatorID == 6) {

            Axios.post(serverURL + "deleteLUDBCorrectionFirst",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                    alert("Connection Error! Please Retry");
                });

        } else if (annotatorID == 7) {

            Axios.post(serverURL + "deleteLUDBCorrectionSecond",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                    alert("Connection Error! Please Retry");
                });
        }


    }

    updateDB(e) {
        console.log('I am here');

        let editMode = e[0]._datasetIndex;
        let annotatorID = this.props.inputArr.annotatorID;

        if ( editMode == 0) { // Insert into DB

            let ecgID = this.state.data.scanID;
            let leadID = this.getLeadID(this.state.data.datasets.label);
            let pointIndex = e[0]._index;
            let pointType = this.state.data.annotation.selectedAnnotation;
            if (typeof pointType !== 'undefined') {
                this.insertIntoDB(ecgID, leadID, pointIndex, pointType);
                console.log(`Inserting point at index ${pointIndex}`);
            }


        } else { // Delete from DB
            let ecgID = this.state.data.scanID;
            let leadID = this.getLeadID(this.state.data.datasets.label);
            let pointIndex = -1;
            let annIndex = e[0]._index;
            let pointType = editMode - 1;
            let ecgFreq = this.state.data.freq;

            switch (pointType) {

                case 0: {
                    let pointObject = this.state.data.annotation.p[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 1: {
                    let pointObject = this.state.data.annotation.p2[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 2: {
                    let pointObject = this.state.data.annotation.q[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 3: {
                    let pointObject = this.state.data.annotation.r[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 4: {
                    let pointObject = this.state.data.annotation.r2[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 5: {
                    let pointObject = this.state.data.annotation.s[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 6: {
                    let pointObject = this.state.data.annotation.t[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    pointIndex = Math.round(pointIndex);
                    break;
                }
                case 7: {
                    let pointObject = this.state.data.annotation.t2[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 8: {
                    let pointObject = this.state.data.annotation.onset[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 9: {
                    let pointObject = this.state.data.annotation.offset[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 10: {
                    let pointObject = this.state.data.annotation.s2[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }

            }
            pointIndex = Math.round(pointIndex);
            this.deleteFromDB(ecgID, leadID, pointIndex, annotatorID);
            console.log(`Deleting point at index ${pointIndex}`);
        }
    }

    updateDBDisag(point, annotator) {

        let ecgID = this.state.data.scanID;
        let leadID = this.getLeadID(this.state.data.datasets.label);
        let ecgFreq = this.state.data.freq;
        let pointIndex = Math.round(point.x * ecgFreq);
        let pointType = point.type;
        let annotatorID = this.props.inputArr.annotatorID;

        if (annotatorID == 6) {
            Axios.post(serverURL + "deleteLUDBCurrentFirst",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                });

        } else if (annotatorID == 7) {

            Axios.post(serverURL + "deleteLUDBCurrentSecond",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                });

        }



        // if (annID == 1) {
        //
        //     Axios.post(serverURL + "deleteFirstDisag",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
        //         .then(function (response) {
        //             //handle success
        //             console.log(response);
        //         })
        //         .catch(function (error) {
        //             //handle error
        //             console.log(error);
        //         });
        //
        //
        // } else {
        //
        //     Axios.post(serverURL + "deleteSecondDisag",{ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
        //         .then(function (response) {
        //             //handle success
        //             console.log(response);
        //         })
        //         .catch(function (error) {
        //             //handle error
        //             console.log(error);
        //         });


    }


    modifyGraph(e, meta) {

        if (meta.type !== undefined) {
            this.updateDBDisag(meta, e[0]._datasetIndex);
        } else {
            this.updateDB(e);
        }

        let arrIndex = e[0]._index;
        let dataSet = e[0]._datasetIndex;
        let coordinates = this.state.data.datasets.data[arrIndex];

        let a = dataSet;

        //console.log("scanID:", this.state.data.scanID);
        switch (dataSet) {
            case 0:
                //add a point to a specific set of annotations
                //console.log(this.state.data.datasets.data);
                //console.log("Coordinates",coordinates);

                //Let the user select the type of point to add from some menu
                //and set the response to this variable
                //Hardcoded to 0 now to inidicate P
                let inputChoice = this.state.data.annotation.selectedAnnotation;
                if (inputChoice === -1) {
                    break;
                }


                //User wants to add P
                if (inputChoice === 0) {
                    this.addAnnotation(this.state.data.annotation.p, e, coordinates);
                }
                else if (inputChoice === 1) {
                    this.addAnnotation(this.state.data.annotation.p2, e, coordinates);
                }
                else if (inputChoice === 2) {
                    this.addAnnotation(this.state.data.annotation.q, e, coordinates);
                }
                else if (inputChoice === 3) {
                    this.addAnnotation(this.state.data.annotation.r, e, coordinates);
                }
                else if (inputChoice === 4) {
                    this.addAnnotation(this.state.data.annotation.r2, e, coordinates);
                }
                else if (inputChoice === 5) {
                    this.addAnnotation(this.state.data.annotation.s, e, coordinates);

                }else if (inputChoice === 6) {
                    this.addAnnotation(this.state.data.annotation.t, e, coordinates);

                }else if (inputChoice === 7) {
                    this.addAnnotation(this.state.data.annotation.t2, e, coordinates);

                }else if (inputChoice === 8) {
                    this.addAnnotation(this.state.data.annotation.onset, e, coordinates);

                }else if (inputChoice === 9) {
                    this.addAnnotation(this.state.data.annotation.offset, e, coordinates);

                } else if (inputChoice === 10) {
                    this.addAnnotation(this.state.data.annotation.s2, e, coordinates);
                }
                break;
            case 1:
                this.deleteAnnotation(this.state.data.annotation.p, arrIndex, e);
                break;
            case 2:
                this.deleteAnnotation(this.state.data.annotation.p2, arrIndex, e);
                break;
            case 3:
                this.deleteAnnotation(this.state.data.annotation.q, arrIndex, e);
                break;
            case 4:
                this.deleteAnnotation(this.state.data.annotation.r, arrIndex, e);
                break;
            case 5:
                this.deleteAnnotation(this.state.data.annotation.r2, arrIndex, e);
                break;
            case 6:
                this.deleteAnnotation(this.state.data.annotation.s, arrIndex, e);
                break;
            case 7:
                this.deleteAnnotation(this.state.data.annotation.t, arrIndex, e);
                break;
            case 8:
                this.deleteAnnotation(this.state.data.annotation.t2, arrIndex, e);
                break;
            case 9:
                this.deleteAnnotation(this.state.data.annotation.onset, arrIndex, e);
                break;
            case 10:
                this.deleteAnnotation(this.state.data.annotation.offset, arrIndex, e);
                break;
            case 11:
                this.deleteAnnotation(this.state.data.annotation.s2, arrIndex, e);
                break;
            case 12:
                this.deleteAnnotation(this.state.data.annotation.disagFirst, arrIndex, e);
                break;
            case 13:
                this.deleteAnnotation(this.state.data.annotation.disagSecond, arrIndex, e);
                break;
            default:
                console.log("Point not in any available dataset.");
        }

    }

    static fetchLUDBCurrent(ecgID, leadID, annotatorID) {



        if (annotatorID == 6) {

            var urlFirst = new URL(serverURL + "getLUDBCurrentFirst"),
                params1 = {ecgID: ecgID, leadID: leadID};
            Object.keys(params1).forEach(key => urlFirst.searchParams.append(key, params1[key]));


            var diasg1 = fetch(urlFirst).then(function (response) {
                return response.json()
            }).then(function (body) {
                return body;
            });


            return Promise.all([diasg1]).then(arr => {
                return arr
            });

        } else if (annotatorID == 7) {

            var urlFirst = new URL(serverURL + "getLUDBCurrentSecond"),
                params1 = {ecgID: ecgID, leadID: leadID};
            Object.keys(params1).forEach(key => urlFirst.searchParams.append(key, params1[key]));


            var diasg1 = fetch(urlFirst).then(function (response) {
                return response.json()
            }).then(function (body) {
                return body;
            });


            return Promise.all([diasg1]).then(arr => {
                return arr
            });
        }




    }

    static getSelectQuery(annotatorID, ecgID, leadID, pointType) {

        if (annotatorID == 6) {
            var url = new URL(serverURL + "getLUDBCorrectionFirst"),
                params = {ecgID: ecgID, leadID: leadID, pointType: pointType};
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            return url;
        } else if (annotatorID == 7) {
            var url = new URL(serverURL + "getLUDBCorrectionSecond"),
                params = {ecgID: ecgID, leadID: leadID, pointType: pointType};
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            return url;
        }


    }

    static fetchExistingAnnotations(annotations) {
        //annotations = [ecgID, leadID, annotatorID, pointType]
        const ecgID = annotations[0][0];
        let annotatorID = annotations[0][2];

        var annotationType = annotations[0];
        var leadID = annotationType[1];
        var pointType = annotationType[3];

        var url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p1 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[1];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p2 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[2];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p3 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[3];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p4 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[4];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p5 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[5];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p6 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[6];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p7 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[7];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p8 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[8];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p9 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[9];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p10 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[10];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p11 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        return Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11]).then(arr => {
            return arr
        });

    }


    // Function to build pairs for graphing
    // Used by ComponentDidUpdate
    addToPairs(anno, freq, pair) {
        for (let i = 0; i < anno.length; i++) {
            pair.push({
                x: anno[i] * (1 / freq),
                y: this.state.data.datasets.data[anno[i]]
            });
        }
        return pair;
    }

    addToPairsDisag(anno, freq, types, pair) {
        for (let i = 0; i < anno.length; i++) {
            pair.push({
                x: anno[i] * (1 / freq),
                y: this.state.data.datasets.data[anno[i]],
                type: types[i],
            });
        }
        return pair;
    }

    // Runs after render and will re-render
    // If annotations are passed in
    componentDidUpdate(next_props, prev_state) {
        var freq = next_props.inputArr.freq
        //let props_array = next_props.inputArr;

        let dataRead = prev_state.data.datasets.dataRead;
        if (typeof this.state.data.annos !== 'undefined' && this.state.data.annos.length > 4 && this.props !== next_props && this.state.data.annotation !== prev_state.annotation && !dataRead) {
            if (this.state.data.annotation.selectedAnnotation === prev_state.data.annotation.selectedAnnotation) {
                dataRead = true;

                const ecgID = this.state.data.annos[0][0];
                let annotationType = this.state.data.annos[0];
                let annID = this.props.inputArr.annotatorID;
                let leadID = annotationType[1];

                var disags = GraphAnnChecker.fetchLUDBCurrent(ecgID, leadID, annID).then(results => {
                    return results
                });

                let parsed_disags = disags.then(annotations => {

                    //console.log(annotations);

                    let disagFirst_pair = [];

                    let disagFirst = [];
                    annotations[0].forEach(element => { disagFirst.push(element.PointIndex);});

                    let disagFirstTypes = [];
                    annotations[0].forEach(element => { disagFirstTypes.push(element.PointType);});
                    var disagFirstPair = this.addToPairsDisag(disagFirst, freq, disagFirstTypes, disagFirst_pair);

                    return [disagFirstPair, this]

                });

                parsed_disags.then(disag => {

                    var annos = GraphAnnChecker.fetchExistingAnnotations(this.state.data.annos).then(annotations => {

                        return annotations
                    });

                    let parsed_anno = annos.then(annotations => {
                        let p_pair = [];
                        let p2_pair = [];
                        let q_pair = [];
                        let r_pair = [];
                        let r2_pair = [];
                        let s_pair = [];
                        let s2_pair = [];
                        let t_pair = [];
                        let t2_pair = [];
                        let onset_pair = [];
                        let offset_pair = [];


                        let p = [];
                        annotations[0].forEach(element => { p.push(element.PointIndex);});
                        let p2 = [];
                        annotations[1].forEach(element => { p2.push(element.PointIndex);});
                        let q = [];
                        annotations[2].forEach(element => { q.push(element.PointIndex);});
                        let r = [];
                        annotations[3].forEach(element => { r.push(element.PointIndex);});
                        let r2 = [];
                        annotations[4].forEach(element => { r2.push(element.PointIndex);});
                        let s = [];
                        annotations[5].forEach(element => { s.push(element.PointIndex);});
                        let t = [];
                        annotations[6].forEach(element => { t.push(element.PointIndex);});
                        let t2 = [];
                        annotations[7].forEach(element => { t2.push(element.PointIndex);});
                        let onset = [];
                        annotations[8].forEach(element => { onset.push(element.PointIndex);});
                        let offset = [];
                        annotations[9].forEach(element => { offset.push(element.PointIndex);});
                        let s2 = [];
                        annotations[10].forEach(element => { s2.push(element.PointIndex);});

                        var pp1 = this.addToPairs(p, freq, p_pair);
                        var pp2 = this.addToPairs(p2, freq, p2_pair);
                        var pp3 = this.addToPairs(q, freq, q_pair);
                        var pp4 = this.addToPairs(r, freq, r_pair);
                        var pp5 = this.addToPairs(r2, freq, r2_pair);
                        var pp6 = this.addToPairs(s, freq, s_pair);
                        var pp7 = this.addToPairs(t, freq, t_pair);
                        var pp8 = this.addToPairs(t2, freq, t2_pair);
                        var pp9 = this.addToPairs(onset, freq, onset_pair);
                        var pp10 = this.addToPairs(offset, freq, offset_pair);
                        var pp11 = this.addToPairs(s2, freq, s2_pair);

                        return [pp1, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, this]
                    });

                    parsed_anno.then(anno => {
                        let p_flag = prev_state.data.annotation.p_flag;
                        let p2_flag = prev_state.data.annotation.p2_flag;
                        let q_flag = prev_state.data.annotation.q_flag;
                        let r_flag = prev_state.data.annotation.r_flag;
                        let r2_flag = prev_state.data.annotation.r2_flag;
                        let s_flag = prev_state.data.annotation.s_flag;
                        let s2_flag = prev_state.data.annotation.s2_flag;
                        let t_flag = prev_state.data.annotation.t_flag;
                        let t2_flag = prev_state.data.annotation.t2_flag;
                        let onset_flag = prev_state.data.annotation.onset_flag;
                        let offset_flag = prev_state.data.annotation.offset_flag;

                        let disagFirst_flag = prev_state.data.annotation.disagFirst_flag;

                        // If the flag was set before, dont change the data
                        if (p_flag)
                            anno[0] = prev_state.data.annotation.p;
                        if (p2_flag)
                            anno[1] = prev_state.data.annotation.p2;
                        if (q_flag)
                            anno[2] = prev_state.data.annotation.q;
                        if (r_flag)
                            anno[3] = prev_state.data.annotation.r;
                        if (r2_flag)
                            anno[4] = prev_state.data.annotation.r2;
                        if (s_flag)
                            anno[5] = prev_state.data.annotation.s;
                        if (t_flag)
                            anno[6] = prev_state.data.annotation.t;
                        if (t2_flag)
                            anno[7] = prev_state.data.annotation.t2;
                        if (onset_flag)
                            anno[8] = prev_state.data.annotation.onset;
                        if (offset_flag)
                            anno[9] = prev_state.data.annotation.offset;
                        if (s2_flag)
                            anno[10] = prev_state.data.annotation.s2;
                        if (disagFirst_flag)
                            disag[0] = prev_state.data.annotation.disagFirst;

                        // Set flag to true if the data has been loaded
                        if (!p_flag && anno[0] > 0)
                            p_flag = true;

                        if (!p2_flag && anno[1] > 0)
                            p2_flag = true;

                        if (!q_flag && anno[2] > 0)
                            q_flag = true;

                        if (!r_flag && anno[3] > 0)
                            r_flag = true;

                        if (!r2_flag && anno[4] > 0)
                            r_flag = true;

                        if (!s_flag && anno[5] > 0)
                            s_flag = true;

                        if (!t_flag && anno[6] > 0)
                            t_flag = true;

                        if (!t2_flag && anno[7] > 0)
                            t_flag = true;

                        if (!onset_flag && anno[8] > 0)
                            onset_flag = true;

                        if (!offset_flag && anno[9] > 0)
                            offset_flag = true;

                        if (!s2_flag && anno[10] > 0)
                            s2_flag = true;

                        if (!disagFirst_flag && disag[0] > 0)
                            disagFirst_flag = true;


                        this.setState({
                            data: {
                                dataRead: dataRead,
                                annotation: {
                                    p: anno[0],
                                    p2: anno[1],
                                    q: anno[2],
                                    r: anno[3],
                                    r2: anno[4],
                                    s: anno[5],
                                    s2: anno[10],
                                    t: anno[6],
                                    t2: anno[7],
                                    onset: anno[8],
                                    offset: anno[9],
                                    disagFirst: disag[0],
                                    selectedAnnotation: prev_state.data.annotation.selectedAnnotation,
                                    p_flag: p_flag,
                                    p2_flag: p2_flag,
                                    q_flag: q_flag,
                                    r_flag: r_flag,
                                    r2_flag: r2_flag,
                                    s_flag: s_flag,
                                    s2_flag: s2_flag,
                                    t_flag: t_flag,
                                    t2_flag: t2_flag,
                                    onset_flag: onset_flag,
                                    offset_flag: offset_flag,

                                    disagFirst_flag: disagFirst_flag,

                                    //disagSecondAnnID:

                                },
                                annotatorID: this.props.inputArr.annotatorID
                                //annotatorID:
                            }
                        })
                    });
                });
            } else {
                this.setState({
                    data: {
                        dataRead: dataRead,
                        annotation: {
                            p: prev_state.data.annotation.p,
                            p2: prev_state.data.annotation.p2,
                            q: prev_state.data.annotation.q,
                            r: prev_state.data.annotation.r,
                            r2: prev_state.data.annotation.r2,
                            s: prev_state.data.annotation.s,
                            s2: prev_state.data.annotation.s2,
                            t: prev_state.data.annotation.t,
                            t2: prev_state.data.annotation.t2,
                            onset: prev_state.data.annotation.onset,
                            offset: prev_state.data.annotation.offset,
                            disagFirst: prev_state.data.annotation.disagFirst,
                            selectedAnnotation: next_props.inputArr.extra_info.selectedAnnotation
                        }
                    }
                })
            }
        }
    }

    static getDerivedStateFromProps(next_props, prev_state) {

        var freq = next_props.inputArr.freq

        //let props_array = next_props.inputArr;

        //console.log('prev_state',prev_state)

        if (undefined !== next_props.inputArr.annotations_all && next_props.inputArr.annotations_all.length > 4) {
            return {
                data: {
                    datasets: {
                        radius: 0, // Makes the dots go away
                        label: next_props.inputArr.title,
                        fill: false,
                        borderColor: ['black'],
                        data: next_props.inputArr.data,
                        backgroundColor: ['rgba(255,99,132,0.6)',],
                        borderWidth: 1
                    },
                    annotation: {
                        p: prev_state.data.annotation.p,
                        p2: prev_state.data.annotation.p2,
                        q: prev_state.data.annotation.q,
                        r: prev_state.data.annotation.r,
                        r2: prev_state.data.annotation.r2,
                        s: prev_state.data.annotation.s,
                        s2: prev_state.data.annotation.s2,
                        t: prev_state.data.annotation.t,
                        t2: prev_state.data.annotation.t2,
                        onset: prev_state.data.annotation.onset,
                        offset: prev_state.data.annotation.offset,
                        disagFirst: prev_state.data.annotation.disagFirst,
                        selectedAnnotation: next_props.inputArr.extra_info.selectedAnnotation,

                        oldP: [''],
                        oldP2: [''],
                        oldQ: [''],
                        oldR: [''],
                        oldR2: [''],
                        oldS: [''],
                        oldS2: [''],
                        oldT: [''],
                        oldT2: [''],
                        oldOnset: [''],
                        oldOffset: [''],
                        oldDisagFirst: [''],

                        p_flag: prev_state.data.annotation.p_flag,
                        p2_flag: prev_state.data.annotation.p2_flag,
                        q_flag: prev_state.data.annotation.q_flag,
                        r_flag: prev_state.data.annotation.r_flag,
                        r2_flag: prev_state.data.annotation.r2_flag,
                        s_flag: prev_state.data.annotation.s_flag,
                        s2_flag: prev_state.data.annotation.s2_flag,
                        t_flag: prev_state.data.annotation.t_flag,
                        t2_flag: prev_state.data.annotation.t2_flag,
                        onset_flag: prev_state.data.annotation.onset_flag,
                        offset_flag: prev_state.data.annotation.offset_flag,
                        disagFirst_flag: prev_state.data.annotation.disagFirst_flag,
                    },
                    scanID: next_props.inputArr.scanID,
                    freq: freq,
                    min: next_props.inputArr.extra_info.min,
                    max: next_props.inputArr.extra_info.max,
                    parent_width: next_props.width,
                    annos: next_props.inputArr.annotations_all //??
                }
            }
        } else {
            return {
                data: {
                    datasets: {
                        radius: 0, // Makes the dots go away
                        label: next_props.inputArr.title,
                        fill: false,
                        borderColor: ['black'],
                        data: next_props.inputArr.data,
                        backgroundColor: ['rgba(255,99,132,0.6)',],
                        borderWidth: 1
                    },
                    annotation: {
                        p: [{x: 0, y: 10000}],
                        p2: [{x: 0, y: 10000}], // y's need an initial point, which is outside of range of graph
                        q: [{x: 0, y: 10000}], // however, they are removed on the first update
                        r: [{x: 0, y: 10000}],
                        r2: [{x: 0, y: 10000}],
                        s: [{x: 0, y: 10000}],
                        s2: [{x: 0, y: 10000}],
                        t: [{x: 0, y: 10000}],
                        t2: [{x: 0, y: 10000}],
                        onset: [{x: 0, y: 10000}],
                        offset: [{x: 0, y: 10000}],
                        selectedAnnotation: next_props.inputArr.extra_info.selectedAnnotation,

                        oldP: [''],
                        oldP2: [''],
                        oldQ: [''],
                        oldR: [''],
                        oldR2: [''],
                        oldS: [''],
                        oldS2: [''],
                        oldT: [''],
                        oldT2: [''],
                        oldOnset: [''],
                        oldOffset: [''],

                        p_flag: false,
                        p2_flag: false,
                        q_flag: false,
                        r_flag: false,
                        r2_flag: false,
                        s_flag: false,
                        s2_flag: false,
                        t_flag: false,
                        t2_flag: false,
                        onset_flag: false,
                        offset_flag: false,

                        disagFirst: [{x: 0, y: 10000, type: 0}],
                        oldDisagFirst: [''],
                        disagFirst_flag: false,
                    },
                    scanID: next_props.inputArr.scanID,
                    freq: freq,
                    min: next_props.inputArr.extra_info.min,
                    max: next_props.inputArr.extra_info.max,
                    parent_width: next_props.width,
                    annos: prev_state.annos
                }
            }
        }
    }

    //Render the graph
    render() {
        const dat = {
            type: 'Scatter',
            datasets: [
                {
                    label: 'Main-Data',
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 1,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 1,
                    pointRadius: 0, // This makes the individual points disappear
                    pointHitRadius: 2,
                    borderWidth: 1.5, // Change this back to 1???
                    borderColor: 'black',
                    showLine: true,
                    tooltipHidden: true,
                    data: this.state.data.datasets.data,
                },
                {
                    label: 'P',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorP,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorPOpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.p
                },
                {
                    label: 'P2',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorP2,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorP2Opacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.p2
                },
                {
                    label: 'Q',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorQ,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorQOpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.q
                },
                {
                    label: 'R',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorR,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorROpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.r
                },
                {
                    label: 'R2',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorR2,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorR2Opacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.r2
                },
                {
                    label: 'S',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorS,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorSOpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.s
                },
                {
                    label: 'T',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorT,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorTOpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.t
                },
                {
                    label: 'T2',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorT2,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorT2Opacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.t2
                },
                {
                    label: 'Onset',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorOn,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorOnOpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.onset
                },
                {
                    label: 'Offset',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorOff,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorOffOpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.offset
                },
                {
                    label: 'S2',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorS2,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorS2Opacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.s2
                },
                {
                    label: 'D1',
                    fill: true,
                    pointStyle: 'circle',
                    pointBorderColor: colorDisagFirst,
                    pointRadius: 5,
                    pointHitRadius: 3,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    backgroundColor: colorDisagFirstOpacity,
                    showLine: false,
                    tooltipHidden: false,
                    data: this.state.data.annotation.disagFirst
                },
            ],
        };

        let dataLen = this.state.data.datasets.data.length
        let total_time = 1
        if (this.state.data.datasets.data[dataLen - 1]) {
            total_time = this.state.data.datasets.data[dataLen - 1].x
            total_time += 1 / this.state.data.freq
        }

        // Some constants
        //const HEIGHT = 400; // The stated height of the chart
        //const INTERVAL = 0.2 // 0.2 seconds or 200 ms
        const SECONDS_PER_WIDTH_MAX = 10
        const TIME_PER_WIDTH = Math.min(SECONDS_PER_WIDTH_MAX, total_time) // Number of seconds to fit on the screen at a time

        // The amount of the width/height that is not part of the graph
        const width_offset = 86 //     (75 + 10 + 1 + 1) = offset = 86

        // The fixed width of the container on the screen
        const parent_width = this.state.data.parent_width - width_offset

        // The amount of px that will be visible in every given second of the x axis
        const px_per_second = parent_width / TIME_PER_WIDTH;

        // Calculates the width of the graph(can be greater than the fixed width, scrollable allow the excess to be seen)
        let width = total_time * px_per_second;
        width += width_offset
        width += 'px';

        var ampArray = [];
        if (this.state.data.datasets.data != '') {

            for (var i = 0; i < this.state.data.datasets.data.length; i++) {

                let sample = this.state.data.datasets.data[i];
                ampArray.push(sample.y);
            }
            // let minValue = Math.min(...ampArray);
            // let maxValue = Math.max(...ampArray);
            // let ampDivergence =  Math.abs(maxValue - minValue);
        }

        let calculatedHeight = -1;

        var total = 0;
        for(var i = 0; i < ampArray.length; i++) {
            total += ampArray[i];
        }
        var avg = total / ampArray.length;


        let minValue = Math.min(...ampArray);
        let maxValue = Math.max(...ampArray);

        // console.log(this.state.data.datasets.label);
        // console.log(minValue);
        // console.log(avg);
        // console.log(maxValue);



        let ampDivergence =  Math.abs(maxValue - minValue);
        if (ampDivergence > 0 && ampDivergence != Infinity) {

            let factor = 0.3;

            if (Math.abs(minValue) > 1.5 * Math.abs(maxValue)) {

                factor = 0.7;
            }

            // if (this.state.data.datasets.label == 'V1') {
            //     var u = Math.abs(-4);
            // }

            let frameHeight = Math.round(ampDivergence * factor);

            if (frameHeight > 400) {
                frameHeight = 400;
            }
            if (frameHeight < 250) {
                frameHeight = 250;
            }
            calculatedHeight = frameHeight;
        }

        let HEIGHT = 400;

        if (calculatedHeight > 0) {
            HEIGHT = calculatedHeight;
            HEIGHT = 600;
            //console.log(HEIGHT);
        }

        //HEIGHT = 100;

        let v = 9;


        return (
            <React.Fragment>
                {

                    <div className="wrapper" style={{position: 'relative', height: HEIGHT}}>

                        <div style={{
                            position: 'relative',
                            fontSize: 20,
                            marginTop: 0,
                            fontWeight: 'bold'
                        }}>{this.state.data.datasets.label}</div>

                        <div className="graph" style={{position: 'absolute', top: 0, left: 0, width: width}}>

                            <Scatter
                                data={dat}
                                redraw={true}
                                //height={HEIGHT-20}
                                ref={this.chartRef}

                                getElementAtEvent={(point) => {

                                    if (point.length == 0) {

                                    } else {
                                        let a = point[0]._datasetIndex;
                                        let aa = dat;
                                        let ds = dat.datasets[point[0]._datasetIndex];
                                        let temp = ds.data;
                                        var pp = temp[point[0]._index];


                                        this.modifyGraph(point, pp);
                                    }
                                }}
                                options={{
                                    maintainAspectRatio: true,
                                    tooltips: {
                                        enabled: true,
                                        mode: 'nearest',
                                        callbacks: {
                                            label: function (tooltipItems, data) {
                                                //console.log(tooltipItems);



                                                if (tooltipItems.datasetIndex == 0) {
                                                    return tooltipItems.xLabel + ' s, ' + tooltipItems.yLabel + ' mv';
                                                }
                                                else if (tooltipItems.datasetIndex == 1) {
                                                    return 'P peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 2) {
                                                    return 'P2 peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 3) {
                                                    return 'Q peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 4) {
                                                    return 'R peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 5) {
                                                    return 'R2 peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 6) {
                                                    return 'S peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 11) {
                                                    return 'S2 peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 7) {
                                                    return 'T peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 8) {
                                                    return 'T2 peak at ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 9) {
                                                    return 'Onset ' + tooltipItems.xLabel + ' s';
                                                }else if (tooltipItems.datasetIndex == 10) {
                                                    return 'Offset ' + tooltipItems.xLabel + ' s';
                                                }
                                                else if (tooltipItems.datasetIndex == 12 || tooltipItems.datasetIndex == 13) {

                                                    let ds = data.datasets[tooltipItems.datasetIndex];
                                                    let temp = ds.data;
                                                    let point = temp[tooltipItems.index];
                                                    let pointType = point.type;

                                                    var annName = '';

                                                    // if (pointAnnID == 1)
                                                    //     annName = 'Baha';
                                                    // else if (pointAnnID == 2)
                                                    //     annName = 'Gab';
                                                    // else if (pointAnnID == 3)
                                                    //     annName = 'Jake';
                                                    // else if (pointAnnID == 4)
                                                    //     annName = 'Seb';
                                                    annName = 'Original'

                                                    if (pointType == 0) {
                                                        return 'P peak ' + annName;
                                                    } else if (pointType == 1) {
                                                        return 'P2 peak ' + annName;
                                                    }else if (pointType == 2) {
                                                        return 'Q peak ' + annName;
                                                    }else if (pointType == 3) {
                                                        return 'R peak ' + annName;
                                                    }else if (pointType == 4) {
                                                        return 'R2 peak ' + annName;
                                                    }else if (pointType== 5) {
                                                        return 'S peak ' + annName;
                                                    }else if (pointType == 10) {
                                                        return 'S2 peak ' + annName;
                                                    }else if (pointType == 6) {
                                                        return 'T peak ' + annName;
                                                    }else if (pointType == 7) {
                                                        return 'T2 peak ' + annName;
                                                    }else if (pointType == 8) {
                                                        return 'Onset ' + annName;
                                                    }else if (pointType == 9) {
                                                        return 'Offset ' + annName;
                                                    }
                                                }



                                            }.bind(this)


                                        }
                                    },
                                    title: {
                                        display: false,
                                        text: this.state.data.datasets.label,
                                        fontSize: 13,
                                        fontFamily: "serif",
                                        position: 'left'
                                    },
                                    legend: {
                                        display: false,
                                        position: 'right',
                                        labels: {

                                            // generateLabel
                                            boxWidth: 10,
                                            filter: function (item) {

                                                //console.log(item);

                                                if (item.text.includes('D1') || item.text.includes('D2')) {
                                                    return 'Hi';
                                                }
                                                return false;


                                                // return !item.text.includes('Main-Data');
                                            }.bind(this)
                                        }
                                    },
                                    scales: {
                                        xAxes: [{
                                            ticks: {
                                                display: false,
                                                stepSize: 0.2
                                            },
                                            gridLines: {
                                                display: false
                                            },
                                            scaleLabel: {
                                                display: false,
                                                labelString: 'Seconds'
                                            }
                                        }],
                                        yAxes: [{
                                            ticks: {
                                                display: false,
                                                min: this.state.data.min,
                                                max: this.state.data.max + 50
                                            },
                                            gridLines: {
                                                display: false
                                            },
                                            scaleLabel: {
                                                display: false,
                                                labelString: 'MV'
                                            }
                                        }]
                                    }
                                }}
                            />
                        </div>

                    </div>
                }
            </React.Fragment>)
    }

}

export default GraphAnnChecker;
