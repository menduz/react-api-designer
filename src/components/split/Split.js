import React, {Component} from 'react'
import SplitPane from 'react-split-pane'
import cx from 'classnames'
import Drawer from '@mulesoft/anypoint-components/lib/Drawer'
import "./Split.css"

export default class Split extends Component {

  static MIN_SIZE = 30;

  constructor(props) {
    super(props)

    this.sizeKey = 'designer:preference:' + this.props.id + ':locked'
    this.lockedKey = 'designer:preference:' + this.props.id + ':size'

    this.state = {
      dragging: false,
      hover: false,
      locked: localStorage.getItem(this.lockedKey) !== 'false', // locked by default
      size: parseInt(localStorage.getItem(this.sizeKey) || this.props.defaultSize, 10)
    }
  }

  _onHover() {
    this.setState({hover: true})
  }

  _onUnhover() {
    this.setState({hover: false})
  }

  _onToggle(open) {
    if (!open) {
      this._onUnhover()
      this._onToggleLock(false)
    }

    // trigger a resize once the close/open animation has finished
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300)
  }

  _onToggleLock(locked) {
    this.setState({locked})
    localStorage.setItem(this.lockedKey, locked)
  }

  _onDragStart() {
    this.setState({dragging: true})
  }

  _onDragEnd(size) {
    this.setState({dragging: false})
    localStorage.setItem(this.sizeKey, size)
    window.dispatchEvent(new Event('resize'))
  }

  _onDrag(size) {
    this.setState({size})
    if (size <= Split.MIN_SIZE) {
      this._onToggle(false)
    }
  }

  _drawer(child) {
    const {size, hover, locked} = this.state
    const {position} = this.props
    const isOpen = locked || hover

    return (
      <Drawer className="Drawer" position={position} width={size} isOpen={isOpen} isLocked={locked}
              onHover={this._onHover.bind(this)} onUnhover={this._onUnhover.bind(this)}
              onToggle={this._onToggle.bind(this)} onToggleLock={this._onToggleLock.bind(this)}>
        {child}
      </Drawer>
    )
  }

  render() {
    const {size, dragging, hover, locked} = this.state
    const {position, minSize, className, children} = this.props
    const isOpen = locked || hover
    const classNames = cx('Split', className, {'is-dragging': dragging})
    const leftPrimary = position === 'left'

    return (
      <SplitPane className={classNames}
                 split="vertical" primary={leftPrimary ? "first" : "second"}
                 minSize={minSize} size={isOpen ? size : Split.MIN_SIZE} onChange={this._onDrag.bind(this)}
                 onDragStarted={this._onDragStart.bind(this)} onDragFinished={this._onDragEnd.bind(this)}>
        {leftPrimary ? this._drawer(children[0]) : children[0]}
        {leftPrimary ? children[1] : this._drawer(children[1])}
      </SplitPane>
    )
  }
}


Split.propTypes = {
  className: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  position: React.PropTypes.oneOf(['left', 'right']),
  minSize: React.PropTypes.number,
  defaultSize: React.PropTypes.number
}

Split.defaultProps = {
  position: 'left', // "top" | "left" | "right" | "bottom"
  minSize: 100,
  defaultSize: 200
};
