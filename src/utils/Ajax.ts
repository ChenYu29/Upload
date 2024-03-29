/**
 * @description Ajax 封装方法
 * @author cnn
 * **/
import { message, Modal } from 'antd';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import { platform, serverPath } from '../index';

interface AxiosRequestConfigMore extends AxiosRequestConfig {
  // 判断是否是文件上传
  dataType?: 'form' | 'formWithFile' | 'json'
}

/**
 * post 传参
 * **/
const post = (url: string, data: any, config: AxiosRequestConfigMore = {}, thenCallBack: Function) => {
  let params = data;
  if (config.dataType === 'form') {
    config.headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    params = qs.stringify(data);
  } else if (config.dataType === 'formWithFile') {
    config.headers = {
      'Content-type': 'multipart/form-data'
    };
  }
  return Axios.post(serverPath + url, params, config).then((response: AxiosResponse) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          message.error(responseData.msg);
          thenCallBack(responseData);
        } else if (responseData.flag === 4004) {
          Modal.error({
            title: '温馨提示',
            content: '没有登录信息或登录信息过期，请重新登录。'
          });
          window.setTimeout(() => {
            window.location.href = platform;
          }, 1000);
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else if (response.status === 404) {
      message.error('服务未找到', 5);
    } else if (response.status === 500) {
      message.error('服务异常', 5);
    } else {
      message.error('未知异常', 5);
    }
  }).catch((e) => {
    // 如果未授权
    if (e.response && e.response.status === 403 && e.response.data && e.response.data.flag === 1) {
      thenCallBack(e.response.data);
    } else {
      message.error(e, 3);
    }
  });
};


/**
 * get 传参
 * **/
const get = (url: string, params: any, config: AxiosRequestConfig = {}, thenCallBack: Function) => {
  config.params = params;
  // get 参数放在 config.params 里
  return Axios.get(serverPath + url, config).then((response: AxiosResponse) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          message.error(responseData.msg);
          thenCallBack(responseData);
        } else if (responseData.flag === 4004) {
          Modal.error({
            title: '温馨提示',
            content: '没有登录信息或登录信息过期，请重新登录。'
          });
          window.setTimeout(() => {
            window.location.href = platform;
          }, 1000);
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else if (response.status === 404) {
      message.error('服务未找到', 5);
    } else if (response.status === 500) {
      message.error('服务异常', 5);
    } else {
      message.error('未知异常', 5);
    }
  }).catch((e) => {
    // 如果未授权
    if (e.response && e.response.status === 403 && e.response.data && e.response.data.flag === 1) {
      thenCallBack(e.response.data);
    } else {
      message.error(e, 3);
    }
  });
};
/**
 * Put 上传文件
 **/
const put = (url: string, data: any, config: AxiosRequestConfig, thenCallBack: any) => {
  return Axios.put(url, data, config).then((response: any) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          message.error(responseData.msg);
          thenCallBack(responseData);
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else {
      thenCallBack(response);
    }
  }).catch((e) => {
    thenCallBack({
      status: 500
    });
  });
};

export { post, get, put };
