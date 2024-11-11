import React, { useContext, useReducer, useState, useEffect } from "react";
import Reducer from "./reducer";

const INITIAL_STATE = {
  user:
    localStorage.getItem("user") && localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  loading: false,
  error: false,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);
  const [moviesArr, setMoviesArr] = useState([]);
  const [genres, setGenres] = useState([]);
  const [premiereMovies, setPremierMovies] = useState([]);

  // Fetching movies, genres, and premiere movies on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMovies, resGenres, resPremierMovies] = await Promise.all([
          fetch(
            "https://api.themoviedb.org/3/movie/now_playing?api_key=bdf1c383f5281f14daf90fc20861ba0f&language=en-US&page=1&region=GB"
          ),
          fetch(
            "https://api.themoviedb.org/3/genre/movie/list?api_key=bdf1c383f5281f14daf90fc20861ba0f&language=en-US"
          ),
          fetch(
            "https://api.themoviedb.org/3/movie/upcoming?api_key=bdf1c383f5281f14daf90fc20861ba0f&language=en-US&page=1&region=GB"
          ),
        ]);

        const [dataMovies, dataGenres, dataPremierMovies] = await Promise.all([
          resMovies.json(),
          resGenres.json(),
          resPremierMovies.json(),
        ]);

        setMoviesArr(dataMovies.results);
        setGenres(dataGenres.genres);
        setPremierMovies(dataPremierMovies.results);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Syncing `state.user` with localStorage whenever it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AppContext.Provider
      value={{ dispatch, moviesArr, genres, premiereMovies, state }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);

export { AppProvider };
