import React from 'react';
import { 
  Card, 
  Progress,
  Button,
  InputNumber
} from 'antd';
import { getDay, sub, isBefore, differenceInCalendarDays } from 'date-fns';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { FINISH_HABIT, GET_USER_DETAILS, EDIT_HISTORY } from '../../query';
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
  console.log('Habitdata::::::',habitData.history[0]);
  const userID = sessionStorage.getItem('HabitTrackerUser');
  const [ finishHabit ] = useMutation(FINISH_HABIT);
  const [ editHabit ] = useMutation(EDIT_HISTORY);
  const curDate = !!(habitData.history[0] && (habitData.history[0].date)===format(new Date(), "yyyy-MM-dd")); //boolean
  const goalCount = (habitData.reps) ? habitData.reps : habitData.duration;
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
      info.val = valEdit(ele.val,habitData.unit,habitData.reps,habitData.duration);
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
      return `${Math.ceil((val/100)*habitData.reps)}`;
    else if(habitData.unit === 'DURATION')
      return `${Math.ceil((val/100)*habitData.duration)}`;
    else
      return val;
  }  

  const checkClicked = () => {
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

  const increaseCount = (val) => {
    // console.log('clicked:', val, curDate)
    (curDate)
    ? 
      !!val && editHabit({
        variables: {
          id: habitData.history[0].id,
          val: val
        },
        refetchQueries: [{ query: GET_USER_DETAILS, variables: { email: userID } }]
      })
    :
      !!val && finishHabit({
        variables: {
          id: habitData.id,
          user: userID,
          val: val,
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
          title={<p style={{fontFamily:'Exo 2',fontWeight:400,fontSize:'20pt', margin:0}}>{habitData.name}</p>}
          headStyle={{fontSize:20, fontWeight:'bold'}}
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
          style={{ width:'30vw' }}
        >
          { (habitData.unit ==='CHECK')
            ?
              <Button 
                style={{position:'absolute', left:30}}
                onClick={()=>checkClicked()}
                disabled={curDate}
              > 
                {curDate ? "Completed" : "Done" }
              </Button>
            :
              <InputNumber 
                style={{position:'absolute', left:30}} 
                min={0}
                max={goalCount}
                disabled={curDate && (habitData.history[0].val===goalCount)}
                onChange={increaseCount}
                defaultValue={curDate ? habitData.history[0].val : null}
                formatter={value=> (value==goalCount) ?  `Completed`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value}
                // parser={value => value.replace('Completed', '')}
                // formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                placeholder={(habitData.unit==='REPS') ? "Reps" : "Mins"}
              />
          }
          <p style={{ position:'relative', left:'30%', paddingBottom:10 }} > 
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
                      <Progress type="circle" trailColor="#ffb95a" percent={0} width={50}  format={()=>"-"} key={index} onClick={()=> (habitData.unit==='CHECK') && checkClicked()} />
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
          <p style={{marginTop:15}}>NOTE: {habitData.remainder_note}</p>
        </Card>
      </div>
    )
}
