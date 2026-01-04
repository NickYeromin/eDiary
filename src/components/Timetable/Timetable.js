import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading";

const Timetable = ({ user }) => {
	const [isLessons, setIsLessons] = useState([]); // ожидаем массив дней, где каждый день — массив уроков
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!user?.location) return;

		const fetchEvents = () => {
			const { region, city, ed_inst } = user.location;
			const st_class = user.st_slass

			fetch(
				`http://localhost:5000/lessons?region=${region}&city=${city}&ed_inst=${ed_inst}&st_class=${st_class}}`
			)
				.then((res) => res.json())
				.then((data) => {
					// console.log("📦 Данные с сервера:", data);

					// Преобразуем объект с ключами ("1", "2", "3"...) в массив
					const lessonsArray = Object.values(data.lessonsDates || {});
					setIsLessons(lessonsArray);
					setIsLoading(false);
				})
				.catch((err) => {
					console.error("Ошибка загрузки:", err);
					setIsLoading(false);
				});
		};
		// Первый запрос сразу при загрузке
		fetchEvents();

		// Интервал — каждые 10 секунд
		const interval = setInterval(fetchEvents, 10000);

		// Очистка при размонтировании
		return () => clearInterval(interval);
	}, [user]);

	// сохраняем ячейку: обновляем локально и отправляем на сервер обновлённую структуру
	const handleSave = async (e, dayIndex, lessonIndex) => {
		const newText = e.target.innerText;

		// создаём обновлённую копию и записываем её в state
		const updated = isLessons.map((day, dIdx) =>
			day.map((lesson, lIdx) =>
				dIdx === dayIndex && lIdx === lessonIndex
					? { ...lesson, lesson: newText }
					: lesson
			)
		);

		setIsLessons(updated);
		setIsSaving(true);

		try {
			const res = await fetch("http://localhost:5000/lessons/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					region: user.location.region,
					city: user.location.city,
					ed_inst: user.location.ed_inst,
					st_class: user.st_class,
					updateData: { lessonsDates: updated },
				}),
			});

			if (!res.ok) {
				const text = await res.text();
				throw new Error(`Server error: ${res.status} ${text}`);
			}
		} catch (err) {
			console.error("Ошибка при сохранении:", err);
			// можно показать пользователю уведомление об ошибке
		} finally {
			setTimeout(() => setIsSaving(false), 500);
		}
	};

	if (isLoading) return <Loading text="Загрузка..." />;

	const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця"];

	function timeInterval(h, m) {
		let result = [];
		let time = h * 60 + m;

		for (let i = 0; i < 7; i++) {
			let timenew = time + 45 + (i === 2 ? 15 : 10);

			result.push({
				time: `${Math.floor(time / 60)}:${(time % 60)
					.toString()
					.padStart(2, "0")} - ${Math.floor((time + 45) / 60)}:${(
					(time + 45) %
					60
				)
					.toString()
					.padStart(2, "0")}`,
				pause: `${i === 2 ? 15 : 10}`,
			});
			time = timenew;
		}

		return result;
	}
	console.log(isLessons)
	return (
		<div className="conteiner-col">
			<h2>
				Розклад{" "}
				{isSaving && <span style={{ fontSize: 14 }}>(збереження...)</span>}
			</h2>

			<table className="timeTable">
				<thead>
					<tr>
						<td>День/Час</td>
						{timeInterval(8, 0).map((el) => (
							<React.Fragment key={el.time}>
								<td>{el.time}</td>
								<td>Перерва {el.pause} хв.</td>
							</React.Fragment>
						))}
					</tr>
				</thead>
				<tbody>
					{isLessons.map((day, dayIndex) => (
						<tr key={dayIndex}>
							<td className="dayTimeTable">
								{days[dayIndex] || `День ${dayIndex + 1}`}
							</td>
							{day.map((el, lessonIndex) => (
								<React.Fragment key={el.id ?? `${dayIndex}-${lessonIndex}`}>
									<td
										className="events"
										contentEditable={user.role === "teacher"}
										suppressContentEditableWarning={true}
										onBlur={(e) => handleSave(e, dayIndex, lessonIndex)}
									>
										{el.lesson}
									</td>
									<td>-</td>
								</React.Fragment>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<span className="eDiary_BG">eDiary</span>
		</div>
	);
};

export default Timetable;
