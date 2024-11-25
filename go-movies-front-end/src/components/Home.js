import { Fragment } from "react";
import TicketImg from './../images/movie.png'
import { Link } from "react-router-dom";

const Home = () => {
    return(
        <Fragment>
            <div className="p-4 text-center">
                <h4>Find a Movie to Watch Tonight</h4>
                <Link to="/movies">
                    <img src={TicketImg} alt="Ticket Pict" width="150px" height="150px" className="mt-4 go-to-movie"></img>
                </Link>
            </div>
        </Fragment>
    )
}

export default Home;