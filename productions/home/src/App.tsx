import { Component } from 'solid-js';
import { Routes, Route, Router, Link } from 'solid-app-router';

import styles from './App.module.css';

import routesJson from '../routes.json';
import Adapter from './demo-adapter/adapter';

interface RouteModel {
  name: string;
  path: string;
  port: number;
}

const DemoList = ({ routes }: { routes: RouteModel[] }) => (
  <div class={styles['demo-nav']}>
    {routes.map(item => {
      return (
        <span class={styles['demo-nav-item']}>
          <Link href={`/demo${item.path}/${item.port}`}>{item.name}</Link>
        </span>
      );
    })}
  </div>
);

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Router>
        <Routes>
          <Route path="/" element={<DemoList routes={routesJson.routes} />} />
          <Route path={`/demo/:name/:port`} element={<Adapter />} />
          <Route path="*" element={<section>404</section>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
