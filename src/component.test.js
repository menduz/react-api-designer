//@flow
import React from "react"
import ReactDOM from "react-dom"
import App from "./components/app/App"
import "./index.css"
import {createStore, applyMiddleware, combineReducers} from "redux"
import {Provider} from "react-redux"
import thunk from "redux-thunk"
import * as component from "./component"
import {Header} from './components/header'
import {FileSystem} from "./repository/file-system/FileSystem";
import MemoryFileSystem from "./repository/file-system/MemoryFileSystem";
import FileSystemBuilder, {file, directory} from "./repository/file-system/FileSystemBuilder";

// mock loader config (todo improve this...)
window.require = (some) => {
  // console.log('Trying to load', some)
}
window.require.getConfig = () => {
  return {
    paths: {
      worker: 'path-to-worker.js',
      console: 'path-to-console.js'
    }
  }
}

// some basic filesystem to start with
const createFileSystem = (): Promise<FileSystem> => {
  return new FileSystemBuilder()
    .withFile(file('api.raml', '#%RAML 1.0\ntitle: myApi'))
    .withDirectory(directory('library')
      .withFile(file('lib.raml', '#%RAML 1.0 Library'))
    )
    .withDirectory(directory('examples')
      .withFile(file('example.json', '{"name": "My name"}'))
    )
    .build(MemoryFileSystem.empty())
}

const createDesigner = async (fileSystem): Promise<any> => {
  // mock some initial config
  const authSelectors = {
    authorization: () => 'Bearer bd516ec3-75fb-484b-969f-5802f50e5e01',
    ownerId: () => 'd365610a-8e56-42da-a3fc-73b548371cc6',
    organizationId: () => 'b13cbf39-787d-4d1f-9c72-22275ecc0d59',
    organizationDomain: () => 'mulesoft-inc'
  }

  // create middleware
  const thunkExtraArg = component.initThunkArg(authSelectors)
  const reducers = combineReducers(component.reducers);
  const midleware = applyMiddleware(thunk.withExtraArgument(thunkExtraArg));

  // create store
  const store = createStore(reducers, midleware)
  store.dispatch(component.actions.initCustom(fileSystem))

  // render
  const rootDiv = document.createElement('div')
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <Header/>
        <App/>
      </div>
    </Provider>,
    rootDiv
  )
  return rootDiv
}


it('renders without crashing', async() => {
  // create files-system
  const fileSystem = await createFileSystem()
  // create designer
  const designerDiv = await createDesigner(fileSystem)

  expect(designerDiv.querySelector('div.Tree-loading')).not.toBeNull()
  expect(designerDiv.querySelector('div.Tree-loading').textContent).toBe('Loading...')
})

const treeLoaded = function (designerDiv) {
  return new Promise((resolve) => {
    setInterval(() => {
      if (!designerDiv.querySelector('div.Tree-loading')) resolve()
    }, 10)
  })
}

it('renders tree of files', async() => {
  // create files-system
  const fileSystem = await createFileSystem()
  // create designer
  const designerDiv = await createDesigner(fileSystem)

  // wait for tree to finish loading
  await treeLoaded(designerDiv)

  // once tree finishes loading, check for tree content
  expect(designerDiv.querySelector('.Tree div[data-path="/api.raml"]')).not.toBeNull()
  expect(designerDiv.querySelector('.Tree div[data-path="/api.raml"]').textContent).toBe('api.raml')
  expect(designerDiv.querySelector('.Tree div[data-path="/examples"]')).not.toBeNull()
  expect(designerDiv.querySelector('.Tree div[data-path="/examples"]').textContent).toBe('examples')
})