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
import 'antd/dist/antd.css';

//Apollo client object. Used to make requests to the graphql API.
const client = new ApolloClient({
  uri: 'https://habit-tracker.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers:{
    'x-hasura-access': process.env.REACT_APP_API_PASS,
  },
});

function PrivateRoute({ children, ...rest }) {

  const sessionStore = sessionStorage.getItem('HabitTrackerUser');      // session storage user's emailID
  const [ isAuthenticated, setAuthenticated ] = React.useState(!!sessionStore);

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
  );
}

export default App;