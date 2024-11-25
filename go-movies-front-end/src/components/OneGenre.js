import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PopcornImg from './../images/popcorn.png';

const OneGenre = () => {
    //pass the props to this component
    const location = useLocation();
    const { genreName } = location.state;

    //set statefull variables
    const [movies, setMovies] = useState([]);


    //get the id from the url
    let { id } = useParams();


    //useEffect to get list of movies
    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: headers
        }

        fetch(`/movies/genres/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.message);
                } else {
                    setMovies(data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, [id])

    //return jsx
    return (
        <Fragment>
            <div className="p-4 text-center">
                    <h4>{genreName} Collections</h4>
            </div>
                {movies.length > 0 &&
                    <div className="p-4">
                        <Link to="/genres" className="btn btn-outline-dark">Back to Genre</Link>
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
                }
                {movies.length === 0 &&
                <div className="container text-center">
                    <div className="p-4 mt-4">
                        <img src={PopcornImg} alt="Popcorn" width="250px" height="250px"></img>
                        <h1 className="mt-4">Oops!</h1>
                        <p>No movies in this genre (yet)!</p>
                        <Link to="/genres" className="btn btn-outline-dark">Back to Genre</Link>
                    </div>
                </div>
                }   

        </Fragment>
    )
}


export default OneGenre;