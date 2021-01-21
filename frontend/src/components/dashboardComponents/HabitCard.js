import React from 'react';
import { 
  Card, 
  Progress 
} from 'antd';
import { getDay, sub, isBefore, differenceInCalendarDays } from 'date-fns';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { FINISH_HABIT, GET_USER_DETAILS } from '../../query';
import { format } from 'date-fns'

const progress = {
  display: 'flex',
  flexDirection: 'col',
  justifyContent: 'space-between'
}

const valEdit = (val,unit,reps,dur) =>{
  switch(unit){
    case 'CHECK':  val = (val===1? 100 : 0);
                   break;
    case 'REPS': val = (val/reps)*100;    
                  break;
    default: val = (val/dur)*100;
                  break;             
  }
  return val;
};

export default function HabitCard({habitData, setEditData, showModal}) {
  // console.log('Habitdata::::::',habitData);
  const userID = sessionStorage.getItem('HabitTrackerUser');
  const [ finishHabit ] = useMutation(FINISH_HABIT);
  const days = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const card_data = [];
  let day_pointer = new Date();
  const day_limit = sub(day_pointer,{days:7});
  habitData.history.forEach(ele => {
    let info = {};
    const record = new Date(ele.date);
    if(!isBefore(record,day_limit)){
      for(let i=0;i<differenceInCalendarDays(day_pointer,record);i++){
        let dead_day = { val: 0 };
        dead_day.day_index = getDay(day_pointer);
        card_data.push(dead_day);
        day_pointer = sub(day_pointer,{days:1});
      }
      info.day_index = getDay(record);
      info.val = valEdit(ele.val,habitData.units,habitData.reps,habitData.reps);
      card_data.push(info);
      day_pointer = sub(day_pointer,{days:1});
    }
  });
  for(let i=card_data.length;i<days.length;i++){
    let info = {
      day_index: getDay(day_pointer),
    };
    if(isBefore(day_pointer,new Date(habitData.start_date)))
      info.val = -1;
    else
      info.val = 0; 
    card_data.push(info);
    day_pointer = sub(day_pointer,{days:1});   
  }

  const circle = (val) => {
    if(habitData.unit === 'REPS')
      return `${(val/100)*habitData.reps}/${habitData.reps}`
    else if(habitData.unit === 'DURATION')
      return `${(val/100)*habitData.reps}/${habitData.reps} min`
  }  

  const checkClicked = (val) => {
    console.log('clicked');
    finishHabit({
      variables: {
        id: habitData.id,
        user: userID,
        val: 1,
        date: format(new Date(), "yyyy-MM-dd")
      },
      refetchQueries: [{ query: GET_USER_DETAILS, variables: { email: userID } }]
    })
  }

  console.log('card data:',card_data, habitData);
    
    return (
      <div className="site-card-border-less-wrapper" style={{paddingRight:30, paddingBottom: 30}}>
        <Card 
          hoverable
          title={habitData.name} 
          extra={
            <ArrowsAltOutlined 
              onClick={ () => {
                setEditData(habitData);
                showModal();
              }} 
              style={{ fontSize: 25 }} 
            />
          } 
          bordered={true} 
          style={{ width: 500 }}
        >
          <p style={{ position:'relative', left:150, paddingBottom:10 }} > 
            {(habitData.unit!=='CHECK')
              ? (habitData.reps) 
                ? `Habit Goal: ${habitData.reps} reps/day` 
                : `Habit Goal: ${habitData.duration} mins/day` 
              : 'Habit Goal: Yes/No'
            } 
          </p>
          <div style={progress}>
            {
              card_data.map((info,index)=>(
                <div key={index} >
                  {
                    index === 0 && info.val === 0 ? (
                      <Progress type="circle" trailColor="#ffb95a" percent={0} width={50}  format={()=>"-"} key={index} onClick={()=> (habitData.unit==='CHECK') && checkClicked(info.val)} />
                    ):(
                      info.val===0 || info.val===100 ? (
                        <Progress type="circle" percent={info.val} width={50} status={info.val === 0 ? 'exception':'success'} key={index} />
                      ):( info.val === -1 ? (
                        <Progress trailColor="#808080" type="circle" percent={0} width={50} format={()=>"-"} key={index} />
                      ):(
                        <Progress type="circle" percent={info.val} width={50} format={circle} key={index} />
                      )
                      )
                    )
                  }
                  <p>{days[info.day_index]}</p>
                </div>
              ))
            }
            
            {/* <Progress type="circle" percent={70} width={80} status="exception" />
            <Progress type="circle" percent={100} width={80} /> */}
          </div>
          <p>Remainder note: {habitData.remainder_note}</p>
        </Card>
      </div>
    )
}
