import ConsumeApi from './ConsumeApi'
import * as ConsumeApiActions from './ConsumeApiActions'
import ConsumeApiReducer from './ConsumeApiReducer'
import * as ConsumeApiConstants from './ConsumeApiConstants'
import {Fragment} from './Fragment'

export default {
  name: ConsumeApiConstants.NAME,
  url: ConsumeApiConstants.URL,
  reducer: ConsumeApiReducer,
  actions: ConsumeApiActions,
  ConsumeApi,
  Fragment
}