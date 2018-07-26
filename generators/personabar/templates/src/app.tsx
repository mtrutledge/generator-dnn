import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import Root from "./containers/Root";

let store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
	document.getElementById("<%= moduleName %>-container")
);