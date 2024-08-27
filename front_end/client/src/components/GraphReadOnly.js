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
let colorOn = 'rgb(255, 191, 0)';
let colorOnOpacity = 'rgb(255, 191, 0,' + lightOpacity + ')';
let colorOff = 'rgb(55, 163, 210)';
let colorOffOpacity = 'rgb(55, 163, 210,' + lightOpacity + ')';

let colorU = 'rgb(155, 126, 70)';
let colorUOpacity = 'rgb(155, 126, 70,' + lightOpacity + ')';
let colorJ = 'rgb(86, 98, 70)';
let colorJOpacity = 'rgb(86, 98, 70,' + lightOpacity + ')';
let colorF = 'rgb(149, 95, 113)';
let colorFOpacity = 'rgb(149, 95, 113,' + lightOpacity + ')';

let colorEpsilon = 'rgb(247, 196, 165)'
let colorEpsilonOpacity = 'rgb(247, 196, 165,' + lightOpacity + ')';
let colorSlur = 'rgb(195, 255, 31)'
let colorSlurOpacity = 'rgb(195, 255, 31,' + lightOpacity + ')';

let colorM = 'rgb(245, 47, 87)'
let colorMOpacity = 'rgb(245, 47, 87,' + lightOpacity + ')';

let colorDisagFirst = 'rgb(63, 224, 208)';
let colorDisagFirstOpacity = 'rgb(8, 196, 217,' + lightOpacity + ')';

let colorDisagSecond = 'rgb(63, 224, 208)';
let colorDisagSecondOpacity = 'rgb(8, 196, 217,' + lightOpacity + ')';

let serverURL = "http://localhost:3000/";

class GraphReadOnly extends Component {

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
                    u: [{x: 0, y: 10000}],
                    j: [{x: 0, y: 10000}],
                    f: [{x: 0, y: 10000}],
                    e: [{x: 0, y: 10000}],
                    SL: [{x: 0, y: 10000}],
                    m: [{x: 0, y: 10000}],
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
                    oldU: [''],
                    oldJ: [''],
                    oldF: [''],
                    oldE: [''],
                    oldSL: [''],
                    oldM: [''],
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
                    u_flag: false,
                    j_flag: false,
                    f_flag: false,
                    e_flag: false,
                    SL_flag: false,
                    m_flag: false,
                    onset_flag: false,
                    offset_flag: false,

                    disagFirst: [{x: 0, y: 10000, type: 0}],
                    disagSecond: [{x: 0, y: 10000, type:0}],
                    oldDisagFirst: [''],
                    oldDisagSecond: [''],
                    disagFirst_flag: false,
                    disagSecond_flag: false,


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

        Axios.post(serverURL + "insertAdmin",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
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

    // DB Delete Function
    deleteFromDB(ecgID, leadID, pointIndex, annotatorID) {

        Axios.post(serverURL + "deleteAdmin",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex})
            .then(function (response) {
                //handle success
                console.log(response);
            })
            .catch(function (error) {
                //handle error
                console.log(error);
            });
    }

