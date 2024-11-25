import { Fragment, useEffect, useState } from "react";
import LoginForm from "./form/LoginForm";
import { Link } from "react-router-dom";
import PopcornImg from './../images/popcorn.png';

const GraphQL = () => {
    //setup statefull variable
    const [movies, setMovies] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [fullLists, setFullLists] = useState([]);

    //perform a search
    const performSearch = () => {
        const payloads = `
        {
            search(titleContains: "${searchTerm}") {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        
        }`;

        const headers = new Headers();
        headers.append("Content-Type", "application/graphql");

        const requestOptions =  {
            method: "POST",
            headers: headers,
            body: payloads
        }

        fetch(`/graph`, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                let theList = Object.values(response.data.search);
                setMovies(theList);
            })
            .catch(err => {
                console.log(err);
            });

    }

    const handleChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        setSearchTerm(value);

        if (value.length > 2) {
            performSearch();
        } else {
            setMovies(fullLists);
        }

    }
 
    //useEffect 
    useEffect(() => {
        const payloads = `
        {
            list {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }`;

        const headers = new Headers();
        headers.append("Content-Type", "application/graphql");

        const requestOptions =  {
            method: "POST",
            headers: headers,
            body: payloads
        }

        fetch(`/graph`, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                let theList = Object.values(response.data.list);
                setMovies(theList);
                setFullLists(theList);
            })
            .catch(err => {
                console.log(err);
            });
    }, [])


    return(
        <Fragment>
            <div className="p-4 text-center">
                <h4>GraphQL</h4>
            </div>
            <div className="p-4">
                <form onSubmit={handleChange}>
                    <LoginForm
                        title={"Search Movie"}
                        type={"search"}
                        name={"search"}
                        className={"form-control"}
                        value={searchTerm}
                        placeholder={"Search movie name..."}
                        onChange={handleChange}
                    ></LoginForm>
                </form>
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
                                        <td>{new Date(m.release_date).toLocaleDateString()}</td>
                                        <td>{m.mpaa_rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                {movies.length === 0 &&
                <div className="container text-center">
                    <div className="p-4 mt-4">
                        <img src={PopcornImg} alt="Popcorn" width="250px" height="250px"></img>
                        <h1 className="mt-4">Oops!</h1>
                        <p>No movies available from your search result</p>
                    </div>
                </div>
                }   
            </div>
        </Fragment>
    )
}

export default GraphQL;