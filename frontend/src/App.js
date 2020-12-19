import React from 'react';
import Login from './components/Login';
import Home from './components/Home';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router,
         Switch,
         Route,
         Redirect,
         useHistory
} from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import 'antd/dist/antd.css';
import { StateProvider, store } from './store';

//Apollo client object. Used to make requests to the graphql API.
const client = new ApolloClient({
  uri: 'https://habit-tracker.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers:{
    'x-hasura-access': process.env.REACT_APP_API_PASS,
  },
});

function PrivateRoute({ children, ...rest }) {

  //Lazy query for user auth
  const [getUser, getUserResult] = useLazyQuery(
    gql`query getUser($email: String!){
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
          }
        }
      }`
  );
  const { state, dispatch } = React.useContext(store);
  const sessionStore = sessionStorage.getItem('HabitTrackerUser');      // session storage user's emailID
  const [ isAuthenticated, setAuthenticated ] = React.useState( !!state.full_name || !!sessionStore);
  const history = useHistory();

  // To fetch user data if users refreshes the page
  // React.useEffect(() => {

  //   if (sessionStore !== null && !isAuthenticated) {
  //     setAuthenticated(true);
  //     console.log('sessionstore:', sessionStore);
  //     getUser({
  //         variables:{
  //             email: sessionStore,
  //         }
  //     });
  //     while(getUserResult.loading){ }
  //     if(getUserResult.error){
  //         // handleError(getUserResult.error);
  //         console.log('Error:',getUserResult.error)
  //     }
  //     else{
  //         console.log('DATAA:::::', getUserResult)
  //         const {data} = getUserResult;
  //         if(data !== undefined){
  //             dispatch(data.users[0]);
  //         }
  //         else{
  //           history.replace('/login');
  //         }
  //     }
  //   }

  // }, []);

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",       // redirect if not autheticated
            }}
          />
        )
      }
    />
  );
}

function App() {

  return (
   <StateProvider>
      <ApolloProvider client={client}>
         <Router>
             <Switch>
                 <Route exact path="/login">
                     <Login />
                 </Route>
                 <PrivateRoute exact path="/">
                     <Home />
                 </PrivateRoute>
             </Switch>
         </Router>
      </ApolloProvider>
   </StateProvider>
  );
}

export default App;