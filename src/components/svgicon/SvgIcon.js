import React, {Component, PropTypes} from 'react'

const SPRITE_PATH = (window.nodeRequire ? './build/' : '/assets/') + 'sprite-4.1.0.svg'

class Icon extends Component {
  render() {
    const {name, size, fill} = this.props

    return <div className="anypoint-icon" style={{display: 'inline-block'}}>
      <svg style={{width: size, height: size, fill: fill }}
           dangerouslySetInnerHTML={{__html: `<use xlink:href="${SPRITE_PATH}#${name}"/>` }}/>
    </div>
  }
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  fill: PropTypes.string,
}

export default Icon