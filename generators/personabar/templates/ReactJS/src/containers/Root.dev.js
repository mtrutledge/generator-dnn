import React, {Component} from "react";
import Module from "../components/Module";
import DevTools from "./DevTools";

class Root extends Component {
    render() {
        return (
            <div>
                <Module />
                <DevTools />
            </div>
        );
    }
}

export default Root;