import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import Movie from './components/Movie.jsx';
import Loader from './components/Loader.jsx';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  
  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debouncer is used to reduce search API calls to the server
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  

  const fetchMovies = async (query = '') => {
    
    setIsLoading(true);
    setErrorMessage('');

    try {

      const endpoint = !query ? '/discover/movie?sort_by=popularity.desc' : `/search/movie?query=${encodeURIComponent(query)}`;
      
      const response = await fetch(API_BASE_URL + endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
    
      const data = await response.json();

      if (data.Respose === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      };
    
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again later...')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {

      const trendMovies = await getTrendingMovies();
      setTrendingMovies(trendMovies);

      console.log(trendMovies);
      
      
    } catch (error) {
      console.error(error);
    }

  }
  
  
  useEffect(() => {
      fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  
  useEffect(() => {
    loadTrendingMovies();
    }, []);


  return ( 
    <main>

      <div className="pattern" >
      
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You You'll Enjoy Without Hassle</h1>
        
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
                <h2 className='text-center'>Trending Movies</h2>
                    <ul>
                      {trendingMovies.map(({movie_id, poster_url}, index) => (
                        <li key={movie_id}>
                          <p>{index + 1}</p>
                          <img src={poster_url} alt="Poster" />
                        </li>
                      ))}
                    </ul>

          </section>
        )}


        <section className='all-movies pt-4'>
          <h2 className='text-center'>All Movies</h2>

          {isLoading ? (<Loader/>)
            : errorMessage ? (
              <p className='text-red-500'>{ errorMessage }</p>
            )
              : (

                <ul>
                {movieList.map((movie) => (
                  <Movie key={movie.id} movie={movie} />
                ))}
                  </ul>


                
            ) 
            
            } 

        </section>
        
        </div>
        </div>

    </main>
   );
}


export default App;