import { gql } from '@apollo/client'

export const GET_USER_DETAILS = gql `
    query getUser($email: String!){
    users(where: {email: {_eq: $email}}) {
    full_name
    createdAt
    email
    habits {
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
        history{
            id
            date
            val
        }
    }
    }
    }`
;