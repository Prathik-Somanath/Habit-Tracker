import React from 'react';
import { 
    Layout, 
    Menu,
    Spin
 } from 'antd';
import {
  BarChartOutlined,
  UserOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import { BrowserRouter as Router,
    Link,
    Route,
} from 'react-router-dom';
import TrackHabit from './TrackHabit';
import AllHabits from './AllHabits';
import Progress from './Progress';

const { Header, Content, Footer, Sider } = Layout;

const headerStyle = {
    fontFamily: '"Krona One", Sans-serif',
    fontSize: '14pt',
    color: '#fff',
    textAlign: 'center'
};

const loadingStyle = {
    textAlign: 'center',
    flex: 1,
    borderRadius: '4px',
    padding: '30px 50px',
    margin: '20px 0',
    marginTop: '50vh'
}

const getUser = gql `
    query getUser($email: String!){
    users(where: {email: {_eq: $email}}) {
      full_name
    }
  }
`

export default function Home () {

    const sessionStore = sessionStorage.getItem('HabitTrackerUser');
    console.log(sessionStore)
    
    const { loading, error, data } = useQuery( getUser, { variables: {email:sessionStore} } );

    console.log('data : ', data)

    if (loading) {
        return (
            <div style={loadingStyle} >
                <Spin/>
            </div>
        )
    }

    if (error) {
        console.log(error);
        return (
            <div style={loadingStyle}>
                <h4> Something went wrong! </h4>
            </div>
        )
    }

    {   const user = data.users[0];
        return (
        <Router>
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
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Header className="site-layout-background" style={{ padding: 0 }} >
                    <h1 style={headerStyle}>Habit Tracker</h1>
                </Header>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    {user.full_name}
                    <Link to="/habits" />
                </Menu.Item>
                <Menu.Item key="2" icon={<FormOutlined />}>
                    All Habits
                    <Link to="/all" />
                </Menu.Item>
                <Menu.Item key="3" icon={<BarChartOutlined />}>
                    Progress
                    <Link to="/progress" />
                </Menu.Item>
            </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial', flex:1, height: '100vh' }}>
                <Route exact path="/habits" component={TrackHabit} />
                <Route exact path="/all" component={AllHabits} />
                <Route exact path="/progress" component={Progress} />
            </Content>
            </Layout>
        </Layout>
        </Router>
        )
    }
}