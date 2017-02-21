import React from 'react'
import {connect} from 'react-redux'
import cx from 'classnames'

import {openImportDialog} from '../../components/modal/import/ImportActions'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'

import './FileDrop.css'

class FileDrop extends React.Component {

  constructor(props) {
    super(props)
    this.dragTimer = null
  }

  onDragLeave() {
    window.clearTimeout(this.dragTimer);
    this.dragTimer = window.setTimeout(() => {
      this.dragOverElem.classList.remove('active');
    }, 100);
  }

  onDragOver(event) {
    const dt = event.dataTransfer;
    if (dt && dt.types && Array.prototype.indexOf.call(dt.types, "Files") !== -1) {
      dt.dropEffect = 'copy'
      window.clearTimeout(this.dragTimer);
      this.dragOverElem.classList.add('active');
      event.preventDefault()
    }
  }

  onDrop(event) {
    event.stopPropagation()
    event.preventDefault()

    const dt = event.dataTransfer;
    if (dt) {
      const files = dt.files;
      if (files && files.length > 0) {
        this.props.openImportDialog(files[0])
        this.dragOverElem.classList.remove('active');
      }
    }
  }

  render() {
    const {children, className} = this.props
    return (
      <div className={cx(className, 'FileDrop')}
           onDragLeave={this.onDragLeave.bind(this)}
           onDragOver={this.onDragOver.bind(this)}
           onDrop={this.onDrop.bind(this)}
           data-testId="File-Drop">
        <div className="FileDragOver" ref={ref => this.dragOverElem = ref}>
          <div>
            <Icon name="download-center-small" fill={"white"}/>
            <div className="text">Drop file to import</div>
          </div>
        </div>
        {children}
      </div>
    )
  }
}

const mapDispatch = (dispatch) => {
  return {
    openImportDialog: (file) => dispatch(openImportDialog(file))
  }
}

export default connect(null, mapDispatch)(FileDrop)
