import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter as Router,
         Switch,
         Route
} from 'react-router-dom';
import 'antd/dist/antd.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;