import { Fragment, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import LoginForm from "./form/LoginForm";
import SelectBox from "./form/SelectBox";
import TextArea from "./form/TextArea";
import Checkbox from "./form/Checkbox";
import Swal from 'sweetalert2';
import ErrorPage from "./ErrorPage";


const EditMovie = () => {

    const navigate = useNavigate();
    const { jwtToken } = useOutletContext();
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);
    const mpaaOptions = [
        {
            id: "G",
            value: "G"
        },
        {
            id: "PG",
            value: "PG"
        },
        {
            id: "PG-13",
            value: "PG-13"
        },
        {
            id: "R",
            value: "R"
        },
        {
            id: "NC-17",
            value: "NC-17"
        },
        {
            id: "18A",
            value: "18A"
        },
    ]
    const [movie, setmovie] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        genres: [],
        genres_array: [Array(13).fill(false)]
    });

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    //get id from url
    let { id } = useParams();
    if (id === undefined) {
        id = 0;
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }

       if (id === 0) {
            // adding a movie
            setmovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                description: "",
                genres: [],
                genres_array: [Array(13).fill(false)],
            })

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: headers,
            }

            fetch(`/genres`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const checks = [];

                    data.forEach(g => {
                        checks.push({id: g.id, checked: false, genre: g.genre});
                    })

                    setmovie(m => ({
                        ...m,
                        genres: checks,
                        genres_array: [],
                    }))
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
             // editing an existing movie
             const headers = new Headers();
             headers.append("Content-Type", "application/json");
             headers.append("Authorization", "Bearer " + jwtToken);
 
             const requestOptions = {
                 method: "GET",
                 headers: headers,
             }
 
             fetch(`/admin/movies/${id}`, requestOptions)
                 .then((response) => {
                     if (response.status !== 200) {
                         setError("Invalid response code: " + response.status)
                     }
                     return response.json();
                 })
                 .then((data) => {
                     // fix release date
                     data.movie.release_date = new Date(data.movie.release_date).toISOString().split('T')[0];
 
                     const checks = [];
 
                     data.genres.forEach(g => {
                         if (data.movie.genres_array.indexOf(g.id) !== -1) {
                             checks.push({id: g.id, checked: true, genre: g.genre});
                         } else {
                             checks.push({id: g.id, checked: false, genre: g.genre});
                         }
                     })
 
                     // set state
                     setmovie({
                         ...data.movie,
                         genres: checks,
                     })
                 })
                 .catch(err => {
                     console.log(err);
                 })
        }


    }, [id, jwtToken, navigate])

    const handleChange = () => (event) => {
        let value = event.target.value;
        let name = event.target.name;

        setmovie({
            ...movie,
            [name]: value
        })
    }

    const handleCheck = (event, position) => {
        console.log("handleCheck called");
        console.log("value in handleCheck: ", event.target.value);
        console.log("checked is", event.target.checked);
        console.log("position is", position);

        let tempArr = movie.genres;
        tempArr[position].checked = !tempArr[position].checked;

        let tempID = movie.genres_array;
        if (!event.target.checked) {
            tempID.splice(tempID.indexOf(event.target.value));
        } else {
            tempID.push(parseInt(event.target.value, 10));
        }

        setmovie({
            ...movie,
            genres_array:tempID
        })
    }

    const handleSubmission = (event) => {
        event.preventDefault();

        let errors = [];
        let required = [
            {
                field: movie.title,
                name: "title"
            },
            {
                field: movie.release_date,
                name: "release_date"
            },
            {
                field: movie.runtime,
                name: "runtime"
            },
            {
                field: movie.description,
                name: "description"
            },
            {
                field: movie.mpaa_rating,
                name: "mpaa_rating"
            }
        ]

        required.forEach(function (obj) {
            if (obj.field === "") {
                errors.push(obj.name);
            }
        })

        if (movie.genres_array.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'You must choose at least one genre',
                icon: 'error'
            });
            errors.push("genres");
        }

        setErrors(errors);

        if (errors.length > 0) {
            return false;
        }

        //passed validation so save changes
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken);

        //assume we adding a new movie
        let method = "PUT";

        if (movie.id > 0) {
            method = "PATCH";
        }

        const requestBody = movie;

        //we need to convert the values in json for the release date (to date)
        //and for runtime to int

        requestBody.release_date = new Date(movie.release_date);
        requestBody.runtime = parseInt(movie.runtime, 10);


        let requestOptions = {
            body: JSON.stringify(requestBody),
            method: method,
            headers: headers,
            credentials: 'include'
        }

        fetch(`/admin/movies/${movie.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    navigate("/catalogue");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }


    const confirmDelete = (event) => {
        event.preventDefault();
        Swal.fire({
            title: "Delete movie?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {

                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                headers.append("Authorization", "Bearer " + jwtToken);

                const requestOptions =  {
                    method: "DELETE",
                    headers: headers
                }


                fetch(`/admin/movies/${movie.id}`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            console.log(data.error);
                        } else {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your movie has been deleted.",
                                icon: "success"
                            });
                            navigate("/catalogue");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
          });
    }
    if (error !== null) {
        return <ErrorPage></ErrorPage>
    } else {
        return(
            <Fragment>
                <div className="p-4 text-center">
                    <h4>Add or Edit Movie</h4>
                </div>
                {/* <pre>{JSON.stringify(movie, null, 3)}</pre> */}
               
                    <form onSubmit={handleSubmission}>
                        <div className="row p-4 justify-content-center">
                            <div className="col-md-5">
                                <input type="hidden" name="id" value={movie.id} id="id"></input>
                                <LoginForm
                                    title={"Movie Title"}
                                    className={"form-control"}
                                    type={"text"}
                                    name={"title"}
                                    value={movie.title}
                                    onChange={handleChange("title")}
                                    errorDiv={hasError("title") ? "text-danger" : "d-none"}
                                    errorMsg={"Please enter a title"}
                                ></LoginForm>
                                <LoginForm
                                    title={"Release Date"}
                                    className={"form-control"}
                                    type={"date"}
                                    name={"release_date"}
                                    value={movie.release_date}
                                    onChange={handleChange("release_date")}
                                    errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                                    errorMsg={"Please enter a release date"}
                                ></LoginForm>
                                <LoginForm
                                    title={"Movie Runtime"}
                                    className={"form-control"}
                                    type={"text"}
                                    name={"runtime"}
                                    value={movie.runtime}
                                    onChange={handleChange("runtime")}
                                    errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                                    errorMsg={"Please enter a runtime"}
                                ></LoginForm>
                                <SelectBox
                                    title={"Mpaa Rating"}
                                    name={"mpaa_rating"}
                                    options={mpaaOptions}
                                    value={movie.mpaa_rating}
                                    onChange={handleChange("mpaa_rating")}
                                    placeholder={"Choose..."}
                                    errorMsg={"Please choose an option"}
                                    errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                                ></SelectBox>
                                 <TextArea
                                    title="Movie Description"
                                    name={"description"}
                                    value={movie.description}
                                    rows={"3"}
                                    onChange={handleChange("description")}
                                    errorMsg={"Please enter a description"}
                                    errorDiv={hasError("description") ? "text-danger" : "d-none"}
                                ></TextArea>
                            </div>
                            <div className="col-md-5">
                                <h5>Genre</h5>
                                {movie.genres && movie.genres.length >= 1 &&
                                    <>
                                        {Array.from(movie.genres).map((g, index) =>
                                            <Checkbox
                                                title={g.genre}
                                                name={"genre"}
                                                key={index}
                                                id={"genre-" + index}
                                                onChange={(event) => handleCheck(event, index)}
                                                value={g.id}
                                                checked={movie.genres[index].checked}
                                            />
                                        )}
                                    </>
                                }
                            </div>
                            <div className="text-center">
                                <input type="submit" value="Submit" className="button-login-half-width mt-2"></input>
                            </div>
                            <br></br>
                            {movie.id > 0 &&
                                <button className="button-logout-half-width text-center mt-2" onClick={confirmDelete}>Delete Movie</button>
                            }
                        </div>
                    </form>
            </Fragment>
        )
    }
}

export default EditMovie;