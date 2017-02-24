import RemoteApi from './RemoteApi'
import type {XApiDataProvider} from 'XApiDataProvider'

class ExchangeApi extends RemoteApi {

  constructor(dataProvider: XApiDataProvider) {
    super(dataProvider)
  }

  static vcsPath(path: string) {
    return path.startsWith('/') ? path.slice(1) : path;
  }

  static vcsPathForUri(path: string) {
    const relativePath = ExchangeApi.vcsPath(path);
    return ExchangeApi.scapeVcsPath(relativePath)
  }

  static scapeVcsPath(path: string) {
    return path.replace(/\//g, '%5C')
  }
}

export default ExchangeApi