import * as React from "react";
import * as ReactDOM from "react-dom";
import Hello from "./components/Hello";

ReactDOM.render(
	<div className="row">
		<div className="col-xs-12">
			<Hello name="I am a TypeScript react module" />
		</div>
	</div>,
  document.getElementById("<%= namespace.toLowerCase() %><%= moduleName %>")
);