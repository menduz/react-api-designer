//@flow
import React, {Component} from 'react'
import {Preview} from '../preview'
import {Errors} from '../errors'
import TabPanel from '@mulesoft/anypoint-components/lib/TabPanel'
import TabList from '@mulesoft/anypoint-components/lib/TabList'
import Tab from '@mulesoft/anypoint-components/lib/Tab'
import Tabs from '@mulesoft/anypoint-components/lib/Tabs'

class Info extends Component {

  static key = 'designer:preference:selectedTab'

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: parseInt(localStorage.getItem(Info.key) || 0, 10)
    }
  }

  _onTabSelect(selectedTab) {
    this.setState({selectedTab})
    localStorage.setItem(Info.key, selectedTab)
  }

  render() {
    const {selectedTab} = this.state
    return (
      <Tabs selectedIndex={selectedTab} className="InfoPanel">
        <TabList>
          <Tab onClick={this._onTabSelect.bind(this, 0)}>Preview</Tab>
          <Tab onClick={this._onTabSelect.bind(this, 1)}>Issues</Tab>
        </TabList>
        <TabPanel>
          <Preview/>
        </TabPanel>
        <TabPanel>
          <Errors/>
        </TabPanel>
      </Tabs>
    )
  }
}

export default Info
