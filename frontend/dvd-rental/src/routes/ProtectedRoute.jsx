import z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast/dist";

const ProtectedRoute = () => {

	const {token, role} = useSelector()

	return (
	)
}

export default ProtectedRoute;
