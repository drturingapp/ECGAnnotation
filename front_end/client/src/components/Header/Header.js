import React from 'react';
import styles from './Header.module.scss';

/**
 * Simple component which defines the header text for the application page
 */
export default class Header extends React.Component{

    constructor(props) {
        super(props);

        let annID = this.props.annID;
        var annName = 'A';
        if (annID == 1) {
            annName = 'Gab';
        } else if (annID == 2) {
            annName = 'Jake';
        } else if (annID == 3) {
            annName = 'Baha';
        } else if (annID == 4) {
            annName = 'Seb';
        } else if (annID == 5) {
            annName = 'Dr. Abraham';

        } else if (annID == 8) {
            annName = 'Talha';
        }

        this.state = {
            annName: annName,
        };

    }


    render() {
        return(
            <div className={styles.header}>
                <h2 className={styles.headerText}>
                    Annotator: {this.state.annName}
                </h2>
            </div>
        )
    }
}