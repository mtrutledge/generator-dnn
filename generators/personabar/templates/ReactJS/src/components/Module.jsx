import React, {Component} from "react";
import {PersonaBarPageHeader, PersonaBarPage} from "@dnnsoftware/dnn-react-common";

class App extends Component {
    render() {
        return (
            <div>
                <PersonaBarPage isOpen="true">
                    <PersonaBarPageHeader title="Hello World">
                    </PersonaBarPageHeader>
                </PersonaBarPage>
            </div>
        );
    }
}

export default App;