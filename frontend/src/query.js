import { gql } from '@apollo/client'

export const GET_USER_DETAILS = gql `
    query getUser($email: String!){
    users(where: {email: {_eq: $email}}) {
    full_name
    createdAt
    email
    habits(order_by:{create_at:desc}) {
        bad_habit
        end_date
        habit_cycle
        name
        id
        remainder_note
        reminder_times
        start_date
        streak
        unit
        reps
        duration
        history(limit: 7, order_by: {date: desc}){
            id
            date
            val
        }
    }
    }
    }`
;

export const EDIT_HABIT = gql `
    mutation EditHabit( $id: uuid!,$user_id: String!, $habit_name: String!, $type: habit_unit!, $note: String, $bad_habit: Boolean, $start_date: date, $end_date: date, $reps: Int, $duration: Int) {
        update_habits_by_pk(pk_columns:{id: $id}, _set:{name: $habit_name, user: $user_id, start_date: $start_date, remainder_note: $note, unit: $type, end_date: $end_date, reps: $reps, bad_habit: $bad_habit, duration: $duration}) {
        id
        }
    }  
`;

export const DELETE_HABIT = gql `
    mutation DeleteHabit($id: uuid!) {
        delete_habits_by_pk(id: $id) {
        id
        }
    }
`;

export const FINISH_HABIT = gql `
    mutation FinishHabit($id: uuid!, $user: String!, $val: Int!, $date: date!) {
        insert_history_one(object: {habit: $id, user: $user, val: $val, date: $date}) {
        id
        }
    }
`;

export const ALL_HABITS = gql`
    query all_habits($user: String!){
        habits(where: {user: {_eq: $user}}, order_by:{create_at:desc}) {
          end_date
          name
          reps
          duration
          streak
          start_date
          unit
        }
    }`;

export const EDIT_HISTORY = gql`
    mutation UpdateHistory ($id: uuid!, $val: Int) {
        update_history_by_pk(pk_columns:{id: $id}, _set:{val:$val}){
        id
        }
    }
`;