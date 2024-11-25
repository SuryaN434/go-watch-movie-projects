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
                <div className="row p-4">
                  {genres.map((g) => (
                      <Fragment>
                         <div className="col-md-4">
                          <div className="card mt-3">
                            <div className="card-body">
                              <h5 className="card-title">{g.genre}</h5>
                              <p className="card-text">Collections of {g.genre} movie</p>
                              <Link
                                  key={g.id}
                                  className="btn btn-outline-secondary"
                                  to={`/genres/${g.id}`}
                                  state={
                                      {
                                          genreName: g.genre,
                                      }
                                  }
                              >See {g.genre} Collections</Link>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                  ))}
                </div>
            </Fragment>
        )
    }
}

export default Genre;