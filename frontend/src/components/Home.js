import React from 'react';
import { Layout, Menu } from 'antd';
import {
  BarChartOutlined,
  UserOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { store } from '../store';
import HomeHeader from './dashboardComponents/Header';
import HabitCard from './dashboardComponents/HabitCard';

const { Header, Content, Footer, Sider } = Layout;

const headerStyle = {
    fontFamily: '"Krona One", Sans-serif',
    fontSize: '14pt',
    color: '#fff',
    textAlign: 'center'
};

export default function Home () {

    //using global store with context
    const { state, dispatch } = React.useContext(store); 
    console.log('STATE:',state.full_name);

    return (
        <Layout>
            <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
            }}
            >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Header className="site-layout-background" style={{ padding: 0 }} >
                    <h1 style={headerStyle}>Habit Tracker</h1>
                </Header>
                <Menu.Item key="1" icon={<UserOutlined />}>
                Omkar
                </Menu.Item>
                <Menu.Item key="2" icon={<FormOutlined />}>
                All Habits
                </Menu.Item>
                <Menu.Item key="3" icon={<BarChartOutlined />}>
                Progress
                </Menu.Item>
            </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial', flex:1 }}>
                <HomeHeader />
                <div className="site-layout-background" style={{ padding: 24, textAlign: 'center' }}>
                    <HabitCard />
                <br />
                Really
                <br />
                content
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    )
}