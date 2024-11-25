import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {

    const [movie, setMovie] = useState({});
    let { id } = useParams();

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers
        }

        fetch(`/movies/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setMovie(data);
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id]);

    if (movie.genres) {
        movie.genres = Object.values(movie.genres);
    } else {
        movie.genres = [];
    }

    return(
        <Fragment>
            {/* <div className="p-4">
                <Link to="/movies"><button className="button-login">Back</button></Link>
            </div> */}
            <div className="row">
                <div className="col-md-4 border-end">
                    <div className="p-4">
                        <h3>{movie.title}</h3>
                        <small>
                            <em>Released: {movie.release_date}</em> <br></br>
                            <em>Duration: {movie.runtime} minutes</em> <br></br>
                            <em>Rated: {movie.mpaa_rating}</em>
                        </small> <br></br>
                        {movie.genres.map((g) => (
                            <span key={g.genre} className="badge bg-secondary me-2">{g.genre}</span>
                        ))}
                        {movie.image !== "" &&
                            <div className="pt-3">
                                <img src={`https://image.tmdb.org/t/p/w200/${movie.image}`} alt="poster"></img>
                            </div>
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-4">
                        <h4>Description</h4>
                        <p>{movie.description}</p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Movie;