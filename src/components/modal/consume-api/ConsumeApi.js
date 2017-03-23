// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from '@mulesoft/anypoint-components/lib/Button'
import Modal from '@mulesoft/anypoint-components/lib/Modal'
import ModalHeader from '@mulesoft/anypoint-components/lib/ModalHeader'
import ModalBody from '@mulesoft/anypoint-components/lib/ModalBody'
import ModalFooter from '@mulesoft/anypoint-components/lib/ModalFooter'
import Search from '@mulesoft/anypoint-components/lib/Search'
import Spinner from '@mulesoft/anypoint-components/lib/Spinner'
import Toast from '@mulesoft/anypoint-components/lib/Toast'
import * as actions from './ConsumeApiActions'
import {List} from 'immutable'
import {Fragment} from './Fragment'
import {getFragments, getQuery, isSubmitting, isSearching, getError, isAddingMore, isNoMoreFragments} from './selectors'
import './ConsumeApi.css'
import FragmentComponent from './FragmentComponent'
import InfiniteScroll from 'react-infinite-scroller'

class ConsumeApi extends Component {

  onSearchChange(event) {
    this.props.updateQuery(event.value)
  }

  handleFragmentSelection(index, fragment, event) {
    this.props.handleFragmentSelection(index, fragment, event.value)
  }

  handleSearchFragment(query) {
    this.props.searchFragment(query)
  }

  renderFragments(fragments: List<Fragment>) {
    return fragments.map((fragment: Fragment, index) => {
      return <FragmentComponent isOdd={index % 2 !== 0}
                                key={`fragment${index}`}
                                fragment={fragment}
                                handleFragmentSelection={this.handleFragmentSelection.bind(this, index, fragment)}/>
    })
  }

  render() {
    const {
      onCancel, fragments, query, submit, isSearching,
      isSubmitting, error, closeError, isAddingMore, noMoreFragments
    } = this.props
    const numSelectedFragments = fragments.count(fragment => fragment.selected)

    return (
      <Modal testId="Consume-Modal"
             onEsc={onCancel}
             onClickOverlay={onCancel}
             className="consume-api-modal">
        <ModalHeader onClose={onCancel}>
          <h1>Consume API Fragment</h1>
        </ModalHeader>
        {error.length > 0 ?
          <div className="error-zone">
            <Toast title={error} kind="error" onClose={closeError} testId="Consume-Error"/>
          </div> : null}
        <ModalBody className="consume-api-body">
          <InfiniteScroll loadMore={this.props.addMoreFragments}
                          hasMore={!isSearching && !noMoreFragments}
                          useWindow={false}
                          initialLoad={false}>
            <div className="search-panel">
              <Search onSearch={this.handleSearchFragment.bind(this, query)}
                      onChange={this.onSearchChange.bind(this)} //TODO change this to an action in searchMore!
                      className="consume-api-searcher"
                      query={query}
                      placeholder="Search for fragments"
                      id="consume-search"
                      testId="Consume-Search"/>
            </div>
            <div className="consume-api-content" data-test-id="Consume-Content">
              {isSearching ?
                <div className="search-spinner"><Spinner size="l"/></div> :
                fragments.size > 0 ?
                  this.renderFragments(fragments) :
                  null
              }
              {isAddingMore ? <div className="small-spinner"><Spinner size="m"/></div> : null}
            </div>
        </InfiniteScroll>
        </ModalBody>
        <ModalFooter className="search-footer">
          <div className="modal-button-zone">
            <Button kind="tertiary" noFill onClick={onCancel} testId="Cancel-Consume-Button">Cancel</Button>
            <Button kind="primary"
                    isLoading={isSubmitting}
                    disabled={numSelectedFragments === 0}
                    onClick={submit.bind(this, fragments)}
                    testId="Submit-Consume-Button">
              {isSubmitting ?
                'Submitting...'
                : `Add ${numSelectedFragments !== 0 ? numSelectedFragments : ''} Dependenc${numSelectedFragments > 1 ? 'ies' : 'y'}`
              }
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    fragments: getFragments(state),
    query: getQuery(state),
    isSearching: isSearching(state),
    error: getError(state),
    isSubmitting: isSubmitting(state),
    isAddingMore: isAddingMore(state),
    noMoreFragments: isNoMoreFragments(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    searchFragment: (query: string) => dispatch(actions.searchFragments(query)),
    handleFragmentSelection: (index: number, fragment: Fragment, selected: boolean) =>
      dispatch(actions.handleFragmentSelection(index, fragment, selected)),
    updateQuery: (query: string) => dispatch(actions.updateQuery(query)),
    submit: (fragments: List<Fragment>) => dispatch(actions.submit(fragments)),
    closeError: () => dispatch(actions.showError('')),
    addMoreFragments: () => dispatch(actions.searchMoreFragments())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsumeApi)
