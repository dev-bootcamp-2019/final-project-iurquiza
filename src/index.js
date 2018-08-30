import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { Provider } from "react-redux";
import { syncHistoryWithStore } from "react-router-redux";
import { UserIsAuthenticated } from "./util/wrappers";
import registerServiceWorker from "./registerServiceWorker";

// Layouts
import App from "./App";
import Home from "./layouts/home/Home";
import Upload from "./layouts/upload/Upload";
import ImageList from "./user/layouts/imagelist/ImageList";

// Redux Store
import store from "./store";

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="upload" component={UserIsAuthenticated(Upload)} />
        <Route path="myimages" component={UserIsAuthenticated(ImageList)} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
