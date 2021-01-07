import React, { useState } from 'react'
import { format } from 'date-fns'
import { 
    Typography, 
    Form, 
    DatePicker, 
    Select,
    InputNumber,
    Input,
    TimePicker,
    Button
    } from 'antd';
const { RangePicker } = DatePicker;

const headerContainer = {
    display:'flex',
    flexDirection:'row', 
    justifyContent:'space-between'
}

export default function NewHabit({setVisible}) {

    const [form] = Form.useForm();
    const [habitType, setHabitType] = useState(null);
    const onFinish = (values) => {
        console.log('values:::::::::::::::::::', values)
        form.resetFields();
        setVisible(false);
    }
    const onFormFail = (value) => {
        setVisible(true);
    }

    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            form={form}
            onFinish={onFinish}
            onFinishFailed={console.log('falied')}
            id='new_habit'
        >
            <Form.Item
                name='habit_name'
                label="Habit"
                rules={[{ required: true, message: "Please input Habit's Name!" }]}
            >
                <Input placeholder="Enter Name of the Habit" />
            </Form.Item>
            <Form.Item
                name='type'
                label="Type"
                rules={[{ required: true, message: "Please Select Type of Habit!" }]}
            >
                <Select onChange={(type)=>setHabitType(type)} placeholder="Enter Type of Habit">
                    <Select.Option value="CHECK">Yes/No</Select.Option>
                    <Select.Option value="REPS">Integer Habit(Reps)</Select.Option>
                    <Select.Option value="DURATION">Timed Habit</Select.Option>
                    {/* <Select.Option value="DURATION">Bad Habit</Select.Option> */}
                </Select>
            </Form.Item>
            <Form.Item
                name='date_range'
                label="Date"
                rules={[{ required: true, message: "Please Select date!" }]}
            >
                <RangePicker />
            </Form.Item>
            { (habitType==='REPS') &&
                <Form.Item name="reps_no" label="Count">
                    <InputNumber />
                </Form.Item>
            }
            { (habitType==='DURATION') &&
                <Form.Item name="timer" label="Timer">
                    <TimePicker showNow={false} />
                </Form.Item>
            }
        </Form>
    )
}
