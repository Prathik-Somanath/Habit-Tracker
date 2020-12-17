import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Card, Input, Layout, Form, Button, Carousel, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { StyleSheet, css } from 'aphrodite';

const { Header, Content } = Layout;
const { Meta } = Card;

// styles for the login page.
const styles = StyleSheet.create({
    wrapper: {
        height: '100vh'
    },
    card: {
        // height: '40vh',
        width: '60vh',
        float: 'right',
        marginTop: '15vh',
        marginRight: '10vh'
    },
    header: {
        marginBottom: '5vh'
    }
})

const contentStyle = {
    height: '25vh',
  };

const headerStyle = {
    fontFamily: '"Krona One", Sans-serif',
    fontSize: '24pt',
    color: '#fff',
};  

//dictionary of graphql queries
const queries = {
    //query to check if user already exists
    verifyDuplicate: gql``,
};

//functional component for the image carousel on the login page.
function HabitCarousel() {
    return (
        <Carousel autoplay style={{marginTop: '20vh' }}>
            <img alt="stepping up" src="SVG/stepup.svg" style={contentStyle} />
            <img alt="goals" src="SVG/goals.svg" style={contentStyle} />
            <img alt="target" src="SVG/target.svg" style={contentStyle} />
        </Carousel>
    )
}

export default function Login() {

    //Used to Switch between Register and Login Forms.
    const [page, setPage] = React.useState(false);

    //function for registering new user
    const onRegister = (values) => {

    };

    //funtion for logging in a user
    const onLogin = (values) =>{

    };

    const onFinish = values => {
        console.log('Success:', values);
        if(page){
            onRegister(values);
        }
        else{
            onLogin(values);
        }
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout className={css(styles.wrapper)} >
            <Header>
                <h1 style={headerStyle}>Habit Tracker</h1>
                <div className="logo" />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Row>
                    <Col span={4} />
                    <Col span={7} >
                        < HabitCarousel />      
                    </Col>
                    <Col span={13} >
                        <Card className={css(styles.card)}>
                        <Meta
                            title={page ? "Register":"Log In"}
                            className={css(styles.header)}
                        />
                            <Form
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                requiredMark={false}
                            >
                                {
                                  page && (
                                    <Form.Item
                                        label="Username"
                                        name="username"
                                        rules={[{ required: true, message: 'Please input your username!' }]}
                                        // required tooltip="This is a required field"
                                    >
                                        <Input size="large" placeholder="Enter Your User Name" />
                                    </Form.Item>
                                  )
                                }
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Please input your email!' }]}
                                >
                                    <Input size="large" placeholder="Enter Your Email" />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password
                                        size="large"
                                        placeholder="input password"
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>
                                <br/>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit">
                                        { page ? ('Create an Account'):('Log In') }
                                    </Button>
                                </Form.Item>
                                {
                                    page ? (
                                        <p>
                                            Already have an Account? <span style={{color:'blue',cursor:'pointer'}} onClick={()=>setPage(false)}>Log in</span>
                                        </p>
                                    ):(
                                        <p>
                                            Don't have an Account? <span style={{color:'blue',cursor:'pointer'}} onClick={()=>setPage(true)} >Register</span>
                                        </p>
                                    )
                                }
                            </Form>    
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}
