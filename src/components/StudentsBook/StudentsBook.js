import { useState, useEffect } from "react";
const StudentsBook = ({ user }) => {
	const [isStudents, setIsStudents] = useState([]);

	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		if (!user?.location) return;

		const fetchEvents = () => {
			const { region, city, ed_inst } = user.location;
			const role = "student";
			fetch(
				`http://localhost:5000/users/filter?region=${region}&city=${city}&ed_inst=${ed_inst}&role=${role}`
			)
				.then((res) => res.json())
				.then((data) => {
					// console.log("📦 Данные с сервера:", data);

					setIsStudents(
						data.reduce((acc, curr) => {
							if (!acc[curr.st_class]) acc[curr.st_class] = [];
							acc[curr.st_class].push(curr);
							// if(val.st_class) acc[st_class] = val
							return acc;
						}, {})
					);
				})
				.catch((err) => {
					console.error("Ошибка загрузки:", err);
					// setIsLoading(false);
				});
		};

		// Первый запрос сразу при загрузке
		fetchEvents();

		// Интервал — каждые 10 секунд
		const interval = setInterval(fetchEvents, 10000);

		// Очистка при размонтировании
		return () => clearInterval(interval);
	}, [user]);

	return (
		<div>
			➕ StudentsBook ➖{console.log(isStudents)}
			{Object.keys(isStudents).map((st_class) => (
				<div key={st_class} className="studentsBook">
					<span>{st_class}</span>
					{isStudents[st_class].map((student) => (
						<details key={student.last_name}>
							<summary>
								{student.last_name} {student.first_name}
								<span>{isOpen}</span>
							</summary>
							{
								<p className="conteiner-col">
									<span>
										Ім'я:
										<span
											contentEditable={user.role === "teacher"}
											suppressContentEditableWarning={true}
										>
											{student.first_name}
										</span>
									</span>
									<span>
										Прізвищє:
										<span
											contentEditable={user.role === "teacher"}
											suppressContentEditableWarning={true}
										>
											{student.last_name}
										</span>
									</span>
									<span>
										Логін:{" "}
										<span
											contentEditable={user.role === "teacher"}
											suppressContentEditableWarning={true}
										>
											{student.login}
										</span>
									</span>
									<span>
										Пароль:{" "}
										<span
											contentEditable={user.role === "teacher"}
											suppressContentEditableWarning={true}
										>
											{student.login}
										</span>
									</span>
									<span>
										Клас:{" "}
										<span
											contentEditable={user.role === "teacher"}
											suppressContentEditableWarning={true}
										>
											{student.st_class}
										</span>
									</span>
									<button className="blue_button">ВИДАЛИТИ УЧНЯ</button>
								</p>
							}
						</details>
					))}
				</div>
			))}
			<span className="eDiary_BG">eDiary</span>
		</div>
	);
};

export default StudentsBook;
