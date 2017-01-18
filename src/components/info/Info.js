//@flow
import React, {Component} from 'react'
import {Preview} from '../preview'
import {Errors} from '../errors'
import TabPanel from '@mulesoft/anypoint-components/lib/TabPanel'
import TabList from '@mulesoft/anypoint-components/lib/TabList'
import Tab from '@mulesoft/anypoint-components/lib/Tab'
import Tabs from '@mulesoft/anypoint-components/lib/Tabs'

class Info extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: parseInt(localStorage.getItem('designer:preference:selectedTab') || 0, 10)
    }
  }

  _onTabSelect(selectedTab) {
    this.setState({selectedTab})
    localStorage.setItem('designer:preference:selectedTab', selectedTab)
  }

  render() {
    const {selectedTab} = this.state
    return (
      <div className="InfoPanel">
        <Tabs selectedIndex={selectedTab}>
          <TabList>
            <Tab onClick={this._onTabSelect.bind(this, 0)}>Preview</Tab>
            <Tab onClick={this._onTabSelect.bind(this, 1)}>Errors</Tab>
          </TabList>
          <TabPanel>
            <Preview/>
          </TabPanel>
          <TabPanel>
            <Errors/>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default Info
