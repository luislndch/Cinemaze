import {useState} from "react";
import {useLoginMutation} from "../slices/api";
import {useNavigate} from "react-router-dom";
import z from "zod";
import toast from "react-hot-toast";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "password must be at least 6 characters"),
});

export default function LoginForm(){

	const [formData, setFormData] = useState({email: "", password: ""});
	const [errors, setErrors] = useState({});
	const [login, {isLoading}] = useLoginMutation();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		//validate with zod
		const result = loginSchema.safeParse(formData);
		if(!result.success){
			const formattedErrors = result.error.format();
			setErrors({
				email: formattedErrors.email?._errors[0],
				password: formattedErrors.password?._errors[0]
			});

			return
		}

		// clear errors and attempt login
		setErrors({});

		try{
			await login(formData).unwrap();
			toast.success("welcome back!");
			navigate("/");
		}catch(error){
			toast.error(err.data?.message || "Login Failed")
		}
	}

	return (
		<div className={"max-w-md mx-auto mt-20 p-6 bg-white rounded-lg "+
			"shadow-md border border-gray-100"}>
			<h2 className="text-2xl font-bold mb-6 text-gray-800">
				Login to DVD Rental
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="black text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							className={
								`w-full p-2 border rounded rounded mt-1 
								${
									errors.email ?
									'border-red-500' :
									'border-gray-300'
								}
							`}
							onChange={(e) => setFormData({
								...formData, 
								email: e.target.value,
							})}
						/>
						{
							errors.email &&
							<p className="text-red-500 text-xs mt-1">
								{errors.email}
							</p>
						}
					</div>
				</form>
			</h2>
		</div>
	);
}
