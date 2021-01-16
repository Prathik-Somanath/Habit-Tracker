import React from 'react';
import { 
    Spin,
    Modal,
    Button
 } from 'antd';
import HomeHeader from './dashboardComponents/Header';
import HabitCard from './dashboardComponents/HabitCard';
import NewHabit from './dashboardComponents/NewHabit';
import { useQuery } from '@apollo/client';
import { PlusCircleOutlined } from '@ant-design/icons';
import { GET_USER_DETAILS } from '../query';

const loadingStyle = {
    textAlign: 'center',
    flex: 1,
    borderRadius: '4px',
    padding: '30px 50px',
    margin: '20px 0',
    marginTop: '50vh'
}

export default function TrackHabit () {

    const [visible, setVisible] = React.useState(false);
    const sessionStore = sessionStorage.getItem('HabitTrackerUser');
    const { loading, error, data } = useQuery( GET_USER_DETAILS, { variables: {email:sessionStore} } );
    const [editHabitDate, setEditData] = React.useState(null);
    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setEditData(null);
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

                        return <HabitCard habitData={data} key={index} setEditData={setEditData} showModal={showModal}/>
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
                <NewHabit setVisible={setVisible} userID={sessionStore} editHabitDate={editHabitDate}/>
            </Modal>
        </>
        )
    }
}