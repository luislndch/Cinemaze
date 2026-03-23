import { useState } from "react";
import { useGetMoviesQuery } from "../slices/api";

const MovieSearch = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const {data: movies = [], isLoading} = useGetMoviesQuery();

	/* filter the cached movies realtime */
	const filteredMovies = movies.filter((movie) => 
		movie.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="search-container">
			<input
				type="text"
				placeholder="Search for DVD..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			<div className="movie-results">
				{isLoading ? (
					<p>Loading...</p>
				):(
					filteredMovies.map((movie) => (
						<div key={movie.movie_id}>{movie.title}</div>
					))
				)}
			</div>
		</div>
	)
}

export default MovieSearch;
