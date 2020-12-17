import Login from './components/Login';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router,
         Switch,
         Route
} from 'react-router-dom';
import 'antd/dist/antd.css';

//Apollo client object. Used to make requests to the graphql API.
const client = new ApolloClient({
  uri: 'https://habit-tracker.hasura.app/v1/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
   <ApolloProvider client={client}>
        <Router>
            <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
            </Switch>
        </Router>
   </ApolloProvider>
  );
}

export default App;