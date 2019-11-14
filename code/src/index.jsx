import { render } from 'react-dom';
import { Layout } from 'antd';
import React from 'react';

import createHashHistory from 'history/createHashHistory';
import { Router, Route, Switch } from 'react-router-dom';
const { Header, Footer, Sider, Content } = Layout;

import Index from './frag/index';

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

// import 'babel-polyfill';

const history = createHashHistory();

render(
  <LocaleProvider locale={zh_CN}>
    <Router history={history}>
      <Layout className="h-100">
        <Switch>
          <Route path="/" component={null} />
        </Switch>
        <Layout>
          <Switch>
            <Route path='/' component={null} />
          </Switch>
          <Content>
            <Switch>
              <Route path='/' component={Index} />
              {/* <Route path='/SaveRes' component={Index} /> */}

            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  </LocaleProvider>,
  document.getElementById('root')
);
