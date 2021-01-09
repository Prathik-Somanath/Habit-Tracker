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
import { gql, useMutation } from '@apollo/client'
import { GET_USER_DETAILS } from '../../query';
const { RangePicker } = DatePicker;

const headerContainer = {
    display:'flex',
    flexDirection:'row', 
    justifyContent:'space-between'
}

const ADD_NEW_HABIT = gql`
    mutation AddNewHabit($user_id: String!, $habit_name: String!, $type: habit_unit!, $note: String, $bad_habit: Boolean, $start_date: date, $end_date: date, $reps: Int) {
        insert_habits_one(object: {
        name: $habit_name, 
        user: $user_id, 
        start_date: $start_date, 
        remainder_note: $note, 
        unit: $type, 
        end_date: $end_date, 
        reps: $reps,
        bad_habit: $bad_habit
        }) {
        id
        }
    }  
`;

export default function NewHabit({ setVisible, userID }) {

    const [form] = Form.useForm();
    const [habitType, setHabitType] = useState(null);
    const [addNewHabit, {data, error}] = useMutation(ADD_NEW_HABIT);

    const onFinish = (values) => {
        console.log('values:::::::::::::::::::', format(new Date(values.date_range[0]._d), "yyyy-MM-dd"))
        addNewHabit({
            variables: {
                user_id: userID,
                habit_name: values.habit_name,
                type: values.type,
                start_date: format(new Date(values.date_range[0]._d), "yyyy-MM-dd"),
                end_date: format(new Date(values.date_range[1]._d), "yyyy-MM-dd"),
                reps: values.reps_no ? values.reps_no : null
            },
            refetchQueries: [{ query: GET_USER_DETAILS, variables: { email: userID } }],
        })
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
            onFinishFailed={onFormFail}
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
