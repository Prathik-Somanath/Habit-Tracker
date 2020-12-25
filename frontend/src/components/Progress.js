import React from 'react';
import { 
    Spin
 } from 'antd';
import { store } from '../store';
import { useQuery, gql } from '@apollo/client';

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
      }
    }
  }
`

export default function Progress () {

    //using global store with context
    const { state } = React.useContext(store); 
    console.log('STATE:',state.full_name);

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
        <h2>Progress</h2>
        )
    }
}