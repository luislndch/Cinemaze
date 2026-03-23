import {useGetMoviesQuery} from "../slices/api"

export const MovieGallery = () => {
	const {data: movies, isLoading, error} = useGetMoviesQuery();

	if(isLoading) return <p>Loading...</p>;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">
				Available DVDs
			</h1>
			<div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 "+
			"lg:grid-cols-4 gap-6"}>
				{movies.map((movie) => (
					<MovieCard key={movie.movie_id} movie={movie} />
				))}
			</div>
		</div>
	);
}