    updateDB(e) {
        console.log('Update Database');

        let editMode = e[0]._datasetIndex;
        let annotatorID = this.props.inputArr.annotatorID;

        console.log(editMode);

        if ( editMode == 0) { // Insert into DB

            let ecgID = this.state.data.scanID;
            let leadID = this.getLeadID(this.state.data.datasets.label);
            let pointIndex = e[0]._index;
            let pointType = this.state.data.annotation.selectedAnnotation;

            if (typeof pointType !== 'undefined') {

                if (pointType == 14) {

                    for (let lead_index = 0; lead_index < 12; lead_index++) {
                        this.insertIntoDB(ecgID, lead_index, pointIndex, 8);
                    }

                } else if (pointType == 15) {
                    for (let lead_index = 0; lead_index < 12; lead_index++) {
                        this.insertIntoDB(ecgID, lead_index, pointIndex, 9);
                    }

                } else {
                    this.insertIntoDB(ecgID, leadID, pointIndex, pointType);
                    console.log(`Inserting point at index ${pointIndex}`);
                }
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
                case 11: {
                    let pointObject = this.state.data.annotation.u[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 12: {
                    let pointObject = this.state.data.annotation.j[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 13: {
                    let pointObject = this.state.data.annotation.f[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 14: {
                    let pointObject = this.state.data.annotation.e[annIndex];
                    let pointTime = pointObject.x;
                    pointIndex = pointTime * ecgFreq;
                    break;
                }
                case 15: {
                    let pointObject = this.state.data.annotation.SL[annIndex];
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
        let annID = point.annID;

        if (annID == 1) {

            Axios.post(serverURL + "deleteFirstDisag",   {ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                });


        } else {

            Axios.post(serverURL + "deleteSecondDisag",{ecgID: ecgID, leadID: leadID, pointIndex: pointIndex, pointType: pointType})
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (error) {
                    //handle error
                    console.log(error);
                });
        }

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

                } else if (inputChoice === 11) {
                    this.addAnnotation(this.state.data.annotation.u, e, coordinates);

                }else if (inputChoice === 12) {
                    this.addAnnotation(this.state.data.annotation.j, e, coordinates);

                }else if (inputChoice === 13) {
                    this.addAnnotation(this.state.data.annotation.f, e, coordinates);

                } else if (inputChoice === 14) { // Place to handle mapping
                    this.addAnnotation(this.state.data.annotation.onset, e, coordinates);
                    let project_x = e[0]._index
                    this.setState({ inputChoice },
                        () => this.props.callBack(1, this.state.data.leadID, project_x))

                } else if (inputChoice === 15) { // Place to handle mapping
                    this.addAnnotation(this.state.data.annotation.offset, e, coordinates);
                    let project_x = e[0]._index
                    this.setState({ inputChoice },
                        () => this.props.callBack(1, this.state.data.leadID, project_x))

                } else if (inputChoice === 16) {
                    this.addAnnotation(this.state.data.annotation.e, e, coordinates);

                } else if (inputChoice === 17) {
                    this.addAnnotation(this.state.data.annotation.SL, e, coordinates);

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
                this.deleteAnnotation(this.state.data.annotation.u, arrIndex, e);
                break;
            case 13:
                this.deleteAnnotation(this.state.data.annotation.j, arrIndex, e);
                break;
            case 14:
                this.deleteAnnotation(this.state.data.annotation.f, arrIndex, e);
                break;
            case 15:
                this.deleteAnnotation(this.state.data.annotation.e, arrIndex, e);
                break;
            case 16:
                this.deleteAnnotation(this.state.data.annotation.SL, arrIndex, e);
                break;
            case 17:
                this.deleteAnnotation(this.state.data.annotation.disagFirst, arrIndex, e);
                break;
            case 18:
                this.deleteAnnotation(this.state.data.annotation.disagSecond, arrIndex, e);
                break;
            default:
                console.log("Point not in any available dataset.");
        }

    }

    static fetchDisagreements(ecgID, leadID) {

        var urlFirst = new URL(serverURL + "getFirstDisag"),
            params1 = {ecgID: ecgID, leadID: leadID};
        Object.keys(params1).forEach(key => urlFirst.searchParams.append(key, params1[key]));

        var urlSecond = new URL(serverURL + "getSecondDisag"),
            params2 = {ecgID: ecgID, leadID: leadID};
        Object.keys(params2).forEach(key => urlSecond.searchParams.append(key, params2[key]));


        var diasg1 = fetch(urlFirst).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        var diasg2 = fetch(urlSecond).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        return Promise.all([diasg1, diasg2]).then(arr => {
            return arr
        });


    }

    static getSelectQuery(annotatorID, ecgID, leadID, pointType) {

        var url = new URL(serverURL + "getAdmin"),
            params = {ecgID: ecgID, leadID: leadID, pointType: pointType};
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        return url;
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

        annotationType = annotations[11];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p12 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[12];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p13 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[13];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p14 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[16];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p15 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });

        annotationType = annotations[17];
        leadID = annotationType[1];
        pointType = annotationType[3];

        url = this.getSelectQuery(annotatorID, ecgID, leadID, pointType);
        var p16 = fetch(url).then(function (response) {
            return response.json()
        }).then(function (body) {
            return body;
        });





        return Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16]).then(arr => {
            return arr
        });

    }


    addToPairs(anno, freq, pair) {
        for (let i = 0; i < anno.length; i++) {
            pair.push({
                x: anno[i] * (1 / freq),
                y: this.state.data.datasets.data[anno[i]]
            });
        }
        return pair;
    }

    addToPairsDisag(anno, freq, types, annID, pair) {
        for (let i = 0; i < anno.length; i++) {
            pair.push({
                x: anno[i] * (1 / freq),
                y: this.state.data.datasets.data[anno[i]],
                type: types[i],
                annID: annID[i]
            });
        }
        return pair;
    }

    // Runs after render and will re-render
    // If annotations are passed in
    componentDidUpdate(next_props, prev_state) {

        console.log('componentDidUpdate')

        var freq = next_props.inputArr.freq
        //let props_array = next_props.inputArr;

        let dataRead = prev_state.data.datasets.dataRead;
        if (typeof this.state.data.annos !== 'undefined' && this.state.data.annos.length > 4 && this.props !== next_props && this.state.data.annotation !== prev_state.annotation && !dataRead) {
            if (this.state.data.annotation.selectedAnnotation === prev_state.data.annotation.selectedAnnotation) {
                dataRead = true;

                const ecgID = this.state.data.annos[0][0];
                let annotationType = this.state.data.annos[0];
                let leadID = annotationType[1];


                this.setState({
                    data: {dataRead: dataRead},
                    annotatorID: this.props.inputArr.annotatorID
                })

            //     var disags = GraphAdmin.fetchDisagreements(ecgID, leadID).then(results => {
            //         return results
            //     });
            //
            //     let parsed_disags = disags.then(annotations => {
            //
            //         console.log(annotations);
            //
            //         let disagFirst_pair = [];
            //         let disagSecond_pair = [];
            //
            //         let disagFirst = [];
            //         annotations[0].forEach(element => { disagFirst.push(element.PointIndex);});
            //         let disagSecond = [];
            //         annotations[1].forEach(element => { disagSecond.push(element.PointIndex);});
            //
            //         let disagFirstTypes = [];
            //         annotations[0].forEach(element => { disagFirstTypes.push(element.PointType);});
            //
            //         let disagSecondTypes = [];
            //         annotations[1].forEach(element => { disagSecondTypes.push(element.PointType);});
            //
            //         let disagFirstAnnID = [];
            //         annotations[0].forEach(element => { disagFirstAnnID.push(element.AnnID);});
            //
            //         let disagSecondAnnID = [];
            //         annotations[1].forEach(element => { disagSecondAnnID.push(element.AnnID);});
            //
            //         var disagFirstPair = this.addToPairsDisag(disagFirst, freq, disagFirstTypes, disagFirstAnnID, disagFirst_pair);
            //         var disagSecondPair = this.addToPairsDisag(disagSecond, freq, disagSecondTypes, disagSecondAnnID, disagSecond_pair);
            //
            //         return [disagFirstPair, disagSecondPair, this]
            //
            //     });
            //
            //     parsed_disags.then(disag => {
            //
            //         let vv = this.state.data.annos;
            //         var annos = GraphAdmin.fetchExistingAnnotations(this.state.data.annos).then(annotations => {
            //
            //             return annotations
            //         });
            //
            //         let parsed_anno = annos.then(annotations => {
            //             let p_pair = [];
            //             let p2_pair = [];
            //             let q_pair = [];
            //             let r_pair = [];
            //             let r2_pair = [];
            //             let s_pair = [];
            //             let s2_pair = [];
            //             let t_pair = [];
            //             let u_pair = [];
            //             let j_pair = [];
            //             let f_pair = [];
            //             let t2_pair = [];
            //             let e_pair = [];
            //             let SL_pair = [];
            //             let onset_pair = [];
            //             let offset_pair = [];
            //
            //
            //             let p = [];
            //             annotations[0].forEach(element => { p.push(element.PointIndex);});
            //             let p2 = [];
            //             annotations[1].forEach(element => { p2.push(element.PointIndex);});
            //             let q = [];
            //             annotations[2].forEach(element => { q.push(element.PointIndex);});
            //             let r = [];
            //             annotations[3].forEach(element => { r.push(element.PointIndex);});
            //             let r2 = [];
            //             annotations[4].forEach(element => { r2.push(element.PointIndex);});
            //             let s = [];
            //             annotations[5].forEach(element => { s.push(element.PointIndex);});
            //             let t = [];
            //             annotations[6].forEach(element => { t.push(element.PointIndex);});
            //             let t2 = [];
            //             annotations[7].forEach(element => { t2.push(element.PointIndex);});
            //             let onset = [];
            //             annotations[8].forEach(element => { onset.push(element.PointIndex);});
            //             let offset = [];
            //             annotations[9].forEach(element => { offset.push(element.PointIndex);});
            //             let s2 = [];
            //             annotations[10].forEach(element => { s2.push(element.PointIndex);});
            //             let u = [];
            //             annotations[11].forEach(element => { u.push(element.PointIndex);});
            //             let j = [];
            //             annotations[12].forEach(element => { j.push(element.PointIndex);});
            //             let f = [];
            //             annotations[13].forEach(element => { f.push(element.PointIndex);});
            //             let e = [];
            //             annotations[14].forEach(element => { e.push(element.PointIndex);});
            //             let SL = [];
            //             annotations[15].forEach(element => { SL.push(element.PointIndex);});
            //             //let m = annotations[14][2]
            //             //annotations[14].forEach(element => { m.push(element.PointIndex);});
            //
            //             var pp1 = this.addToPairs(p, freq, p_pair);
            //             var pp2 = this.addToPairs(p2, freq, p2_pair);
            //             var pp3 = this.addToPairs(q, freq, q_pair);
            //             var pp4 = this.addToPairs(r, freq, r_pair);
            //             var pp5 = this.addToPairs(r2, freq, r2_pair);
            //             var pp6 = this.addToPairs(s, freq, s_pair);
            //             var pp7 = this.addToPairs(t, freq, t_pair);
            //             var pp8 = this.addToPairs(t2, freq, t2_pair);
            //             var pp9 = this.addToPairs(onset, freq, onset_pair);
            //             var pp10 = this.addToPairs(offset, freq, offset_pair);
            //             var pp11 = this.addToPairs(s2, freq, s2_pair);
            //             var pp12 = this.addToPairs(u, freq, u_pair);
            //             var pp13 = this.addToPairs(j, freq, j_pair);
            //             var pp14 = this.addToPairs(f, freq, f_pair);
            //
            //             var pp15 = this.addToPairs(e, freq, e_pair);
            //             var pp16 = this.addToPairs(SL, freq, SL_pair);
            //
            //             // m_pair.push({
            //             //     x: m * (1 / freq),
            //             //     y: this.state.data.datasets.data[m]
            //             // });
            //             // var pp15 = m_pair
            //
            //             return [pp1, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, pp12, pp13, pp14, pp15, pp16, this]
            //         });
            //
            //         parsed_anno.then(anno => {
            //             let p_flag = prev_state.data.annotation.p_flag;
            //             let p2_flag = prev_state.data.annotation.p2_flag;
            //             let q_flag = prev_state.data.annotation.q_flag;
            //             let r_flag = prev_state.data.annotation.r_flag;
            //             let r2_flag = prev_state.data.annotation.r2_flag;
            //             let s_flag = prev_state.data.annotation.s_flag;
            //             let s2_flag = prev_state.data.annotation.s2_flag;
            //             let t_flag = prev_state.data.annotation.t_flag;
            //             let t2_flag = prev_state.data.annotation.t2_flag;
            //             let u_flag = prev_state.data.annotation.u_flag;
            //             let j_flag = prev_state.data.annotation.j_flag;
            //             let f_flag = prev_state.data.annotation.f_flag;
            //             let e_flag = prev_state.data.annotation.e_flag;
            //             let SL_flag = prev_state.data.annotation.SL_flag;
            //             //let m_flag = prev_state.data.annotation.m_flag;
            //             let onset_flag = prev_state.data.annotation.onset_flag;
            //             let offset_flag = prev_state.data.annotation.offset_flag;
            //
            //             let disagFirst_flag = prev_state.data.annotation.disagFirst_flag;
            //             let disagSecond_flag = prev_state.data.annotation.disagSecond_flag;
            //
            //             // If the flag was set before, dont change the data
            //             if (p_flag)
            //                 anno[0] = prev_state.data.annotation.p;
            //             if (p2_flag)
            //                 anno[1] = prev_state.data.annotation.p2;
            //             if (q_flag)
            //                 anno[2] = prev_state.data.annotation.q;
            //             if (r_flag)
            //                 anno[3] = prev_state.data.annotation.r;
            //             if (r2_flag)
            //                 anno[4] = prev_state.data.annotation.r2;
            //             if (s_flag)
            //                 anno[5] = prev_state.data.annotation.s;
            //             if (t_flag)
            //                 anno[6] = prev_state.data.annotation.t;
            //             if (t2_flag)
            //                 anno[7] = prev_state.data.annotation.t2;
            //             if (onset_flag)
            //                 anno[8] = prev_state.data.annotation.onset;
            //             if (offset_flag)
            //                 anno[9] = prev_state.data.annotation.offset;
            //             if (s2_flag)
            //                 anno[10] = prev_state.data.annotation.s2;
            //             if (u_flag)
            //                 anno[11] = prev_state.data.annotation.u;
            //             if (j_flag)
            //                 anno[12] = prev_state.data.annotation.j;
            //             if (f_flag)
            //                 anno[13] = prev_state.data.annotation.f;
            //             if (e_flag)
            //                 anno[14] = prev_state.data.annotation.e;
            //             if (SL_flag)
            //                 anno[15] = prev_state.data.annotation.SL;
            //             // if (m_flag)
            //             //     anno[14] = prev_state.data.annotation.m;
            //             if (disagFirst_flag)
            //                 disag[0] = prev_state.data.annotation.disagFirst;
            //             if (disagSecond_flag)
            //                 disag[1] = prev_state.data.annotation.disagSecond;
            //
            //             // Set flag to true if the data has been loaded
            //             if (!p_flag && anno[0] > 0)
            //                 p_flag = true;
            //
            //             if (!p2_flag && anno[1] > 0)
            //                 p2_flag = true;
            //
            //             if (!q_flag && anno[2] > 0)
            //                 q_flag = true;
            //
            //             if (!r_flag && anno[3] > 0)
            //                 r_flag = true;
            //
            //             if (!r2_flag && anno[4] > 0)
            //                 r_flag = true;
            //
            //             if (!s_flag && anno[5] > 0)
            //                 s_flag = true;
            //
            //             if (!t_flag && anno[6] > 0)
            //                 t_flag = true;
            //
            //             if (!t2_flag && anno[7] > 0)
            //                 t_flag = true;
            //
            //             if (!onset_flag && anno[8] > 0)
            //                 onset_flag = true;
            //
            //             if (!offset_flag && anno[9] > 0)
            //                 offset_flag = true;
            //
            //             if (!s2_flag && anno[10] > 0)
            //                 s2_flag = true;
            //
            //             if (!u_flag && anno[11] > 0)
            //                 u_flag = true;
            //
            //             if (!j_flag && anno[12] > 0)
            //                 j_flag = true;
            //
            //             if (!f_flag && anno[13] > 0)
            //                 f_flag = true;
            //
            //             if (!e_flag && anno[14] > 0)
            //                 e_flag = true;
            //
            //             if (!SL_flag && anno[15] > 0)
            //                 SL_flag = true;
            //
            //             // if (!m_flag && anno[14] > 0)
            //             //     m_flag = true;
            //
            //             if (!disagFirst_flag && disag[0] > 0)
            //                 disagFirst_flag = true;
            //
            //             if (!disagSecond_flag && disag[1] > 0)
            //                 disagSecond_flag = true;
            //
            //             this.setState({
            //                 data: {
            //                     dataRead: dataRead,
            //                     annotation: {
            //                         p: anno[0],
            //                         p2: anno[1],
            //                         q: anno[2],
            //                         r: anno[3],
            //                         r2: anno[4],
            //                         s: anno[5],
            //                         s2: anno[10],
            //                         t: anno[6],
            //                         t2: anno[7],
            //                         u: anno[11],
            //                         j: anno[12],
            //                         f: anno[13],
            //                         e: anno[14],
            //                         SL: anno[15],
            //                         //m: anno[14],
            //                         onset: anno[8],
            //                         offset: anno[9],
            //                         disagFirst: disag[0],
            //                         disagSecond: disag[1],
            //                         selectedAnnotation: prev_state.data.annotation.selectedAnnotation,
            //                         p_flag: p_flag,
            //                         p2_flag: p2_flag,
            //                         q_flag: q_flag,
            //                         r_flag: r_flag,
            //                         r2_flag: r2_flag,
            //                         s_flag: s_flag,
            //                         s2_flag: s2_flag,
            //                         t_flag: t_flag,
            //                         t2_flag: t2_flag,
            //                         u_flag: u_flag,
            //                         j_flag: j_flag,
            //                         f_flag: f_flag,
            //                         e_flag: e_flag,
            //                         SL_flag: SL_flag,
            //                         //m_flag: m_flag,
            //                         onset_flag: onset_flag,
            //                         offset_flag: offset_flag,
            //
            //                         disagFirst_flag: disagFirst_flag,
            //                         disagSecond_flag: disagSecond_flag
            //
            //                         //disagSecondAnnID:
            //
            //                     },
            //                     annotatorID: this.props.inputArr.annotatorID
            //                     //annotatorID:
            //                 }
            //             })
            //         });
            //     });
            // }
            // else {
            //     this.setState({
            //         data: {
            //             dataRead: dataRead,
            //             annotation: {
            //                 p: prev_state.data.annotation.p,
            //                 p2: prev_state.data.annotation.p2,
            //                 q: prev_state.data.annotation.q,
            //                 r: prev_state.data.annotation.r,
            //                 r2: prev_state.data.annotation.r2,
            //                 s: prev_state.data.annotation.s,
            //                 s2: prev_state.data.annotation.s2,
            //                 t: prev_state.data.annotation.t,
            //                 t2: prev_state.data.annotation.t2,
            //                 u: prev_state.data.annotation.u,
            //                 j: prev_state.data.annotation.j,
            //                 f: prev_state.data.annotation.f,
            //                 e: prev_state.data.annotation.e,
            //                 SL: prev_state.data.annotation.SL,
            //                 //m: prev_state.data.annotation.m,
            //                 onset: prev_state.data.annotation.onset,
            //                 offset: prev_state.data.annotation.offset,
            //                 disagFirst: prev_state.data.annotation.disagFirst,
            //                 disagSecond: prev_state.data.annotation.disagSecond,
            //                 selectedAnnotation: next_props.inputArr.extra_info.selectedAnnotation
            //             }
            //         }
            //     })
             }
        }
    }

    static getDerivedStateFromProps(next_props, prev_state) {

        console.log('getDerivedStateFromProps')

        var freq = next_props.inputArr.freq

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
                    // annotation: {
                    //     p: prev_state.data.annotation.p,
                    //     p2: prev_state.data.annotation.p2,
                    //     q: prev_state.data.annotation.q,
                    //     r: prev_state.data.annotation.r,
                    //     r2: prev_state.data.annotation.r2,
                    //     s: prev_state.data.annotation.s,
                    //     s2: prev_state.data.annotation.s2,
                    //     t: prev_state.data.annotation.t,
                    //     t2: prev_state.data.annotation.t2,
                    //     u: prev_state.data.annotation.u,
                    //     j: prev_state.data.annotation.j,
                    //     f: prev_state.data.annotation.f,
                    //     e: prev_state.data.annotation.e,
                    //     SL: prev_state.data.annotation.SL,
                    //     //m: prev_state.data.annotation.m,
                    //     onset: prev_state.data.annotation.onset,
                    //     offset: prev_state.data.annotation.offset,
                    //     disagFirst: prev_state.data.annotation.disagFirst,
                    //     disagSecond: prev_state.data.annotation.disagSecond,
                    //     selectedAnnotation: next_props.inputArr.extra_info.selectedAnnotation,
                    //
                    //     oldP: [''],
                    //     oldP2: [''],
                    //     oldQ: [''],
                    //     oldR: [''],
                    //     oldR2: [''],
                    //     oldS: [''],
                    //     oldS2: [''],
                    //     oldT: [''],
                    //     oldT2: [''],
                    //     oldU: [''],
                    //     oldJ: [''],
                    //     oldF: [''],
                    //     oldE: [''],
                    //     oldSL: [''],
                    //     //oldM: [''],
                    //     oldOnset: [''],
                    //     oldOffset: [''],
                    //     oldDisagFirst: [''],
                    //     oldDisagSecond: [''],
                    //
                    //     p_flag: prev_state.data.annotation.p_flag,
                    //     p2_flag: prev_state.data.annotation.p2_flag,
                    //     q_flag: prev_state.data.annotation.q_flag,
                    //     r_flag: prev_state.data.annotation.r_flag,
                    //     r2_flag: prev_state.data.annotation.r2_flag,
                    //     s_flag: prev_state.data.annotation.s_flag,
                    //     s2_flag: prev_state.data.annotation.s2_flag,
                    //     t_flag: prev_state.data.annotation.t_flag,
                    //     t2_flag: prev_state.data.annotation.t2_flag,
                    //     u_flag: prev_state.data.annotation.u_flag,
                    //     j_flag: prev_state.data.annotation.j_flag,
                    //     f_flag: prev_state.data.annotation.f_flag,
                    //     e_flag: prev_state.data.annotation.e_flag,
                    //     SL_flag: prev_state.data.annotation.SL_flag,
                    //     //m_flag: prev_state.data.annotation.m_flag,
                    //     onset_flag: prev_state.data.annotation.onset_flag,
                    //     offset_flag: prev_state.data.annotation.offset_flag,
                    //     disagFirst_flag: prev_state.data.annotation.disagFirst_flag,
                    //     disagSecond_flag: prev_state.data.annotation.disagSecond_flag
                    // },
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
                        u: [{x: 0, y: 10000}],
                        j: [{x: 0, y: 10000}],
                        f: [{x: 0, y: 10000}],
                        e: [{x: 0, y: 10000}],
                        SL: [{x: 0, y: 10000}],
                        //m: [{x: 0, y: 10000}],
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
                        oldU: [''],
                        oldJ: [''],
                        oldF: [''],
                        oldE: [''],
                        oldSL: [''],
                        //oldM: [''],
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
                        u_flag: false,
                        j_flag: false,
                        f_flag: false,
                        e_flag: false,
                        SL_flag: false,
                        //m_flag: false,
                        onset_flag: false,
                        offset_flag: false,

                        disagFirst: [{x: 0, y: 10000, type: 0}],
                        disagSecond: [{x: 0, y: 10000, type:0}],
                        oldDisagFirst: [''],
                        oldDisagSecond: [''],
                        disagFirst_flag: false,
                        disagSecond_flag: false,
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
                // {
                //     label: 'P',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorP,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorPOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.p
                // },
                // {
                //     label: 'P2',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorP2,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorP2Opacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.p2
                // },
                // {
                //     label: 'Q',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorQ,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorQOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.q
                // },
                // {
                //     label: 'R',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorR,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorROpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.r
                // },
                // {
                //     label: 'R2',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorR2,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorR2Opacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.r2
                // },
                // {
                //     label: 'S',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorS,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorSOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.s
                // },
                // {
                //     label: 'T',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorT,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorTOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.t
                // },
                // {
                //     label: 'T2',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorT2,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorT2Opacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.t2
                // },
                // {
                //     label: 'Onset',
                //     fill: true,
                //     pointStyle: 'line',
                //     pointRotation: 90,
                //     pointBorderColor: colorOn,
                //     pointRadius: 10,
                //     pointHitRadius: 1,
                //     pointHoverRadius: 15,
                //     pointBorderWidth: 3,
                //     backgroundColor: colorOnOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.onset
                // },
                // {
                //     label: 'Offset',
                //     fill: true,
                //     pointStyle: 'line',
                //     pointBorderColor: colorOff,
                //     pointRotation: 90,
                //     pointRadius: 10,
                //     pointHitRadius: 1,
                //     pointHoverRadius: 15,
                //     pointBorderWidth: 3,
                //     backgroundColor: colorOffOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.offset
                // },
                // {
                //     label: 'S2',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorS2,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorS2Opacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.s2
                // },
                // {
                //     label: 'U',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorU,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorUOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.u
                // },
                // {
                //     label: 'J',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorJ,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorJOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.j
                // },
                // {
                //     label: 'F',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorF,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorFOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.f
                // },
                // {
                //     label: 'E',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorEpsilon,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorEpsilonOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.e
                // },
                // {
                //     label: 'SL',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorSlur,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorSlurOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.SL
                // },
                // {
                //     label: 'D1',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorDisagFirst,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 3,
                //     backgroundColor: colorDisagFirstOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.disagFirst
                // },
                // {
                //     label: 'D2',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointRotation: 180,
                //     pointBorderColor: colorDisagSecond,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 3,
                //     backgroundColor: colorDisagSecondOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.disagSecond
                // },
                // {
                //     label: 'M',
                //     fill: true,
                //     pointStyle: 'circle',
                //     pointBorderColor: colorM,
                //     pointRadius: 5,
                //     pointHitRadius: 3,
                //     pointHoverRadius: 10,
                //     pointBorderWidth: 2,
                //     backgroundColor: colorMOpacity,
                //     showLine: false,
                //     tooltipHidden: false,
                //     data: this.state.data.annotation.m
                // },
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
        for (var i = 0; i < ampArray.length; i++) {
            total += ampArray[i];
        }
        var avg = total / ampArray.length;


        let minValue = Math.min(...ampArray);
        let maxValue = Math.max(...ampArray);

        // console.log(this.state.data.datasets.label);
        // console.log(minValue);
        // console.log(avg);
        // console.log(maxValue);


        let ampDivergence = Math.abs(maxValue - minValue);
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
            //console.log(HEIGHT);
        }
        console.log(calculatedHeight)
        //HEIGHT = 200

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
                                height={HEIGHT - 20}
                                //height={500}
                                ref={this.chartRef}
                                getElementAtEvent={(point) => {

                                    if (point.length == 0) {

                                    } else {
                                        let a = point[0]._datasetIndex;
                                        let aa = dat;
                                        let ds = dat.datasets[point[0]._datasetIndex];
                                        let temp = ds.data;
                                        var pp = temp[point[0]._index];


                                        //this.modifyGraph(point, pp);
                                    }
                                }}
                                options={{
                                    maintainAspectRatio: false,
                                    tooltips: {
                                        enabled: true,
                                        position: 'average',
                                        caretPadding: 20,
                                        callbacks: {
                                            label: function (tooltipItems, data) {
                                                console.log(tooltipItems);


                                                if (tooltipItems.datasetIndex == 0) {
                                                    return tooltipItems.xLabel + ' s, ' + tooltipItems.yLabel + ' mv';
                                                } else if (tooltipItems.datasetIndex == 1) {
                                                    return 'P peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 2) {
                                                    return 'P2 peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 3) {
                                                    return 'Q peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 4) {
                                                    return 'R peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 5) {
                                                    return 'R2 peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 6) {
                                                    return 'S peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 11) {
                                                    return 'S2 peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 7) {
                                                    return 'T peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 8) {
                                                    return 'T2 peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 9) {
                                                    return 'Onset ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 10) {
                                                    return 'Offset ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 12) {
                                                    return 'U peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 13) {
                                                    return 'J peak at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 14) {
                                                    return 'Flutter at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 15) {
                                                    return 'Epsilon at ' + tooltipItems.xLabel + ' s';
                                                } else if (tooltipItems.datasetIndex == 16) {
                                                    return 'Slur at ' + tooltipItems.xLabel + ' s';
                                                }
                                                    // else if (tooltipItems.datasetIndex == 17) {
                                                    //     return 'Mapping at' + tooltipItems.xLabel + ' s';
                                                // }
                                                else if (tooltipItems.datasetIndex == 17 || tooltipItems.datasetIndex == 18) {

                                                    let ds = data.datasets[tooltipItems.datasetIndex];
                                                    let temp = ds.data;
                                                    let point = temp[tooltipItems.index];
                                                    let pointType = point.type;
                                                    let pointAnnID = point.annID;

                                                    var annName = '';

                                                    if (pointAnnID == 1)
                                                        annName = 'Baha';
                                                    else if (pointAnnID == 2)
                                                        annName = 'Gab';
                                                    else if (pointAnnID == 3)
                                                        annName = 'Jake';
                                                    else if (pointAnnID == 4)
                                                        annName = 'Seb';

                                                    if (pointType == 0) {
                                                        return 'P peak ' + annName;
                                                    } else if (pointType == 1) {
                                                        return 'P2 peak ' + annName;
                                                    } else if (pointType == 2) {
                                                        return 'Q peak ' + annName;
                                                    } else if (pointType == 3) {
                                                        return 'R peak ' + annName;
                                                    } else if (pointType == 4) {
                                                        return 'R2 peak ' + annName;
                                                    } else if (pointType == 5) {
                                                        return 'S peak ' + annName;
                                                    } else if (pointType == 10) {
                                                        return 'S2 peak ' + annName;
                                                    } else if (pointType == 6) {
                                                        return 'T peak ' + annName;
                                                    } else if (pointType == 7) {
                                                        return 'T2 peak ' + annName;
                                                    } else if (pointType == 8) {
                                                        return 'Onset ' + annName;
                                                    } else if (pointType == 9) {
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

                                                console.log(item);

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
                                                max: this.state.data.max + 500
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

export default GraphReadOnly;
