import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';

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

  const [errorMessage,setErrorMessage] = useState('') 

  const fetchMovies = async () => {
    try {
      const endpoint = '/discover/movie?sort_by=popularity.desc'; 
      const response = await fetch(API_BASE_URL + endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again later...')
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);


  return ( 
    <main>

      <div className="pattern" />
      
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You You'll Enjoy Without Hassle</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>

          <h2>All Movies</h2>
          

          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </section>
        
      </div>

    </main>
   );
}


export default App;