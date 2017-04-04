// @flow

import React, {Component} from 'react'
import cx from 'classnames'

import {Rating, Checkbox} from '../../MulesoftComponents'

export default class FragmentComponent extends Component {

  render() {
    const {fragment, handleFragmentSelection, isOdd} = this.props
    return (
      <div className={cx('fragment', {'odd': isOdd})} data-test-id="Fragment"
           onClick={handleFragmentSelection}>
        <div className="fragment-left">
          <span className="fragment-title">{fragment.name}</span>
          <span className="fragment-description">{fragment.description}</span>
          <div className="rating">
            <Rating className="fragment-rating" testId="Fragment-Rating" rating={fragment.rating} disabled/>
            <span className="amount-of-rating">
              {` (${fragment.numberOfRates} vote${fragment.numberOfRates !== 1 ? 's' : ''})`}
            </span>
          </div>
        </div>
        <div className="fragment-mid">
          <span>{`GroupId: ${fragment.groupId || '-'}`}</span>
          <span>{`AssetId: ${fragment.assetId || '-'}`}</span>
          <span>{`Version: ${fragment.version || '-'}`}</span>
        </div>
        <div className="fragment-right">
          <Checkbox checked={fragment.selected}/>
        </div>
      </div>
    )
  }
}