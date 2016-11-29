import * as React from 'react';

export default class ActionBar extends React.Component<ActionBarProps, {}> {
    constructor(props: ActionBarProps);

    render(): JSX.Element;
}

export interface ActionBarElement {
    icon: string;
    label: string;
    onClick?: () => void;
    testId?: string;
    to?: string;
}

export interface ActionBarProps {
    /** actionbar contents */
    children?: any;
    /** className applied to actionbar */
    className?: string;
    /** Pass in array of data for the actionbar */
    actions?: ActionBarElement[];
}
