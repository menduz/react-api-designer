import * as React from 'react';

export default class Button extends React.Component<ButtonProps, {}> {
    constructor(props: ButtonProps);

    render(): JSX.Element;
}

export interface ButtonProps {
    /** text inside button */
    label?: string;
    /** button type */
    type?: string;
    /** if no label prop, children used. text/elements inside the button */
    children?: any;
    /** determine the style of the button */
    kind?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    /** If true, use hollow inverted button styles */
    noFill?: boolean;
    /** Pass in your onClick handler here */
    onClick?: (e: any) => void;
    /** custom style attribute applied to the button */
    style?: {[key: string]: any};
    /** className applied to button */
    className?: string;
    /** If true, button will be disbaled and click handlers will not fire */
    disabled?: boolean;
    /** If href supply button will link out to another page */
    href?: string;
    /** If href and target supplied, this determines how the link should behave */
    target?: '_blank' | '_self' | '_parent';
    /** If true, button is disabled and a spinner will be shown */
    isLoading?: boolean;
    /** If prop used, a tooltip will appear on hover */
    tooltip?: string | HTMLElement;
    /** custom style attribute applied to the tooltip */
    tooltipStyle?: {[key: string]: any};
    /** sets the position of the tooltip relative to the button */
    tooltipPosition?: 'top' | 'right' | 'left' | 'bottom';
    /** The icon prop sets the icon used in the button. See icons component for more info. */
    icon?: string;
    /** Position of the Icon */
    iconPosition?: 'left' | 'right';
    /** Private?: If true, labels are ignored and action buttons are rendered with icon name provided */
    _isActionButton?: boolean;
}