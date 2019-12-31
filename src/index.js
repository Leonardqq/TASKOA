import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
/* REDUX */
import { Provider } from 'react-redux';
import store from './store/index';

/* ANTD */
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';


ReactDOM.render(<Provider store={store}>
	<ConfigProvider locale={zhCN}>
		<App />
	</ConfigProvider>
</Provider>, document.getElementById('root'));