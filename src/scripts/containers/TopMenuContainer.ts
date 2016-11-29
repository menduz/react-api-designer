import {connect, Dispatch} from 'react-redux'
import TopMenu from "../components/TopMenu";

import {Actions, saveFile} from "../actions/index";
import {addFile} from "../actions/repository";
import {AppState} from "../reducers/index";

function mapStateToProps(state: AppState) {
    return { }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
    return {
        onAddFile: () => { dispatch(addFile()) },
        onAddDirectory: () => { dispatch({type: Actions.ADD_DIRECTORY, name: 'myNewDir'})},
        onSaveFile: () => { dispatch(saveFile())}
    }
}

const TopMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);

export default TopMenuContainer