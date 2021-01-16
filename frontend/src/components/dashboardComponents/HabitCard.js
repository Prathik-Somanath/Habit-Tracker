import React from 'react';
import { 
  Card, 
  Progress 
} from 'antd';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { format, getDay, sub, isEqual, isBefore } from 'date-fns'

const progress = {
  display: 'flex',
  flexDirection: 'col',
  justifyContent: 'space-between'
}

const valEdit = (val,unit,reps) =>{
  switch(unit){
    case 'CHECK':  val = (val===1? 100 : 0);
                   break;
    default: val = (val/reps)*100;                      
  }
  return val;
};

export default function HabitCard({habitData, setEditData, showModal}) {
  console.log(habitData);
  const days = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const card_data = [];
  let day_pointer = new Date();
  habitData.history.forEach(ele => {
    let info = {
      day_index: getDay(day_pointer),
    };
    if(isEqual(day_pointer,new Date(ele.date))){
      info.val = valEdit(ele.val,habitData.unit,habitData.reps);
      card_data.push(info);
      day_pointer = sub(day_pointer,{days:1});
    }
  });
  for(let i=card_data.length;i<days.length;i++ ){
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
    else
      return `${(val/100)*habitData.reps} min`
  }  
    
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
          style={{ width: 500 }}>
          <div style={progress}>
            {
              card_data.map((info,index)=>(
                <div key={index} >
                  {
                    info.val===0 || info.val===100 ? (
                      <Progress type="circle" percent={info.val} width={50} status={info.val === 0 ? 'exception':'normal'} key={index} />
                    ):( info.val === -1 ? (
                      <Progress trailColor="#808080" type="circle" percent={0} width={50} format={()=>"-"} key={index} />
                    ):(
                      <Progress type="circle" percent={info.val} width={50} format={circle} key={index} />
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
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    )
}
