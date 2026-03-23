

const MovieCard = ({movie}) => {

	return (
		<div className={
			"max-w-sm rounded overflow-hidden shadow-lg "+
			"bg-white border-gray-200 "+
			"transition-transform hover:scale-105"
		}>
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2 text-indigo-700">
					{movie.title}
				</div>
				<p className="text-gray-700 text-base line-clamp-3">
					{movie.description}
				</p>
			</div>
			<div className="px-6 pt-4 pb-2 flex justify-between items-center">
				<span className={"inline-block bg-gray-200 rounded-full px-3 "+
				"py-1 text-sm font-semibold text-gray-700"}>
					{movie.release_year}
				</span>
				<span className="text-lg font-bold text-green-600">
					${movie.rental_rate}
				</span>
			</div>
			<button className={"w-full bg-indigo-600 hover:bg-indigo-700 text-white "+
			"font-bold py-2 px-4 transition-colors"}>
				Rent Now
			</button>
		</div>
	);
}
