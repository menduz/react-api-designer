"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ActionBar_1 = require('@mulesoft/anypoint-components/lib/ActionBar');
var TopMenu = (function (_super) {
    __extends(TopMenu, _super);
    function TopMenu(props) {
        _super.call(this, props);
    }
    TopMenu.prototype.render = function () {
        var actions = [
            {
                icon: 'plus',
                label: 'Add File',
                onClick: this.props.onAddFile,
                testId: 'add-file',
            },
            {
                icon: 'plus',
                label: 'Add Directory',
                onClick: this.props.onAddDirectory,
                testId: 'add-directory',
            },
            {
                icon: 'save',
                label: 'Save',
                onClick: this.props.onSaveFile,
                testId: 'save-file',
            }
        ];
        return (<ActionBar_1.default actions={actions}/>);
    };
    return TopMenu;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopMenu;
