import {useEffect, useState} from "react";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import ErrorMsg from "./components/ErrorMsg";

const App = () => {
	const [movies, setMovies] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectMovie, setSelectMovie] = useState(null);
	const [view, setView] = useState("search");

	const API_KEY = "import.meta.env.VITE_TMDB_API_KEY";

	useEffect(() => {
		if (view === "favorites") {
			setMovies([]);
			return;
		}

		const fetchMovies = async () => {
			setLoading(true);
			setError(null);

			try {
				let url;
				if (searchTerm) {
					url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query{encodeURIComponent(searchTerm)}&page=${page}`;
				} else {
					url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
				}
				const res = await fetch(url);
				if (!res.ok) throw new Error("Failed to fetch movies.");
				const data = await res.json();
				console.log(data);
				setMovies(data.results);
				setTotalPages(Math.min(data.total_pages || 0, 500));
			} catch (err) {
				setError("Failed to fetch movies.");
			} finally {
				setLoading(false);
			}
		};
		fetchMovies();
	}, [searchTerm, page, view]);

	const handleSearch = (term) => {
		setSearchTerm(term);
		setPage(1);
	};

	return (
		<div className="container mx-auto p-4 flex flex-col items-center text-center">
			<h1 className="text-4xl font-extrabold mb-6 drop-shadow-2xl">
				Cinephilia HQ
			</h1>
			{/* Navigation */}
			<div className="tabs tabs-border mb-6">
				<a
					className={`tab text-lg ${view === "search" ? "tab-active" : ""}`}
					onClick={() => {
						setView("search");
						setPage(1);
					}}>
					Search / Popular
				</a>
				<a
					className={`tab text-lg ${view === "favorites" ? "tab-active" : ""}`}
					onClick={() => {
						setView("favorites");
					}}>
					Favorites
				</a>
			</div>
			{/* Search Bar */}
			{view === "search" && (
				<div className="w-full max-w-md mb-6">
					<SearchBar onSearch={handleSearch} />
				</div>
			)}
			{/* Loading Spinner & Error Msg */}
			{loading && <Spinner />}
			{error && <ErrorMsg message={error} />}
		</div>
	);
};

export default App;
