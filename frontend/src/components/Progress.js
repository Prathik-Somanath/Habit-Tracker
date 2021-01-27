import React from 'react';
import { 
    Spin,
    Select,
    Row,
    Col
} from 'antd';
import { useQuery, gql } from '@apollo/client';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';
import { addDays, format, isBefore, subMonths } from 'date-fns'

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
        habits(where: {user: {_eq: $user}}, order_by:{created_at:desc}){
        id
        name
        start_date
        unit
        reps
        duration
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
    const [curHabit, setCurHabit] = React.useState(null);
    const [DateRange, setDateRange] = React.useState({
        startDate: subMonths(new Date(),6),
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
        const formattedHab = [];
        hab[0].history.forEach(element => {
           formattedHab.push({
               date: element.date,
               count: element.val
           }) 
        });
        for(let i=DateRange.startDate;isBefore(i,new Date(hab[0].start_date));i=addDays(i,1)){
            formattedHab.push({
                date: format(i,'yyyy-MM-dd'),
                count: -1
            });
        }
        console.log("asdasdasd", formattedHab)
        setShowHabit(formattedHab);
        console.log('curHab ->',hab[0]);
        setCurHabit(hab[0]);
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

       
        // const testing = data.habits.map(

        // )
        // let formatedDate = data.habits[0].history.map(data => ({ 
        // date: data.date,
        // count: data.val
        // }));
        // console.log('formated data:::::::::::;',formatedDate);
        return (
        <>
            <h2 style={{marginLeft:25,fontSize:'20pt'}}>Habit Progress Dashboard </h2>
            <Select 
                defaultValue={'select habit'} 
                style={{width:130, margin:20, marginBottom:40, marginTop:25}} 
                onChange={handleChange}
            >
                {
                    data.habits.map((habit) => {
                        if(isBefore(new Date(),new Date(habit.end_date))){
                            return (<Option value={habit.id}> {habit.name} </Option>);
                        }
                        return null;
                    }) 
                }
            </Select>
            <div style={{height:'30%', width:'70%'}}>
                <Row>
                    <Col span={24}>
                        <h2 style={{marginLeft:25,fontSize:'16pt'}}>Progress Heatmap</h2>
                        <CalendarHeatmap
                            startDate={DateRange.startDate}
                            endDate={DateRange.endDate}
                            values={showHabit}
                            showWeekdayLabels={true}
                            onClick={(val)=>val && alert(val.count)}
                            tooltipDataAttrs={ (value) => {
                                return {
                                  'data-tip': (value.date) ? `date: ${value.date} and reps is ${value.count}` : "incomplete",
                                };
                              }}
                              classForValue={value => {
                                if(!!curHabit){
                                   if(!!value){
                                    switch(curHabit.unit){
                                        case 'CHECK': if(value.count === 1)
                                                        return 'color-scale-success';
                                                      else
                                                        return 'color-scale-invalid';  
                                        default: console.log(value.count); 
                                                if(value.count ===((curHabit.unit==='REPS')?(curHabit.reps):(curHabit.duration)))
                                                    return 'color-scale-success';
                                                 else if (value.count > 0)
                                                    return 'color-scale-partial'; 
                                                 else
                                                    return 'color-scale-invalid';                             
                                    }
                                   }
                                   else{
                                       return 'color-scale-failure';
                                   }
                                }
                                else{
                                    return 'color-empty';
                                }
                              }}
                        />
                        <ReactTooltip />
                    </Col>
                </Row>
            </div>
        </>
        )
}