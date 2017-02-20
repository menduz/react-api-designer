import React, {Component} from 'react'
import cx from 'classnames'
import Rating from '@mulesoft/anypoint-components/lib/Rating'
import Checkbox from '@mulesoft/anypoint-components/lib/Checkbox'

export default class FragmentComponent extends Component {

  render() {
    const {fragment, handleFragmentSelection, isOdd} = this.props
    return (
      <div className={cx('fragment', {'odd': isOdd})}>
        <div className="fragment-left">
          <span className="fragment-title">{fragment.name}</span>
          <span className="fragment-description">{fragment.description}</span>
          <div className="rating">
            <Rating className="fragment-rating" testId="fragment-rating-test" rating={fragment.rating} disabled/>
            <span className="amount-of-rating">
                  {` (${fragment.numberOfRates} vote${fragment.numberOfRates !== 1 ? 's' : ''})`}
                </span>
          </div>
        </div>
        <div className="fragment-mid">
          <span>{`Version: ${fragment.version || '-'}`}</span>
          <span>{`GroupId: ${fragment.groupId || '-'}`}</span>
          <span>{`AssetId: ${fragment.assetId || '-'}`}</span>
        </div>
        <div className="fragment-right">
          <Checkbox onChange={handleFragmentSelection}/>
        </div>
      </div>
    )
  }
}