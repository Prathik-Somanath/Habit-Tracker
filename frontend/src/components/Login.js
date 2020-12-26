import React from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { Card, Input, Layout, Form, Button, Carousel, Row, Col, notification, resetFields } from 'antd';
import { useHistory } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { StyleSheet, css } from 'aphrodite';
import { store } from '../store';

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

//functional component for the image carousel on the login page.
const HabitCarousel = () => {
    return (
        <Carousel autoplay style={{marginTop: '20vh' }}>
            <img alt="stepping up" src="SVG/stepup.svg" style={contentStyle} />
            <img alt="goals" src="SVG/goals.svg" style={contentStyle} />
            <img alt="target" src="SVG/target.svg" style={contentStyle} />
        </Carousel>
    )
}

export default function Login() {

    //using global store with context
    const { dispatch } = React.useContext(store); 

    //react dom page history to update to home page
    const history = useHistory();

    //Used to Switch between Register and Login Forms.
    const [page, setPage] = React.useState(false);

    const [form] = Form.useForm();

    //variable used to refresh page after a data request.
    const [registerValue, setRegister] = React.useState(null);

    //function to open a custom notification with icon
    const openNotification = (type, title, desc) => {
        notification[type]({
            message: title,
            description: desc,
        });
    };

    //function to handle request errors
    const handleError = (error) => {
        if('networkError' in error){
            openNotification(
                'error',
                'Network Error',
                "Habit tacker can't reach the server. Please check your internet connection.", 
            );
        }
        else{
            error.graphqlErrors.map(({ message, locations, path }) => 
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              ),
            );
            openNotification(
              'error',
              'Server Error',
              "There was an unexpected server error. Please try again", 
          );
        }
    };

    //Mutation for creating a user
    const [createUser, userResult] = useMutation(
        gql`mutation user($email: String!,$name: String!,$pass: String!){
                insert_users(objects: {email: $email, full_name: $name, password: $pass}) {
                    affected_rows
                    returning {
                        createdAt
                    }
                }
            }`,{
                //function to continue registration process after mutation
                onCompleted(){
                    if(userResult.error){
                        handleError(userResult.error);
                    }
                    else{
                        openNotification(
                            'success',
                            'Account successfully created',
                            "Your Habit Tracker account has been created. You can now login.", 
                        );
                        setPage(()=>{
                            form.resetFields();
                            return false;
                        });
                    }
            },
        }  
    );

    //Lazy query for checking if user already exists
    const [checkUser,checkResult] = useLazyQuery(
        gql`query verify($email: String!){
                users(where:{email: {_eq: $email}}){
                    email
            }
        }`,{
            //funtion to continue registration process after user check query
            onCompleted(data){
                if(checkResult.error){
                    handleError(checkResult.error);
                 }
                 else{  
                   if(data.users.length !== 0){
                      openNotification(
                          'error',
                          'Account already exists',
                          "An account with this email already exists. Please use a different email or login with this email.", 
                      );
                   }
                   else if( registerValue === null){
                        openNotification(
                            'error',
                            'Internal Error',
                            "There was an error in the registration process. Please try again.", 
                        );
                   }
                   else{
                      //activating mutation to create new user 
                      createUser({
                          variables:{
                              email: registerValue.email,
                              name: registerValue.name,
                              pass: registerValue.password
                          }
                      });
                    }
                 }       
            }
        }
    );

    //Lazy query for user auth
    const [getUser, getUserResult] = useLazyQuery(
        gql`query getUser($email: String!, $pass: String!){
            users(where: {email: {_eq: $email}, _and: {password: {_eq: $pass}}}) {
              full_name
              createdAt
              email
              habits {
                bad_habit
                end_date
                habit_cycle
                name
                id
                remainder_note
                reminder_times
                start_date
                streak
                unit
              }
            }
          }`,{
            //funtion to continue login process after receiving data  
            onCompleted(data){
                if(getUserResult.error){
                    handleError(getUserResult.error);
                }
                else{
                    if(data.users.length !== 0){
                        const user = data.users[0]
                        sessionStorage.setItem('HabitTrackerUser',user.email);
                        dispatch(data.users[0]);
                        history.replace('/');
                    }
                    else{
                        openNotification(
                            'error',
                            'Invalid Credentials',
                            'Incorrect email or password provided. Please try again with correct credentials.'
                        );
                    }
                }
            },
          }
    );

    //function to handle login/registration form submission
    const onFinish = values => {
        console.log('Success:', values);
        if(page){
            setRegister(values);
            //query to check if given user already exists
            checkUser({
                variables:{
                    email: values.email,
                },
            });
        }
        else{
            //querying user based on user input
            getUser({
                variables:{
                    email: values.email,
                    pass: values.password,
                },
            });
        }
    };
    
    //function to handle login/registration form submission errors
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
                                form={form}
                                layout="vertical"
                                name="basic"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                requiredMark={false}
                            >
                                {
                                  page && (
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        initialValue=""
                                        rules={[{ required: true, message: 'Please input your Name!' }]}
                                        // required tooltip="This is a required field"
                                    >
                                        <Input size="large" placeholder="Enter Your Full Name" />
                                    </Form.Item>
                                  )
                                }
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    initialValue=""
                                    rules={[{ required: true, message: 'Please input your Email!' }]}
                                >
                                    <Input size="large" placeholder="Enter Your Email" />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    initialValue=""
                                    rules={[{ required: true, message: 'Please input your Password!' }]}
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
                                            Already have an Account? <span 
                                                                        style={{color:'blue',cursor:'pointer'}} 
                                                                        onClick={()=>
                                                                            setPage(()=>{
                                                                                    form.resetFields();
                                                                                    return false;
                                                                            }
                                                                        )}
                                                                     >
                                                                         Log in
                                                                    </span>
                                        </p>
                                    ):(
                                        <p>
                                            Don't have an Account? <span 
                                                                        style={{ color:'blue',cursor:'pointer' }} 
                                                                        onClick={()=>
                                                                            setPage(()=>{
                                                                                            form.resetFields();
                                                                                            return true;
                                                                            }
                                                                        )}>
                                                                            Register
                                                                        </span>
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
