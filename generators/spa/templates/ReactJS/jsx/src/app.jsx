import React from "react";
import * as ReactDOM from "react-dom";
import Hello from "./components/Hello";
import resx from "localization";

ReactDOM.render(
	<div className="row">
		<div className="col-xs-12">
			<Hello name={resx.get("Hello")}  />
		</div>
	</div>,
  document.getElementById("<%= namespace.toLowerCase() %><%= moduleName %>")
);