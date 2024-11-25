import { Link, Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Alert from './components/Alert';


function App() {
  
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  
  const [tickInterval, setTickInterval] = useState();

  const navigate = useNavigate();

  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include"
    }

    fetch(`/logout`, requestOptions)
      .catch(error => {
        console.log("error logging out", error)
      })
      .finally(() => {
        setJwtToken("");
        toggleRefresh(false);
      })

    navigate("/login");
  }

  const toggleRefresh = useCallback((status) => {
    console.log("clicked");

    if (status) {
      console.log("turning on ticking");
      let i = setInterval(() => {
        const requestOptions = {
          method: "GET",
          credentials: "include"
        }

        fetch(`/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
          }
        })
        .catch(error => {
          console.log("user is not logged in", error);
        })
      }, 600000);
      setTickInterval(i);
      console.log("setting tick interval to: ", i);
    } else {
      console.log("turning off ticking");
      console.log("turning off tickInterval", tickInterval);
      setTickInterval(null);
      clearInterval(tickInterval);
    }
  }, [tickInterval])


  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions = {
        method: "GET",
        credentials: "include"
      }

      fetch(`/refresh`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setJwtToken(data.access_token);
            toggleRefresh(true);
          }
        })
        .catch(error => {
          console.log("user is not logged in", error);
        })
    }
  }, [jwtToken, toggleRefresh])

  return (
      <div className="container">
        <div className="row mt-3 p-3 justify-content-center align-items-center web-header">
          <div className="col">
            <h3 className='web-name'>Go Watch a Movie</h3>
          </div>
          <div className="col text-end">
            {jwtToken === ""
            ? <Link to="/login"><button className="button-login">Login</button></Link>
            : <button className='button-logout' onClick={logOut}>Logout</button>
            }
          </div>
        </div>

        <div className="row pt-4">
          <div className="col-md-2">
            <nav>
              <div className="list-group fw-semibold menu-lists">
                <Link to="/" className="list-group-item list-group-item-action"><span className='px-2'>🏠</span>Home</Link>
                <Link to="/movies" className="list-group-item list-group-item-action"><span className='px-2'>🎬</span>Movies</Link>
                <Link to="/genres" className="list-group-item list-group-item-action"><span className='px-2'>🍿</span>Genres</Link>
                {jwtToken !== "" &&
                  <Fragment>
                    <Link to="/admin/movie/0" className="list-group-item list-group-item-action"><span className='px-2'>➕</span>Add Movie</Link>
                    <Link to="/catalogue" className="list-group-item list-group-item-action"><span className='px-2'>📃</span>Catalogue</Link>
                    <Link to="/graphQL" className="list-group-item list-group-item-action"><span className='px-2'>💻</span>GraphQL</Link>
                  </Fragment>
                }
              </div>
            </nav>
          </div>
          <div className="col-md-10">
            <div className='main-content'>
              <Alert
                message={alertMessage}
                className={alertClassName}
              ></Alert>
              <Outlet
                context={{
                  jwtToken, setJwtToken, setAlertClassName, setAlertMessage, toggleRefresh
                }}
              ></Outlet>
            </div>
            <div className='pt-4 text-center'>
              {/* <small>Copyright ©️ Surya JBM | 2024</small> */}
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
