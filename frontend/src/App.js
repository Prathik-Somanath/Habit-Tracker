import Login from './components/Login';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router,
         Switch,
         Route
} from 'react-router-dom';
import 'antd/dist/antd.css';
import { StateProvider } from './store';

//Apollo client object. Used to make requests to the graphql API.
const client = new ApolloClient({
  uri: 'https://habit-tracker.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers:{
    'x-hasura-access': process.env.REACT_APP_API_PASS,
  },
});

function App() {
  return (
   <StateProvider>
      <ApolloProvider client={client}>
         <Router>
             <Switch>
                 <Route exact path="/login">
                     <Login />
                 </Route>
             </Switch>
         </Router>
      </ApolloProvider>
   </StateProvider>
  );
}

export default App;