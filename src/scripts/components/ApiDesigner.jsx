"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Row_1 = require('@mulesoft/anypoint-components/lib/Row');
var TreeViewContainer_1 = require('../containers/TreeViewContainer');
var TopMenuContainer_1 = require('../containers/TopMenuContainer');
var AceEditor_1 = require("./AceEditor");
var ApiDesigner = (function (_super) {
    __extends(ApiDesigner, _super);
    function ApiDesigner(props) {
        var _this = this;
        _super.call(this, props);
        // Just for testing
        var globalMap = window;
        globalMap['globalSetText'] = function (text) {
            _this.editorRef().value = text;
        };
        globalMap['globalGetText'] = function () {
            return _this.editorRef().value;
        };
    }
    ApiDesigner.prototype.editorRef = function () {
        return this.refs['editor'];
    };
    ApiDesigner.prototype.onChange = function (value) {
        console.log(this.editorRef().value);
        console.log(value);
    };
    ApiDesigner.prototype.componentDidMount = function () {
        this.editorRef().value =
            "#%RAML 1.0\ntitle: My Api\nbaseUri: http://someapi.com/api/";
    };
    ApiDesigner.prototype.render = function () {
        return (<div>
                <Row_1.default>
                    <TopMenuContainer_1.default />
                </Row_1.default>
                <Row_1.default>
                    <div>
                        <TreeViewContainer_1.default />
                    </div>
                    <div>
                        <AceEditor_1.default ref="editor" onChange={this.onChange.bind(this)} mode="yaml"/>
                    </div>
                </Row_1.default>
            </div>);
    };
    return ApiDesigner;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApiDesigner;
