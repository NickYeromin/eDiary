import { useState } from "react";

const AddStudent = ({ user }) => {
	const [isNewUser, setIsNewUser] = useState({
		first_name: "",
		last_name: "",
		login: "",
		password: "",
		st_class: "",
	});

	const [isSelectNum, setIsSelectNum] = useState("");
	const [isSelectLetter, setIsSelectLetter] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const st_class = isSelectNum + isSelectLetter;

	const addNewUser = async (e) => {
		e.preventDefault();
		const role = 'student'
		try {
			const res = await fetch("http://localhost:5000/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...isNewUser,
					st_class,
					role,
					location: user.location,
				}),
			});
			// console.log("ok");
			// console.log(user);
			setIsSaving(true);
			if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

			const data = await res.json();
			console.log("Пользователь добавлен:", data);
		} catch (err) {
			console.error("Не удалось добавить пользователя:", err);
		}
		setTimeout(() => {
			setIsSaving(false);
		}, 500);
	};

	return (
		<div className="conteiner-col">
			{isSaving && <span>Збереження...</span>}
			<form className="addNewUser" onSubmit={addNewUser}>
				<h2>Додати учня</h2>
				<span>Ім'я та Прізвище:</span>
				<input
					type="text"
					placeholder="Ім'я"
					value={isNewUser.first_name}
					onChange={(e) =>
						setIsNewUser((prev) => ({ ...prev, first_name: e.target.value }))
					}
					required
				/>

				<input
					type="text"
					placeholder="Прізвище"
					value={isNewUser.last_name}
					onChange={(e) =>
						setIsNewUser((prev) => ({
							...prev,
							last_name: e.target.value,
						}))
					}
					required 
				/>

				<span>Клас:</span>
				<div className="addNewStudent_select">
					<select
						name="student_study_class_number"
						onChange={(e) => setIsSelectNum(e.target.value)}
					>
						<option >-</option>
						<option value={1}>1</option>
						<option value={2}>2</option>
						<option value={3}>3</option>
						<option value={4}>4</option>
						<option value={5}>5</option>
						<option value={6}>6</option>
						<option value={7}>7</option>
						<option value={8}>8</option>
						<option value={9}>9</option>
						<option value={10}>10</option>
						<option value={11}>11</option>
					</select>
					<select
						name="student_study_class_leter"
						onChange={(e) => setIsSelectLetter(e.target.value)}
						required 
					>
						<option >-</option>
						<option value={"A"}>А</option>
						<option value={"Б"}>Б</option>
						<option value={"В"}>В</option>
						<option value={"Г"}>Г</option>
						<option value={"Д"}>Д</option>
					</select>
				</div>

				<span>Данні для авторизації:</span>
				<input
					type="text"
					placeholder="Логін"
					value={isNewUser.login}
					onChange={(e) =>
						setIsNewUser((prev) => ({
							...prev,
							login: e.target.value,
						}))
					}
					required 
				/>

				<input
					type="text"
					placeholder="Пароль"
					value={isNewUser.password}
					onChange={(e) =>
						setIsNewUser((prev) => ({
							...prev,
							password: e.target.value,
						}))
					}
					required 
				/>
				<button type="submit" className="gray_button">Додати</button>
			</form>
			<span className="eDiary_BG">eDiary</span>
		</div>
	);
};

export default AddStudent;
