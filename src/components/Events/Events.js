import React, { useState, useEffect } from "react";
const Events = ({ user }) => {
	const [isEvents, setIsEvents] = useState();
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (!user?.location) return;

		const fetchEvents = () => {
			const { region, city, ed_inst } = user.location;

			fetch(
				`http://localhost:5000/lessons?region=${region}&city=${city}&ed_inst=${ed_inst}`
			)
				.then((res) => res.json())
				.then((data) => {
					setIsEvents(data.events);
				})
				.catch((err) => {
					console.error("Ошибка:", err);
				});
		};
		// Первый запрос сразу при загрузке
		fetchEvents();

		// Интервал — каждые 10 секунд
		const interval = setInterval(fetchEvents, 1000);

		// Очистка при размонтировании
		return () => clearInterval(interval);
	}, [user]);

	const handleSave = async (e) => {
		const newText = e.target.innerText;
		setIsEvents(newText);
		setIsSaving(true);

		try {
			await fetch("http://localhost:5000/lessons/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					region: user.location.region,
					city: user.location.city,
					ed_inst: user.location.ed_inst,
					updateData: { events: newText },
				}),
			});
			setTimeout(() => setIsSaving(false), 500);
		} catch (err) {
			console.error("Ошибка при сохранении:", err);
			setIsSaving(false);
		}
	};

	return (
		<div>
			<h2>Заходи {isSaving && <span style={{ fontSize: 14 }}>(збереження...)</span>}</h2>
			<div
				className="events"
				contentEditable={user.role === "teacher"}
				suppressContentEditableWarning={true}
				onBlur={handleSave}
			>
				<li>{isEvents}</li>
			</div>
			<span className="eDiary_BG">eDiary</span>
		</div>
	);
};

export default Events;
