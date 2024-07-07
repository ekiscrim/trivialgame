const LoadingSpinner = ({ size = "lg" }) => {
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-spinner text-success ${sizeClass}`} />;
};
export default LoadingSpinner;