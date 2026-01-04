import React, { useState, useEffect } from "react";
import Loading from "../Loading/Loading"; //!

const Diary = ({ user }) => {
	const [isLessons, setIsLessons] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!user?.location) return;

		const fetchEvents = () => {
			const { region, city, ed_inst } = user.location;
			const st_class = user.st_class

			fetch(
				`http://localhost:5000/lessons?region=${region}&city=${city}&ed_inst=${ed_inst}&st_class=${st_class}`
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

	const handleSave = async (e, dayIndex, lessonIndex, field) => {
		const newText = e.target.innerText;

		// создаём обновлённую копию и записываем её в state
		const updated = isLessons.map((day, dIdx) =>
			day.map((lesson, lIdx) =>
				dIdx === dayIndex && lIdx === lessonIndex
					? { ...lesson, [field]: newText }
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

	const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця"];

	if (isLoading) return <Loading text="Загрузка..." />;

	// setIsLessons(updated);
	// setIsSaving(true);

	// contentEditable={user.role === "teacher"}
	// suppressContentEditableWarning={true}
	// onBlur={(e) => handleSave(e, dayIndex, lessonIndex)}
	return (
		<div>
			<h2>
				Щоденник{" "}
				{isSaving && <span style={{ fontSize: 14 }}>(збереження...)</span>}
			</h2>

			{isLessons.map((day, index) => {
				return (
					<div className="diary" key={index}>
						<span>{days[index]}</span>
						<table>
							{day.map((lesson, lessonIndex) => {
								return (
									<tbody key={lesson.id}>
										<tr>
											<td className="numLesson">{lesson.id}</td>
											<td
												className="valueLesson"
												contentEditable={user.role === "teacher"}
												suppressContentEditableWarning={true}
												onBlur={(e) =>
													handleSave(e, index, lessonIndex, "lesson")
												}
											>
												{lesson.lesson}
											</td>
											<td
												className="valueHomework"
												contentEditable={user.role === "teacher"}
												suppressContentEditableWarning={true}
												onBlur={(e) =>
													handleSave(e, index, lessonIndex, "homework")
												}
											>
												{lesson.homework}
											</td>
										</tr>
									</tbody>
								);
							})}
						</table>
					</div>
				);
			})}
		</div>
	);
};

export default Diary;
