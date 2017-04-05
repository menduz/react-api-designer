import React, {Component} from 'react'
import {ResizablePanel} from '../MulesoftComponents'
import Storage from '../../storage'

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
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300)
    this.setState({open: event.value})
  }

  render() {
    return (
      <ResizablePanel {...this.props}
                      width={this.state.width}
                      isOpen={this.state.open}
                      onResize={this.handleResize.bind(this)}
                      onToggle={this.handleToggle.bind(this)}>
        {this.props.children}
      </ResizablePanel>
    )
  }
}

ResizablePanelWrapper.propTypes = {
  id: React.PropTypes.string.isRequired,
  position: React.PropTypes.oneOf(['left', 'right'])
}

export default ResizablePanelWrapper