import { useState } from "react";

const Loginform = ({ onTogleInputAPP, onLoginSuccess }) => {
	const [isLogin, setIsLogin] = useState("");
	const [isPassword, setIsPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("http://localhost:5000/login", {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify({ login: isLogin, password: isPassword }),
		});
		if (!res.ok) {
			alert("Невдача! Перевірте логін або пароль!");
			return;
		}
		const data = await res.json();

		localStorage.setItem("token", data.token);

		const user = Object.entries(data.user).reduce((acc, [key, value]) => {
			if (key != "login" && key != "password") acc[key] = value;
			return acc;
		}, {});
		console.log(user);
		localStorage.setItem("user", JSON.stringify(user));

		onLoginSuccess(user);
		onTogleInputAPP();
	};

	return (
		<form className="loginform conteiner-col" onSubmit={handleSubmit}>
			<h2 className="р2">еЩоденник</h2>
			<span>Логін: </span>
			<input
				type="text"
				placeholder="Логін"
				value={isLogin}
				onChange={(e) => setIsLogin(e.target.value)}
			/>

			<span>Пароль: </span>
			<input
				type="password"
				placeholder="Пароль"
				value={isPassword}
				onChange={(e) => setIsPassword(e.target.value)}
			/>
			<button type="submit">Увійти</button>
		</form>
	);
};

export default Loginform;
