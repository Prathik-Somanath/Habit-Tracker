import React from 'react'
import { format } from 'date-fns'
import { Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const headerContainer = {
    display:'flex',
    flexDirection:'row', 
    justifyContent:'space-between'
}
const calendar = {
    fontSize: '20px'
}

export default function Header() {

    const [curTime, setCurTime] = React.useState(format(new Date(), "iiii, dd MMM YYY, HH:mm a"));
    React.useEffect(() => {
        setInterval(() => {
            const time = format(new Date(), "iiii, dd MMM YYY, HH:mm a");
            setCurTime(time);
        }, 1000)
    }, []);

    return (
        <div style={headerContainer}>
            <Title level={3} style={{fontFamily:'Krona One', fontWeight:500}}>{curTime}</Title>
        </div>
    )
}
