import React from 'react';
import { Card, Input, Layout, Form, Button, Carousel, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { StyleSheet, css } from 'aphrodite';

const { Header, Content } = Layout;
const { Meta } = Card;

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
    color: '#fff',
    lineHeight: '25vh',
    textAlign: 'center',
    background: '#364d79',
    marginTop: '30vh',
  };

function HabitCarousel() {
    return (
        <Carousel autoplay>
            <div>
                <h3 style={contentStyle}>1</h3>
            </div>
            <div>
                <h3 style={contentStyle}>2</h3>
            </div>
            <div>
                <h3 style={contentStyle}>3</h3>
            </div>
            <div>
                <h3 style={contentStyle}>4</h3>
            </div>
        </Carousel>
    )
}

export default function Register() {

    const onFinish = values => {
        console.log('Success:', values);
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout className={css(styles.wrapper)} >
            <Header>
                <div className="logo" />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Row>
                    <Col span={3} />
                    <Col span={7} >
                        < HabitCarousel />      
                    </Col>
                    <Col span={14} >
                        <Card className={css(styles.card)}>
                        <Meta
                            title="Sign Up"
                            description="This is the description"
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
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                    // required tooltip="This is a required field"
                                >
                                    <Input size="large" placeholder="Enter Your User Name" />
                                </Form.Item>
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
                                    Create an Account
                                    </Button>
                                </Form.Item>
                                <p>
                                    Already have an Account? <a href="https://www.google.com/" >Log in</a>
                                </p>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}
