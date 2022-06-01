import React from 'react';
import ReactDOM from 'react-dom/client';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';

import App from './App';
import './index.css';
import 'antd/dist/antd.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

