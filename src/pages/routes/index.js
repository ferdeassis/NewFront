
import { Switch } from "react-router-dom";
import Propostas from "../Propostas";
import Consultas from "../Consultas";
import NotFound from "../NotFound";
import Header from "../../Header";
import Login from './../Login';
import Route from "./Route";


export default function Routes() {
    return (
        <div>
            <Header />
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/Propostas" component={Propostas} isPrivate />
                <Route exact path="/Consultas" component={Consultas} isPrivate />
                <Route path="*" component={NotFound} isPrivate />
            </Switch>
        </div>
    );
}