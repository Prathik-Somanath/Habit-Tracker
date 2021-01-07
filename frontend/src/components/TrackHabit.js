import React from 'react';
import { 
    Spin,
    Modal,
    Button
 } from 'antd';
import { store } from '../store';
import HomeHeader from './dashboardComponents/Header';
import HabitCard from './dashboardComponents/HabitCard';
import NewHabit from './dashboardComponents/NewHabit';
import { useQuery, gql } from '@apollo/client';
import { PlusCircleOutlined } from '@ant-design/icons';

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
        history{
            id
            date
            val
          }
      }
    }
  }
`

export default function TrackHabit () {

    const [visible, setVisible] = React.useState(false);
    const sessionStore = sessionStorage.getItem('HabitTrackerUser');
    const { loading, error, data } = useQuery( getUser, { variables: {email:sessionStore} } );

    // console.log('data : ', data)
    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

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
        <>
            <HomeHeader />
            <div className="site-layout-background" style={{ padding: 34, textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    user.habits.map((data, index) => {

                        return <HabitCard habitData={data} key={index}/>
                    })
                }
            </div>
            <PlusCircleOutlined 
                style={{ fontSize: '50px', color: '#08c', position:'absolute', bottom:'50px', right:'50px' }}
                onClick={showModal}
            />
            <Modal
                title="Add new Habit"
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button form="new_habit" key="submit" htmlType="submit">
                        Submit
                    </Button>
                ]}
            >
                <NewHabit setVisible={setVisible}/>
            </Modal>
        </>
        )
    }
}