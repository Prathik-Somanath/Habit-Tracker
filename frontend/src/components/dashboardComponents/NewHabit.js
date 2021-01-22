import React, { useState } from 'react'
import { format } from 'date-fns'
import moment from 'moment';
import { 
    Form, 
    DatePicker, 
    Select,
    InputNumber,
    Input,
    TimePicker,
    Button
    } from 'antd';
import { gql, useMutation } from '@apollo/client'
import { GET_USER_DETAILS, EDIT_HABIT } from '../../query';
const { RangePicker } = DatePicker;

const headerContainer = {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
}

const ADD_NEW_HABIT = gql`
    mutation AddNewHabit($user_id: String!, $habit_name: String!, $type: habit_unit!, $note: String, $bad_habit: Boolean, $start_date: date, $end_date: date, $reps: Int, $duration: Int) {
        insert_habits_one(object: {
        name: $habit_name, 
        user: $user_id, 
        start_date: $start_date, 
        remainder_note: $note, 
        unit: $type, 
        end_date: $end_date, 
        reps: $reps,
        duration: $duration
        bad_habit: $bad_habit
        }) {
        id
        }
    }
`;

const disabledDate = current => {
    return current && current < moment().subtract(1, 'days');
  }

export default function NewHabit({ setVisible, userID, editHabitDate }) {

    const [form] = Form.useForm();
    React.useEffect(()=>{
        form.resetFields();
    },[editHabitDate])
    const [habitType, setHabitType] = useState(null);
    const [addNewHabit, {data, error}] = useMutation(ADD_NEW_HABIT);
    const [editHabit] = useMutation(EDIT_HABIT);
    const onFinish = (values) => {
        console.log('values:::::::::::::::::::', format(new Date(values.date_range[0]._d), "yyyy-MM-dd"))
        {(editHabitDate)
        ? editHabit({
            variables: {
                id: editHabitDate.id,
                user_id: userID,
                habit_name: values.habit_name,
                type: values.type,
                start_date: format(new Date(values.date_range[0]._d), "yyyy-MM-dd"),
                end_date: format(new Date(values.date_range[1]._d), "yyyy-MM-dd"),
                reps: values.reps_no ? values.reps_no : null,
                note: values.note ? values.note : null,
                duration: values.duration ? values.duration : null
            },
            refetchQueries: [{ query: GET_USER_DETAILS, variables: { email: userID } }],
        })
        : addNewHabit({
            variables: {
                user_id: userID,
                habit_name: values.habit_name,
                type: values.type,
                start_date: format(new Date(values.date_range[0]._d), "yyyy-MM-dd"),
                end_date: format(new Date(values.date_range[1]._d), "yyyy-MM-dd"),
                reps: values.reps_no ? values.reps_no : null,
                note: values.note ? values.note : null,
                duration: values.duration ? values.duration : null
            },
            refetchQueries: [{ query: GET_USER_DETAILS, variables: { email: userID } }],
        })}
        form.resetFields();
        setVisible(false);
    }
    const onFormFail = (value) => {
        setVisible(true);
    }

    return (
        <Form
            labelCol={{ span: 6 }}
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
                initialValue={!!editHabitDate ? editHabitDate.name : ""}
            >
                <Input placeholder="Enter Name of the Habit" />
            </Form.Item>
            <Form.Item
                name='type'
                label="Type"
                rules={[{ required: true, message: "Please Select Type of Habit!" }]}
                initialValue={editHabitDate ? editHabitDate.unit : ""}
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
                initialValue={editHabitDate ? [moment(editHabitDate.start_date), moment(editHabitDate.end_date)] : ""}
            >
                <RangePicker disabledDate={disabledDate} />
            </Form.Item>
            { (habitType === 'REPS' || editHabitDate && editHabitDate.unit === 'REPS') &&
                <Form.Item 
                    name="reps_no" 
                    label="Count"
                    rules={[{ required: true, message: "Please Select Reps no.!" }]}
                    initialValue={editHabitDate ? editHabitDate.reps : ""}
                >
                    <InputNumber min={1}/>
                </Form.Item>
            }
            { (habitType === 'DURATION' || editHabitDate && (editHabitDate.unit === 'DURATION')) &&
                <Form.Item 
                    name="duration" 
                    label="Duration(mins)"
                    rules={[{ required: true, message: "Please Select Duration!" }]}
                    initialValue={editHabitDate ? editHabitDate.duration : ""}
                >
                    <InputNumber min={1}/>
                </Form.Item>
            }
            <Form.Item
                name='note'
                label="Note"
                // rules={[{ required: true, message: "Please input Habit's Name!" }]}
                initialValue={editHabitDate ? editHabitDate.remainder_note : ""}
            >
                <Input placeholder="Enter Note for the Habit" defaultValue={editHabitDate ? editHabitDate.remainder_note : ""} />
            </Form.Item>
        </Form>
    )
}
