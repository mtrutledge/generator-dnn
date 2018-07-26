import * as React from "react";
import PersonaBarPageHeader from "dnn-persona-bar-page-header";
import PersonaBarPage from "dnn-persona-bar-page";
import Hello from './Hello.tsx';
import TimerApp from './TimerApp.tsx';

interface AppProps {
  title?: string;
}

class App extends React.Component<AppProps, {}> {
    public static defaultProps: Partial<AppProps> = {
        title: "<%= moduleName %>"
    };

    render() {
        return (
            <div>
                <PersonaBarPage isOpen="true">
                    <PersonaBarPageHeader title="{this.props.title}">
                    </PersonaBarPageHeader>
					<Hello name="I am a react persona bar module!" />
                    <TimerApp />
                </PersonaBarPage>
            </div>
        );
    }
}

export default App;