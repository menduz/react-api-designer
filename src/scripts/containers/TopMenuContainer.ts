import {connect, Dispatch} from 'react-redux'
import TopMenu from "../components/TopMenu";

import {Actions, saveFile} from "../actions/index";
import {addFile, addDirectory} from "../actions/repository";
import {AppState} from "../reducers/index";

function mapStateToProps(state: AppState) {
    return { }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
    return {
        onAddFile: () => { dispatch(addFile()) },
        onAddDirectory: () => { dispatch(addDirectory())},
        onSaveFile: () => { dispatch(saveFile())}
    }
}

const TopMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);

export default TopMenuContainer