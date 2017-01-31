// @flow

import React, {Component} from 'react'
import {Preview} from '../preview'
import {Errors} from '../errors'
import TabPanel from '@mulesoft/anypoint-components/lib/TabPanel'
import TabList from '@mulesoft/anypoint-components/lib/TabList'
import Tab from '@mulesoft/anypoint-components/lib/Tab'
import Tabs from '@mulesoft/anypoint-components/lib/Tabs'
import Icon from '@mulesoft/anypoint-icons/lib/Icon'
import {connect} from 'react-redux'
import './info.css'

class Info extends Component {

  static KEY = 'designer:preference:infoTab'

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: parseInt(localStorage.getItem(Info.KEY) || 0, 10)
    }

    // fix selected tab color
    window.addEventListener('resize', () => this.forceUpdate())
  }

  _onTabSelect(selectedTab) {
    this.setState({selectedTab})
    localStorage.setItem(Info.KEY, selectedTab)
  }

  render() {
    const {selectedTab} = this.state
    const {errors} = this.props
    const amount = errors.length
    return (
      <div className="Info">
        <Icon name="detail-pane" className="Issue-icon"/>
        <Tabs selectedIndex={selectedTab} stretch={false} className="InfoPanel">
          <TabList className="InfoPanelTabs">
            <Tab onClick={this._onTabSelect.bind(this, 0)}>Preview</Tab>
            <Tab onClick={this._onTabSelect.bind(this, 1)}>
              <strong className="Counter"> {amount !== 0 ? amount : null} </strong>
              {amount === 1 ? 'Issue' : 'Issues'}
            </Tab>
          </TabList>
          <TabPanel>
            {selectedTab === 0 ? <Preview/> : null}
          </TabPanel>
          <TabPanel>
            {selectedTab === 1 ? <Errors/> : null}
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {editor} = state
  return {
    errors: editor.errors
  }
}

export default connect(mapStateToProps)(Info)