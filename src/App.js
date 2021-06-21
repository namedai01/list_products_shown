import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// My components
import Home from "./pages/Home";

// Css
import "./App.css";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                {/* Main web with route "/" */}
                    <Route exact path="/" component={Home} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
