import React from 'react';
import { 
  Card, 
  Progress 
} from 'antd';
import { format, getDay } from 'date-fns'
import { ArrowsAltOutlined } from '@ant-design/icons';

const progress = {
  display: 'flex',
  flexDirection: 'col',
  justifyContent: 'space-between'
}

const circle = (day) => {
  // console.log(':::::::',  day)
  return day
}

export default function HabitCard({habitData, setEditData, showModal}) {

  habitData.history.forEach((data)=>{
    var date = data.date.split('-');
    // console.log('history:::::::::::::',format(new Date(date), "iii"))
  })
  const [dayStatus, setStatus] = React.useState(false);
  // console.log('habitData: ',habitData)
  const days = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const order = [];
  const today = new Date();
  let today_index = getDay(today);
  for(let i=0;i<days.length;i++){
     order.push(today_index);
     if(today_index === 0)
      today_index = 6;
     else
      today_index--; 
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
              order.map((day_index,index)=>(
                <div key={index} onClick={()=>setStatus(true)} >
                  <Progress type="circle" percent={100} width={50} format={circle} key={index} />
                  <p>{days[day_index]}</p>
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
