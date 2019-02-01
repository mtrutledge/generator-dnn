import React, {Component} from "react";
import {PersonaBarPageHeader, PersonaBarPage, PersonaBarPageBody } from "@dnnsoftware/dnn-react-common";

class App extends Component {
    render() {
        return (
            <div>
                <PersonaBarPage isOpen="true">
                    <PersonaBarPageHeader title="Hello World">
                    </PersonaBarPageHeader>
                    <PersonaBarPageBody>
                        <div>
                            <h1>Page Body</h1>
                        </div>
                    </PersonaBarPageBody>
                </PersonaBarPage>
            </div>
        );
    }
}

export default App;