//@flow
import React, {Component} from 'react'
import {Preview} from '../preview'
import {Errors} from '../errors'
import TabPanel from '@mulesoft/anypoint-components/lib/TabPanel'
import TabList from '@mulesoft/anypoint-components/lib/TabList'
import Tab from '@mulesoft/anypoint-components/lib/Tab'
import Tabs from '@mulesoft/anypoint-components/lib/Tabs'
import {connect} from 'react-redux'

class Info extends Component {

  static KEY = 'designer:preference:infoTab'

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: parseInt(localStorage.getItem(Info.KEY) || 0, 10)
    }
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
      <Tabs selectedIndex={selectedTab} className="InfoPanel">
        <TabList>
          <Tab onClick={this._onTabSelect.bind(this, 0)}>Preview</Tab>
          <Tab onClick={this._onTabSelect.bind(this, 1)}>
            <strong> {amount !== 0 ? amount : null} </strong>
            {amount === 1 ? 'Issue': 'Issues'}
          </Tab>
        </TabList>
        <TabPanel>
          {selectedTab === 0 ? <Preview/> : null}
        </TabPanel>
        <TabPanel>
          {selectedTab === 1 ? <Errors/> : null}
        </TabPanel>
      </Tabs>
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