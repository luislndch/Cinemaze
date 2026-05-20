
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	reducerPath: 'movieapi',
	baseQuery: fetchBaseQuery({
		baseUrl: "http://localhost:5000/api",
		prepareHeaders: (headers, {getState}) => {
			const token = getState().auth.token //grab token from redux store.
			if(token){
				headers.set('authorization', `Bearer ${token}`);
			};
		}
		/* JWT prepare headers here later... */
	}),
	tagTypes: ['Movies', 'Rentals'],
	endpoints: (builder) => ({
		getMovies: builder.query({
			query: () => "/movies",
			providesTags: ['Movies'],
		}),
		createRental: builder.mutation({
			query: (newRental) => ({
				url: "/rentals",
				method: "POST",
				body: newRental,
			}),
			invalidatesTags: ["Movies", "Rentals"]
		}),
		login: builder.mutation({
			query: (credentials) => ({
				url: '/login',
				method: 'POST',
				body: credentials,
			})
		})
	})
});

export const {
	useGetMoviesQuery,
	useCreateRentalMutation,
	useLoginMutation
} = movieapi;
