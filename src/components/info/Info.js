import React, {Component} from 'react'
import {Preview} from '../preview'
import {Errors} from '../errors'
import TabPanel from '@mulesoft/anypoint-components/lib/TabPanel'
import TabList from '@mulesoft/anypoint-components/lib/TabList'
import Tab from '@mulesoft/anypoint-components/lib/Tab'
import Tabs from '@mulesoft/anypoint-components/lib/Tabs'
import Storage from '../../Storage'
import {connect} from 'react-redux'
import './info.css'

class Info extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: parseInt(Storage.getValue('infoTab', 0), 10)
    }

    // fix selected tab color
    window.addEventListener('resize', () => this.forceUpdate())
  }

  _onTabSelect(selectedTab) {
    this.setState({selectedTab})
    Storage.setValue('infoTab', selectedTab)
  }

  render() {
    const {showInfoPanelTabs} = this.props
    return showInfoPanelTabs ? this.renderTabs() : this.renderPlain()
  }

  renderPlain() {
    const {errors, language} = this.props
    const title = language.id === 'raml' ? 'RAML Documentation' : `${language.label || ''} Preview`

    return (
      <div className="InfoPanel">
        <div className="InfoTitle">{title}</div>
        {errors.length > 0 ? <Errors/> : <Preview/>}
      </div>
    )
  }

  renderTabs() {
    const {selectedTab} = this.state
    const {errors} = this.props
    const amount = errors.length

    return (
      <Tabs selectedIndex={selectedTab} stretch={false} className="InfoPanel">
        <TabList className="InfoPanelTabs">
          <Tab testId="previewTab" onClick={this._onTabSelect.bind(this, 0)}>Preview</Tab>
          <Tab testId="errorTab" onClick={this._onTabSelect.bind(this, 1)}>
            <strong className="Counter"> {amount !== 0 ? amount : null} </strong>
            {amount === 1 ? 'Issue' : 'Issues'}
          </Tab>
        </TabList>
        <TabPanel className="InfoPanelTabContent Preview-Tab">
          {selectedTab === 0 ? <Preview/> : null}
        </TabPanel>
        <TabPanel className="InfoPanelTabContent Issues-Tab">
          {selectedTab === 1 ? <Errors/> : null}
        </TabPanel>
      </Tabs>
    )
  }
}

const mapStateToProps = state => {
  const {editor, configuration} = state
  return {
    errors: editor.errors,
    language: editor.language,
    showInfoPanelTabs: configuration.showInfoPanelTabs
  }
}

export default connect(mapStateToProps)(Info)