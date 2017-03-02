import React, {Component} from 'react'
import Console from './Console'

import scriptLoader from 'react-async-script-loader'

class ConsoleWrapper extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {isScriptLoaded, isScriptLoadSucceed} = this.props
    const content = isScriptLoaded && isScriptLoadSucceed
      ? <Console {...this.props} />
      : this.props.children ? <div>{this.props.children}</div> : <div>Loading...</div>

    return (
      <div className='api-designer-container'>
        {content}
      </div>
    )
  }
}

ConsoleWrapper.propTypes = {
  raml: React.PropTypes.object  
}

export default {
  load: (libUrl) => scriptLoader(libUrl)(ConsoleWrapper)
}