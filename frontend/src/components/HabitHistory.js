
import React from 'react';
import { Table, Tag } from 'antd';
import { isBefore } from 'date-fns';
import { useQuery } from '@apollo/client';
import {ALL_HABITS} from '../query'; 

export default function HabitHistory() {
    const user = sessionStorage.getItem('HabitTrackerUser');
    const {data,loading,error} = useQuery(ALL_HABITS,{variables:{user}});

    const tableData = [];
    const columns = [
        {
            title:'Name',
            dataIndex:'name',
            key:'name',
        },
        {
            title:'Iteration',
            dataIndex:'iteration',
            key:'iteration',
        },
        {
            title:'Start Date',
            dataIndex:'start',
            key:'start',
        },
        {
            title:'End Date',
            dataIndex:'end',
            key:'end',
        },
        
        {
            title:'Streak',
            dataIndex:'streak',
            key:'streak',
        },
        {
            title:'Status',
            dataIndex:'status',
            key:'status',
            render: tag =>{
                let color;
                if(tag === 'Active')
                    color ='green';
                else
                    color = 'volcano';

                return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
            }
        }
    ];

 
        

    if (error) {
        console.log(error);
        return (
            <div>
                <h4> Something went wrong! </h4>
            </div>
        )
    }

   if(!loading){
        data.forEach(val => {
            const row = {
                name: val.name,
                iteration: (val.unit ==='CHECK')?'-':((val.unit === 'DURATION')?val.duration:val.reps),
                start: val.start_date,
                end: val.end_date,
                streak: (isBefore(new Date(val.end_date),new Date()))?'-':val.streak,
                status: (isBefore(new Date(val.end_date),new Date()))?'Terminated':'Active'
            }
            tableData.push(row);
        });
   }

    return (
        <div>
            <Table columns={columns} dataSource={tableData} title="All Habits" loading={loading} sticky style={{height:'50%',width:'50%'}}/>
        </div>
    )
}
