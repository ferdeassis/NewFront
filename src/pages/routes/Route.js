import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../Contexts/login";


export default function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}) {
    const { signed, loading } = useContext(AuthContext)


    if (loading) {
        return (
            <div></div>
        )
    }

    if (!signed && isPrivate) {
        return <Redirect to="/" />
    }

    if (signed && !isPrivate) {
        return <Redirect to="/Propostas" />
    }

    return (
        <Route
            {...rest}
            render={props => (
                <Component {...props} />
            )}
        />
    );
}