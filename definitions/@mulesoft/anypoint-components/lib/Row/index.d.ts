import * as React from 'react';

export default function Row(props: RowProps): JSX.Element;

export interface RowProps {
    /** Contents in the row */
    children?: any,
    /**
     Flexbox alignment. This prop takes in a string with two values:
     <pre>horizontalAlignment verticalAlignment</pre>
     <h4>Default alignment</h4>
     The default alignment is "space-between center"
     <h4>horizontalCases</h4>
     <pre>'left', 'right', 'center', 'space-around', 'space-between'</pre>
     <h4>verticalCases</h4>
     <pre>'top', 'bottom', 'center', 'stretch'</pre>
     */
    align?: 'left top'| 'right top'| 'center top'| 'middle top'| 'flex-start top'| 'flex-end top'| 'space-around top'
        | 'space-between top'| 'left center'| 'right center'| 'center center'| 'middle center'| 'flex-start center'
        | 'flex-end center'| 'space-around center'| 'space-between center'| 'left middle'| 'right middle'
        | 'center middle'| 'middle middle'| 'flex-start middle'| 'flex-end middle'| 'space-around middle'
        | 'space-between middle'| 'left bottom'| 'right bottom'| 'center bottom'| 'middle bottom'| 'flex-start bottom'
        | 'flex-end bottom'| 'space-around bottom'| 'space-between bottom'| 'left stretch'| 'right stretch'
        | 'center stretch'| 'middle stretch'| 'flex-start stretch'| 'flex-end stretch'| 'space-around stretch'
        | 'space-between stretch'| 'left fill'| 'right fill'| 'center fill'| 'middle fill'| 'flex-start fill'
        | 'flex-end fill'| 'space-around fill'| 'space-between fill'| 'left full'| 'right full'| 'center full'
        | 'middle full'| 'flex-start full'| 'flex-end full'| 'space-around full'| 'space-between full'
        | 'left space-around'| 'right space-around'| 'center space-around'| 'middle space-around'
        | 'flex-start space-around'| 'flex-end space-around'| 'space-around space-around'
        | 'space-between space-around'| 'left'| 'right'| 'center'| 'middle'| 'flex-start'| 'flex-end'| 'space-around'
        | 'space-between';
    wrap?: boolean,
    /** This will apply flex:auto to the row */
    auto?: boolean,
    className?: string,
    height?: string,
    style?: {[key: string]: any}
}