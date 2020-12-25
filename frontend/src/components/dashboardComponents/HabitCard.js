import React from 'react';
import { 
  Card, 
  Progress 
} from 'antd';

const progress = {
  display: 'flex',
  flexDirection: 'col',
  justifyContent: 'space-between'
}

const circle = (day) => {
  console.log(':::::::',  day)
  return day
}

export default function HabitCard({habitData}) {
  const [dayStatus, setStatus] = React.useState(false);
  console.log(habitData)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return (
      <div className="site-card-border-less-wrapper">
        <Card title={habitData.name} bordered={true} style={{ width: 500 }}>
          <div style={progress}>
            {
              days.map(day => (
                <div onClick={()=>setStatus(true)} >
                  <Progress type="circle" percent={100} width={50} format={circle} />
                  <p>{day}</p>
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
