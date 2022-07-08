/**
 * @description: HomeHeader
 * @author: cnn
 * @createTime: 2020/7/21 9:39
 **/
import React from 'react';
import { Row, Col, Layout, Avatar, Space, Dropdown, Menu } from 'antd';
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons';
import './index.less';
import { useHistory } from 'react-router-dom';
import { menuList } from '../../index';

const { Header } = Layout;

const HomeHeader = () => {
  const history = useHistory();
  // 注销登录
  const logOut = () => {
    sessionStorage.clear();
  };
  // 点击菜单
  const menuClick = (current: any) => {
    history.push(current.key);
  };
  return (
    <>
      <Header className="headerfix">
        <Row justify="end">
          <Dropdown overlay={
            <Menu onClick={menuClick}>
              {menuList.map((item: any) => (
                <Menu.Item key={item.path}>
                  <a>{item.name}</a>
                </Menu.Item>
              ))}
            </Menu>
          }>
            <a>示例</a>
          </Dropdown>
          <Col style={{ display: 'flex' }}>
            <Space align="center" style={{ display: 'none' }}>
              <Space>
                <Avatar className="person-avatar" icon={<UserOutlined />} />
              </Space>
              <a onClick={logOut}>
                <PoweroffOutlined style={{ marginRight: 10 }} />
              </a>
            </Space>
          </Col>
        </Row>
      </Header>
    </>
  );
};
export default HomeHeader;
