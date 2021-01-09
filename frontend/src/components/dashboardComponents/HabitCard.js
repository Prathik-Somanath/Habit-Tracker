import React from 'react';
import { 
  Card, 
  Progress 
} from 'antd';
import { format } from 'date-fns'

const progress = {
  display: 'flex',
  flexDirection: 'col',
  justifyContent: 'space-between'
}

const circle = (day) => {
  // console.log(':::::::',  day)
  return day
}

export default function HabitCard({habitData}) {
  habitData.history.forEach((data)=>{
    var date = data.date.split('-');
    // console.log('history:::::::::::::',format(new Date(date), "iii"))
  })
  const [dayStatus, setStatus] = React.useState(false);
  // console.log('habitData: ',habitData)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return (
      <div className="site-card-border-less-wrapper" style={{paddingRight:30, paddingBottom: 30}}>
        <Card title={habitData.name} bordered={true} style={{ width: 500 }}>
          <div style={progress}>
            {
              days.map((day, index) => (
                <div key={index} onClick={()=>setStatus(true)} >
                  <Progress type="circle" percent={100} width={50} format={circle} key={index} />
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
