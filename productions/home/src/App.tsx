import { Component } from 'solid-js';
import {  Route, Router } from '@solidjs/router';

import  './App.css';

import routesJson from '../routes.json';
import Adapter from './demo-adapter/adapter';

const DemoList = () => (
  <div class={'demo-nav'}>
    {routesJson.routes.map(item => (
      <span class={'demo-nav-item'}>
        <a href={`/demo${item.path}/${item.port}`}>{item.name}</a>
      </span>
    ))}
  </div>
);

const App: Component = () => (
  <div class='App'>
    <Router>
        <Route path="/" component={DemoList} />
        <Route path={'/demo/:name/:port'} component={Adapter} />
    </Router>
  </div>
);

export default App;
