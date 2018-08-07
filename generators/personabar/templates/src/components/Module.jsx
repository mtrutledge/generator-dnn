import React, {Component} from "react";
import PersonaBarPageHeader from "dnn-persona-bar-page-header";
import PersonaBarPage from "dnn-persona-bar-page";

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