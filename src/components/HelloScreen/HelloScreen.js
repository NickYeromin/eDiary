const HelloScreen = ({ user }) => {
	return (
		<div className="conteiner-m25">
			<span className="helloScreen_user">
				{user.first_name + " " + user.last_name}
			</span>
			<span>, вітаємо у єлектронному кабінеті !</span>
			<span className="eDiary_BG">eDiary</span>
		</div>
	);
};

export default HelloScreen;
