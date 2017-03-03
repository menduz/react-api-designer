import React, {Component} from 'react'
import scriptLoader from 'react-async-script-loader'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Console from './Console'

import './ConsoleLoader.css'

class ConsoleWrapper extends Component {

  render() {
    const {isScriptLoaded, isScriptLoadSucceed, raml} = this.props
    const content = isScriptLoaded && isScriptLoadSucceed
      ? <Console raml={raml} />
      : <div className="ConsoleLoader loading"><Spinner size="m"/></div>

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