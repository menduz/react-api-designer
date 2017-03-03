import {List} from 'immutable'
import {Fragment} from './Fragment'
import ConsumeRemoteApi from '../../../remote-api/ConsumeRemoteApi'
import type {Dispatch, GetState, ExtraArgs} from '../../../types'

export const FRAGMENTS_CHANGED = 'CONSUME_API/FRAGMENTS_CHANGED'
export const OPEN_MODAL = 'CONSUME_API/OPEN_MODAL'
export const CLEAR = 'CONSUME_API/CLEAR'
export const UPDATE_QUERY = 'CONSUME_API/UPDATE_QUERY'
export const IS_SEARCHING = 'CONSUME_API/IS_SEARCHING'
export const IS_SUBMITTING = 'CONSUME_API/IS_SUBMITTING'
export const ERROR = 'CONSUME_API/ERROR'
export const ON_MOCK = 'CONSUME_API/ON_MOCK'

export const fragmentsChanged = (fragments: List<Fragment>) => ({
  type: FRAGMENTS_CHANGED,
  payload: fragments
})

export const openModal = () => ({
  type: OPEN_MODAL
})

export const clear = () => ({
  type: CLEAR
})

export const updateQuery = (query: string) => ({
  type: UPDATE_QUERY,
  payload: query
})

export const isSearching = (isSearching: boolean) => ({
  type: IS_SEARCHING,
  payload: isSearching
})

export const isSubmitting = (isSubmitting: boolean) => ({
  type: IS_SUBMITTING,
  payload: isSubmitting
})

export const showError = (errorMsg: string) => ({
  type: ERROR,
  payload: errorMsg
})

export const onMock = (isMock: boolean) => ({
  type: ON_MOCK,
  payload: isMock
})

export const submit = (fragments: List<Fragment>) => {
  return (dispatch: Dispatch) => {
    dispatch(isSubmitting(true)) // in progress

    const selected = fragments.filter(fragment => fragment.selected)
    // asyn request
    setTimeout(() => {
      dispatch(isSubmitting(false))
      if (Math.random() > .5) {
        console.log('Successfully added dependencies', selected)
        dispatch(clear()) // close dialog
      } else {
        console.log('Error when added dependencies', selected)
        dispatch(showError('Error when trying to submit')) // show error in dialog
      }
    }, 2000)
  }
}

export const handleFragmentSelection = (index: number, fragment: Fragment, selected: boolean) => {
  return (dispatch: Dispatch, getState) => {
    const {fragments} : List<Fragment> = getState().consumeApi
    dispatch(fragmentsChanged(fragments.set(index, {...fragment, selected})))
  }
}

export const searchFragments = (query: string) => {
  return (dispatch: Dispatch, getState: GetState, {designerRemoteApiSelectors}: ExtraArgs) => {
    dispatch(isSearching(true))
    const consumeRemoteApi = new ConsumeRemoteApi(designerRemoteApiSelectors(getState))
    const mockedExample: List<Fragment> = List.of(
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Employee API Spec",
        description: "An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 3,
        numberOfRates: 1,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [
          {
            groupId: "com.mulesoft",
            assetId: "employee-datatype",
            version: "1.0.0"
          },
          {
            groupId: "com.mulesoft",
            assetId: "security-trait",
            version: "1.0.0"
          }
        ],
      },
      {
        organizationId: "asd03-21sad-1a53s",
        groupId: "com.mulesoft",
        assetId: "boss-api",
        version: "2.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Boss API Spec",
        description: "An API Spec to work with Bosses",
        runtimeVersion: "1.3.2",
        rating: 5,
        numberOfRates: 7,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [
          {
            groupId: "com.mulesoft",
            assetId: "employee-datatype",
            version: "1.0.0"
          },
          {
            groupId: "com.mulesoft",
            assetId: "security-trait",
            version: "1.0.0"
          }
        ],
      },
      {
        organizationId: "asd43-21kad-7a23s",
        groupId: "com.mulesoft",
        assetId: "pet-api",
        version: "8.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Pet API Spec",
        description: "An API Spec to work with Pets",
        runtimeVersion: "1.3.2",
        rating: 2,
        numberOfRates: 9,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [
          {
            groupId: "com.mulesoft",
            assetId: "employee-datatype",
            version: "1.0.0"
          },
          {
            groupId: "com.mulesoft",
            assetId: "security-trait",
            version: "1.0.0"
          }
        ],
      },
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Super Employee API Spec",
        description: "An API Spec to work with Employees An API Spec to work with Employees " +
        "An API Spec to work with Employees An API Spec to work with Employees An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 0,
        numberOfRates: 0,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [
          {
            groupId: "com.mulesoft",
            assetId: "employee-datatype",
            version: "1.0.0"
          },
          {
            groupId: "com.mulesoft",
            assetId: "security-trait",
            version: "1.0.0"
          }
        ],
      },
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Employee API Spec",
        description: "An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 3,
        numberOfRates: 1,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [],
      },
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Employee API Spec",
        description: "An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 3,
        numberOfRates: 1,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [],
      },
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Employee API Spec",
        description: "An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 3,
        numberOfRates: 1,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [],
      },
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Employee API Spec",
        description: "An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 3,
        numberOfRates: 1,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [],
      },
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Employee API Spec",
        description: "An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 3,
        numberOfRates: 1,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [],
      },
      {
        organizationId: "asd23-21sad-1a23s",
        groupId: "com.mulesoft",
        assetId: "employee-api",
        version: "1.0.0",
        related: [],
        packaging: "",
        classifier: "",
        name: "Employee API Spec",
        description: "An API Spec to work with Employees",
        runtimeVersion: "1.3.2",
        rating: 3,
        numberOfRates: 1,
        createdAt: 34567654332,
        updatedAt: 1233226567543,
        type: "raml",
        selected: false,
        dependencies: [],
      }
    )
    if (getState().consumeApi.isMock) {
      setTimeout(() => {
        dispatch(isSearching(false))
        dispatch(fragmentsChanged(mockedExample))
      }, 2000)
    } else {
      consumeRemoteApi.queryFragments(query).then((fragments) => {
        console.log(fragments)
        dispatch(isSearching(false))
        dispatch(fragmentsChanged(mockedExample))
      }).catch((error) => {
        dispatch(isSearching(false))
        dispatch(showError(error.toString()))
      })
    }
  }
}

