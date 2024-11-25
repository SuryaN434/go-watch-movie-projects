import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './components/ErrorPage';
import Home from './components/Home';
import Movies from './components/Movies';
import Genre from './components/Genres';
import Catalogue from './components/Catalogue';
import GraphQL from './components/GraphQL';
import Login from './components/Login';
import EditMovie from './components/EditMovie';
import Movie from './components/Movie';
import OneGenre from './components/OneGenre';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true, 
        element: <Home></Home>
      },
      {
        path: '/movies',
        element: <Movies></Movies>
      },
      {
        path: '/movies/:id',
        element: <Movie></Movie>
      },
      {
        path: '/genres',
        element: <Genre></Genre>
      },
      {
        path: '/genres/:id',
        element: <OneGenre></OneGenre>
      },
      {
        path: '/admin/movie/0',
        element: <EditMovie></EditMovie>
      },
      {
        path: '/admin/movie/:id',
        element: <EditMovie></EditMovie>
      },
      {
        path: '/catalogue',
        element: <Catalogue></Catalogue>
      },
      {
        path: '/graphQL',
        element: <GraphQL></GraphQL>
      },
      {
        path: '/login',
        element: <Login></Login>
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

