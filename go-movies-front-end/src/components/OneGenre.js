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
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Movie</th>
                                    <th scope="col">Release Date</th>
                                    <th scope="col">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map((m) => (
                                    <tr key={m.id}>
                                        <td>
                                            <Link className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to={`/movies/${m.id}`}>{m.title}</Link>
                                        </td>
                                        <td>{m.release_date}</td>
                                        <td>{m.mpaa_rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Link to="/genres" className="btn btn-outline-dark">Back to Genre</Link>
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