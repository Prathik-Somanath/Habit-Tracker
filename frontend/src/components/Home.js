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
  LogoutOutlined,
} from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import { BrowserRouter as Router,
    Link,
    Route,
    Switch,
    useHistory,
    useLocation
} from 'react-router-dom';
import TrackHabit from './TrackHabit';
import Progress from './Progress';
import HabitHistory from './HabitHistory';

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
    const history = useHistory();
    const location = useLocation();
    const path = location.pathname.split('/');
    const defaultKey = (path.length > 1)?path[path.length-1]:"1"; 
    const { loading, error, data } = useQuery( getUser, { variables: {email:sessionStore} } );


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
        <Layout style={{height:"100vh"}}>
            <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
            }}
            >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultKey]}>
                <Header className="site-layout-background" style={{ padding: 0 }} >
                    <h1 style={headerStyle}>Habit Tracker</h1>
                </Header>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    {user.full_name}
                    <Link to="/" />
                </Menu.Item>
                <Menu.Item key="all" icon={<BarChartOutlined />}>
                    Progress
                    <Link to="/all" />
                </Menu.Item>
                <Menu.Item key="HabitHistory" icon={<FormOutlined />}>
                    History
                    <Link to="/HabitHistory" />
                </Menu.Item>
                <Menu.Item key="4" icon={<LogoutOutlined />} onClick={()=>{
                    sessionStorage.clear();
                    history.push();
                }}>
                    Logout
                </Menu.Item>
            </Menu>
            </Sider>
            <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial', flex:1, height: '100vh' }}>
                <Switch>
                    <Route exact path="/" component={TrackHabit} />
                    <Route exact path="/all" component={Progress} />
                    <Route exact path="/HabitHistory" component={HabitHistory} />
                </Switch>
            </Content>
            </Layout>
        </Layout>
        </Router>
        )
    }
}