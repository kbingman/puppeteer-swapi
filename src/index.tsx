import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';

const render = (app: typeof App) => {
  ReactDOM.render(<App />, document.getElementById('app'));
};

render(App);
