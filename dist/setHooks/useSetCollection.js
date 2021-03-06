"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var setFunctions_1 = require("../setFunctions");
var typeCheck = __importStar(require("../typeCheck"));
var typeCheck_1 = require("../typeCheck");
function useSetCollectionBase(path, queries, setFunction, options) {
    // Argument typeCheck
    typeCheck.assertSetCollectionFql(queries);
    typeCheck_1.matches([
        { key: "path", fn: typeCheck.isString },
        {
            key: "options",
            optional: true,
            fn: typeCheck_1.matches(typeCheck.concatRule(typeCheck.mergeRule, typeCheck.callbackRule, typeCheck.saveToStateRule)),
        },
    ])({ path: path, options: options }, "Argument");
    var _a = react_1.useState(false), writing = _a[0], setWriting = _a[1];
    var _b = react_1.useState(false), called = _b[0], setCalled = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    // ObjectでQueryを指定していた場合Functionに変換する
    var queryGenerators = queries.map(function (query) { return (query instanceof Function ? query : function () { return query; }); });
    var writeFn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var queryObject = queryGenerators.map(function (queryGenerator) { return queryGenerator.apply(void 0, args); });
        typeCheck_1.assertStaticSetFql(queryObject);
        setWriting(true);
        setCalled(true);
        setFunction(path, queryObject, function () {
            var _a;
            setError(null);
            setWriting(false);
            if (((_a = options) === null || _a === void 0 ? void 0 : _a.callback) !== undefined)
                options.callback();
        }, function (err) {
            setError(err);
            setWriting(false);
        }, options);
    };
    return [writeFn, writing, called, error];
}
function useSetCollection(collectionPath, query, options) {
    return useSetCollectionBase(collectionPath, query, setFunctions_1.setCollection, options);
}
exports.useSetCollection = useSetCollection;
