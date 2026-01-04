const Loading = (props) => {
	return (
		<div className="loadform">
			<div className="loading"></div>
            {props.text}...
		</div>
	);
};

export default Loading;
