import React, {Component} from 'react'
import {ResizablePanel} from '../MulesoftComponents'
import Storage from '../../storage'
import './ResizablePanelWrapper.css'
import Icon from "../svgicon/SvgIcon";

class ResizablePanelWrapper extends Component {

  constructor(props) {
    super(props)

    const {id} = this.props
    this.sizeKey = `${id}:size`
    this.toggleKey = `${id}:toggle`
    this.state = {
      open: JSON.parse(Storage.getValue(this.toggleKey, 'true')),
      width: parseInt(Storage.getValue(this.sizeKey, 400), 10)
    }
  }

  handleResize(event) {
    Storage.setValue(this.sizeKey, event.value)
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300)
    this.setState({width: event.value})
  }

  handleToggle(event) {
    Storage.setValue(this.toggleKey, event.value)
    setTimeout(() => window.dispatchEvent(new Event('resize')), 800)
    this.setState({open: event.value})
  }

  handleContainerToggle() {
    if (!this.state.open) {
      this.handleToggle({value: true})
    }
  }

  render() {
    const open = this.state.open;
    const className = 'panel panel-' + this.props.position
    const toggleClassNameButton = `toggle-button ${this.props.position} ${open ? 'open' : 'close'}`
    return (
      <div className={open? 'open-container' : 'close-container'}
           onClick={this.handleContainerToggle.bind(this)}>
        <button className={toggleClassNameButton}>
          <Icon name="arrow-up-small" size={15}/>
        </button>
        <ResizablePanel {...this.props}
                        className={className}
                        width={this.state.width}
                        isOpen={open}
                        onResize={this.handleResize.bind(this)}
                        onToggle={this.handleToggle.bind(this)}>
          {this.props.children}
        </ResizablePanel>
      </div>
    )
  }
}

ResizablePanelWrapper.propTypes = {
  id: React.PropTypes.string.isRequired,
  position: React.PropTypes.oneOf(['left', 'right'])
}

export default ResizablePanelWrapper