const Header = ({
	onTogleLogout,
	onTogleStudentsBook,
	onTogleAddStudent,
	onTogleEvents,
	onTogleDiary,
	onTogleTimetable,
	username,
	user,
}) => {
	return (
		<header>
			<span>{username}</span>

			<div className="buttons">
				<button onClick={onTogleTimetable}>Розклад</button>
				<button onClick={onTogleDiary}>Щоденник</button>
				<button onClick={onTogleEvents}>Заходи</button>
				{user.role === "teacher" && <span>|</span>}
				{/* {user.role === "teacher" && (
					<button onClick={onTogleStudentsBook}>Журнал</button>
				)} */}
				{user.role === "teacher" && (
					<button onClick={onTogleAddStudent}>Додати учня</button>
				)}
			</div>
			<div>
				{/* <button>Підтримка</button> */}
				<button onClick={onTogleLogout}>Вийти з аккаунта</button>
			</div>
		</header>
	);
};

export default Header;
