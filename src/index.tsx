/**
 * @description: 路由
 * @author: cnn
 * @createTime: 2020/7/16 15:42
 **/
import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UploadDemoTest from './views/uploadDemo/UploadDemoTest';
import Home from '@views/home/Home';

export const platform = '/';
export const serverPath = '/api/'
export const menuList = [
  { path: platform, name: '上传Demo', component: UploadDemoTest },
];
const App = () => {
  return (
    <Router>
      <Switch>
        <Home>
          <Switch>
            {menuList.map((item: any, index: number) => (
              <Route key={index} exact path={item.path} render={(props: any) => <item.component {...props} />} />
            ))}
          </Switch>
        </Home>
      </Switch>
    </Router>
  );
};
export default App;
