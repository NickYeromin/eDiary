import "./App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Loginform from "./components/Loginform/Loginform";
import Timetable from "./components/Timetable/Timetable";
import Diary from "./components/Diary/Diary";
import Events from "./components/Events/Events";
import Loading from "./components/Loading/Loading";
import AddStudent from "./components/AddStudent/AddStudent";
import HelloScreen from "./components/HelloScreen/HelloScreen";
import StudentsBook from "./components/StudentsBook/StudentsBook";

function App() {
	const [isLogingform, setIsLoginform] = useState(true);
	const [isHeader, setIsHeader] = useState(false);
	const [isActiveModule, setIsActiveModule] = useState(null);
	const [isLoading, setLoading] = useState(true); //!
	const [isAddStudent, setIsAddStudent] = useState(true); //!
	const [isUser, setUser] = useState(null);
	// const [isDiary, setIsDiary] = useState(false);
	// const [isTimetable, setIsTimetable] = useState(false);
	// const [isEvents, setIsEvents] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const userDates = localStorage.getItem("user");

		if (token && userDates) {
			try {
				const parsed = JSON.parse(userDates);
				setUser(parsed);
				setIsLoginform(false);
				setIsHeader(true);
			} catch (err) {
				console.log("Ошибка парсинга userDates", err);
			}
		}
		setLoading(false);
	}, []);

	const onTogleInputAPP = () => {
		setIsLoginform((prev) => !prev);
		setIsHeader((prev) => !prev);
		setIsActiveModule("helloscreen");
	};

	const onTogleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setIsLoginform(true);
		setIsHeader(false);
		setIsActiveModule(null);
	};

	if (isLoading) {
		return (
			<div className="App">
				<Loading text="Загрузка..." />
			</div>
		);
	}
	// if(!isLogingform) setIsActiveModule('helloscreen')

	// <Loading />   [x]
	// <Header />    [x]
	// <Loginform /> []
	// <Timetable /> [x]
	// <Diary/>      [x]
	return (
		<div className="App">
			{isLogingform && (
				<Loginform
					onTogleInputAPP={onTogleInputAPP}
					onLoginSuccess={(user) => {
						setUser(user);
						localStorage.setItem("user", JSON.stringify(user));
					}}
				/>
			)}
			{isHeader && (
				<Header
					username={`${isUser.role === "teacher" ? "Вчитель" : "Учень"}:  ${
						isUser.first_name
					} ${isUser.last_name}`}
					onTogleDiary={() => setIsActiveModule("diary")}
					onTogleTimetable={() => setIsActiveModule("timetable")}
					onTogleEvents={() => setIsActiveModule("events")}
					onTogleStudentsBook={() => setIsActiveModule('studentsbook')}
					onTogleAddStudent={() => setIsActiveModule("adduser")}
					onTogleLogout={onTogleLogout}
					user={isUser}
				/>
			)}
			<div className="conteiner">
				{/* {isLoading && <Loading text="Чекаю поки ти зробиш вибір"/>} */}
				{/* <Loading text="Чекаю поки ти зробиш вибір"/>  */}
				{isActiveModule === "helloscreen" && (
					<HelloScreen user={isUser}></HelloScreen>
				)}
				{isActiveModule === "timetable" && <Timetable user={isUser} />}
				{isActiveModule === "diary" && (
					<Diary user={isUser} className="diaryGeneral" />
				)}
				{isActiveModule === "events" && <Events user={isUser}></Events>}
				{isActiveModule === "studentsbook" && <StudentsBook user={isUser}></StudentsBook>} 
				{isActiveModule === "adduser" && isUser.role === "teacher" && (
					<AddStudent user={isUser}></AddStudent>
				)}
			</div>
		</div>
	);
}

export default App;
