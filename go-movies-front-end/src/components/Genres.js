import { Fragment, useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import { Link } from "react-router-dom";

const Genre = () => {

    const [genres, setGenres] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
    
        const requestOptions = {
          method: "GET",
          headers: headers,
        };
    
        fetch(`/genres`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              setError(data.message);
            } else {
              setGenres(data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
    }, []);

    if (error !== null) {
        return <ErrorPage></ErrorPage>
    } else {
        return(
            <Fragment>
                <div className="p-4 text-center">
                    <h4>Movies by Genre</h4>
                </div>
                <div className="p-4 list-group">
                {genres.map((g) => (
                    <Link
                        key={g.id}
                        className="list-group-item list-group-item-action"
                        to={`/genres/${g.id}`}
                        state={
                            {
                                genreName: g.genre,
                            }
                        }
                    >{g.genre}</Link>
                ))}

                </div>
            </Fragment>
        )
    }
}

export default Genre;