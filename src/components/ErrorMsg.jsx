const ErrorMsg = ({message}) => {
	return (
		<div className="alert alert-error my-4">
			<span>{message}</span>
		</div>
	);
};

export default ErrorMsg;
