import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PopcornImg from './../images/popcorn.png';

const Movies = () => {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "Get",
            headers: headers,
        }

        fetch(`/movies`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setMovies(data);
            })
            .catch(err => {
                console.log(err)
            });

    }, []);


    return(
        <Fragment>
            <div className="p-4 text-center">
                <h4>List of Movies</h4>
            </div>
            <div className="p-4">
                <div className="row">
                    {movies.map((m) => (
                        <div className="col-md-3">
                            <div className="card mt-2">
                                <div className="text-center p-2">
                                    {m.image
                                    ?
                                        <img className="card-img-top w-50 rounded img-fluid" src={`https://image.tmdb.org/t/p/w200/${m.image}`} alt="Card cap"></img>
                                    :
                                        <img className="card-img-top w-75 rounded img-fluid" src={PopcornImg} alt="Card cap"></img>
                                    }
                                </div>
                                <div className="card-body">
                                    <h6 className="card-title">{m.title}</h6>
                                    <p className="card-text text-truncate">{m.description}</p>
                                    <div className="text-center">
                                        <Link className="btn btn-outline-secondary" to={`/movies/${m.id}`}>Details</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    )
}

export default Movies;