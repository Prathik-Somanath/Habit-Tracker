import React from 'react';
import { 
    Spin,
    Select
} from 'antd';
import { useQuery, gql } from '@apollo/client';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';
import { subMonths } from 'date-fns'

const { Option } = Select;
const loadingStyle = {
    textAlign: 'center',
    flex: 1,
    borderRadius: '4px',
    padding: '30px 50px',
    margin: '20px 0',
    marginTop: '50vh'
}

const GET_HABIT_DATE = gql `
    query GetHabitDate($id: uuid!) {
        habits(where: {id: {_eq: $id}}){
        history{
            date
        }
        }
    }  
`
const GET_ALL_HABITS_DATE = gql`
    query GetAllHabitDate($user: String!) {
        habits(where: {user: {_eq: $user}}, order_by:{create_at:desc}){
        id
        name
        start_date
        end_date
        history{
            date
            val
        }
        }
    }
`;

export default function AllHabits () {

    //using global store with context

    const userID = sessionStorage.getItem('HabitTrackerUser');
    console.log(userID)
    
    // const { loading, error, data } = useQuery( GET_HABIT_DATE, { variables: {id:"4c74e9cc-5dff-4f68-94e2-ad296a1d4d93"} } );
    const { loading, error, data } = useQuery( GET_ALL_HABITS_DATE, { variables: {user:userID} } );
    const [showHabit, setShowHabit] = React.useState([]);
    const [DateRange, setDateRange] = React.useState({
        startDate: subMonths(new Date(), 12),
        endDate: new Date()
    })
    
    // console.log('data : ', data.habits[0].history)
    const handleChange = (val) => {
        console.log('changed', val);
        const hab = data.habits.filter((habit) => habit.id === val)
        // setDateRange({
        //     startDate: hab[0].start_date,
        //     endDate: hab[0].end_date
        // })
        const formattedHab = hab[0].history.map(data => ({ 
            date: data.date,
            count: data.val
        }));
        console.log("asdasdasd", formattedHab)
        setShowHabit(formattedHab);
    }

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

    {   
        // const testing = data.habits.map(

        // )
        // let formatedDate = data.habits[0].history.map(data => ({ 
        // date: data.date,
        // count: data.val
        // }));
        // console.log('formated data:::::::::::;',formatedDate);
        return (
        <>
            <h2 style={{marginLeft:25}}>All Habits</h2>
            <Select 
                defaultValue={'select habit'} 
                style={{width:130, margin:20, marginBottom:40, marginTop:25}} 
                onChange={handleChange}
            >
                {
                    data.habits.map((habit) => 
                        <Option value={habit.id}> {habit.name} </Option>
                    )
                }
            </Select>
            <div style={{height:'70%', width:'70%'}}>
            <CalendarHeatmap
                startDate={DateRange.startDate}
                endDate={DateRange.endDate}
                values={showHabit}
                showWeekdayLabels={true}
                onClick={(val)=>val && alert(val.count)}
                tooltipDataAttrs={ (value) => {
                    value.date && console.log(value)
                    return {
                      'data-tip': (value.date) ? `date: ${value.date} and count is ${value.count}` : "empty",
                    };
                  }}
                  classForValue={value => {
                    if (!value) {
                      return 'color-empty';
                    }
                    return `color-github-${value.count}`;
                  }}
            />
            <ReactTooltip />
            </div>
        </>
        )
    }
}