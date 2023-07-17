import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import '../App.css';
export const DashboardPage = () => {
  const Api_url = "https://api.themoviedb.org/3";
  const Api_Key = "cf6547689883d38b104a34b76a99795b";
  const Img_Path = "https://image.tmdb.org/t/p/original";

  //endpoint para las imagenes
  const Url_Img = "https://image.tmdb.org/t/p/original";

  //variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  //función get api
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${Api_url}/${type}/movie`, {
      params: {
        api_key: Api_Key,
        query: searchKey,
      },
    });
    setMovies(results);
    setMovie(results[0]);
    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  // para la petición de un objeto
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${Api_url}/movie/${id}`, {
      params: {
        api_key: Api_Key,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  //sele

  const selecMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  //funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []); // se deja asi para la busqueda de peliculas 
  return (
    <div className="">
      <div className="fondo-search form2">
      <h2>Encuentea tu película</h2>
      {/*buscador*/}
      <form className="container mb-4" onSubmit={searchMovies}>
        <input
          type="text"
          //placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button className="btn btn-primary btn-search"> Buscar</button>
      </form>
      </div>
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${Img_Path}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <div className="fondo-black">
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/*Contenedor de los poster*/}
      <div className="container mt-3">
        <div className="row">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-md-4 mb-3"
              onClick={() => selecMovie(movie)}
            >
              <img
                src={`${Url_Img + movie.poster_path}`}
                alt=""
                height={600}
                width="100%"
              />
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


