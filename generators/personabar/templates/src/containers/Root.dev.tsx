import * as React from "react";
import App from "../components/App";
import DevTools from "./DevTools";

class Root extends React.Component<any, any> {
    render() {
        return (
            <div>
                <App />
                <DevTools />
            </div>
        );
    }
}

export default Root;