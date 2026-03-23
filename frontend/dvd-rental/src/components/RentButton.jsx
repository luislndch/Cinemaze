import {isValidElement} from "react";
import {useCreateRentalMutation} from "../slices/api"
import toast from "react-hot-toast";
import {Toaster} from "react-hot-toast";

const RentButton = ({inventory_id, movieTitle}) => {

	const [createRental, {isLoading}] = useCreateRentalMutation();

	const handleRent = async () => {
		try {
			/* Triggers the mutation
			 * The 'unwrap' helps catch errors in the 'catch' block
			 * */
			await createRental({inventory_id: inventory_id}).unwrap();

			/* success feedback */
			toast.success(`Enjoy your copy of ${movieTitle}!`, {
				duration: 4000,
				position: 'bottom-center',
				style: {background: '#333', color: '#fff'}
			});
		} catch (error) {
			toast.error(error.data?.message || "Failed to rent DVD. Try again.");
		}
	}

	return (
		<>
			<button
				onClick={handleRent}
				disabled={isLoading}
				className={"w-full bg-indigo-600 hover:bg-indigo-700 "+
				"disabled:bg-gray-400 text-white font-bold py-2 px-4"}
			>
				{isLoading ? "Processing..." : "Rent Now"}
			</button>
			<Toaster />
		</>
	)

}
