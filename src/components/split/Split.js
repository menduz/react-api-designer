import React, {Component} from 'react'
import SplitPane from 'react-split-pane'

export default class Split extends Component {

  constructor(props) {
    super(props)

    this.id = 'designer:preference:' + this.props.id
    this.defaultValue = parseInt(localStorage.getItem(this.id) || this.props.defaultSize, 10)
  }

  _onChange(size) {
    localStorage.setItem(this.id, size)
  }

  render() {
    const {primary, split, minSize, children} = this.props
    return (
      <SplitPane split={split} primary={primary} minSize={minSize}
                 defaultSize={this.defaultValue}
                 onChange={this._onChange.bind(this)}>
        {children}
      </SplitPane>
    )
  }
}


Split.propTypes = {
  id: React.PropTypes.string.isRequired,
  split: React.PropTypes.string,
  primary: React.PropTypes.string,
  minSize: React.PropTypes.number,
  defaultSize: React.PropTypes.number
}

Split.defaultProps = {
  split: 'vertical', // or horizontal
  primary: 'first', // or second
  minSize: 10,
  defaultSize: 200
};
