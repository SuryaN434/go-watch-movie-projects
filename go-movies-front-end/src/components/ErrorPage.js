import { Link, useRouteError } from "react-router-dom";
import PopcornImg from './../images/popcorn.png'

export default function ErrorPage () {
    const error = useRouteError();

    return (
        <div className="container text-center">
            <div className="p-4 mt-4">
                <img src={PopcornImg} alt="Popcorn" width="250px" height="250px"></img>
                <h1 className="mt-4">Oops!</h1>
                <p>Looks like you are looking for the page that's <em>{error.statusText || error.message}</em></p>
                <Link to="/" className="btn btn-outline-dark">Back to HomePage</Link>
            </div>
        </div>
    )
}