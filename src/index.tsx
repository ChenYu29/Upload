/**
 * @description: 路由
 * @author: cnn
 * @createTime: 2020/7/16 15:42
 **/
import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UploadDemoTest from './views/uploadDemo/UploadDemoTest';
import Home from '@views/home/Home';
import MinioUploadDemo from '@views/minioUpload/MinioUploadDemo';
import ResizeTable from '@views/table/ResizeTable';
import MinioPartUploadDemo from '@views/minioUpload/MinioPartUploadDemo';

export const platform = '/';
export const serverPath = '/api/'
export const menuList = [
  { path: platform, name: '普通上传Demo', component: UploadDemoTest },
  { path: platform + 'minio', name: '上传到Minio', component: MinioUploadDemo },
  { path: platform + 'minioPart', name: '分片上传到Minio', component: MinioPartUploadDemo },
  { path: platform + 'resizeTable', name: '可伸缩列表格', component: ResizeTable },
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
