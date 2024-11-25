import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
                <table className="table table-hover movies-table">
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
            </div>
        </Fragment>
    )
}

export default Movies;