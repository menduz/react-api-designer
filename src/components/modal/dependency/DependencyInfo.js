// @flow

import * as React from 'react'

import type {Fragment} from '../consume-api/Fragment'
import type {GAV} from './DependencyModel'

class DependencyInfo extends React.Component {
  props: DependencyInfoProp

  render() {
    const fragment: Fragment = this.props.fragment
    if (fragment) {
      const {canUpdate} = this.props
      const currentGAV: GAV = this.props.currentGAV

      const keys = []
      const values = []

      Object.entries(fragment)
        .filter(tuple => (tuple[0] !== 'name'))
        .forEach((tuple, index) => {
          const [key, value] = tuple
          keys.push(
            <div className="cell key" key={`${key.toString()}-${index}`}>
              {`${this._prettifyKey(key)}:`}
            </div>
          )
          values.push(
            <div className="cell value" key={`value-${index}`}>
              {this._printValue(key, (key === 'version' && canUpdate) ? currentGAV.version : value)}
            </div>
          )
        })

      return (
        <div className="fragment-props-table">
          <div className="column fragment-keys">{keys}</div>
          <div className="column fragment-values">{values}</div>
        </div>
      )
    }
    else {
      return (
        <div className="fragment-empty">
          <h3>Empty Fragment</h3>
        </div>
      )
    }
  }

  _prettifyKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  }

  _printValue(key: string, value: any): string {
    if (key === 'createdAt' || key === 'updatedAt') return new Date(value).toDateString()
    return value
  }
}

type DependencyInfoProp = {
  fragment: $Shape<Fragment>,
  canUpdate: boolean,
  currentGAV: GAV
}

export default DependencyInfo