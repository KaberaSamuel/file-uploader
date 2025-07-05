function LoaderButton({ pending, children }) {
  return (
    <div className="loader-parent">
      {pending ? (
        <button className="loading" disabled>
          <div className="pending"></div>
        </button>
      ) : (
        children
      )}
    </div>
  );
}

export default LoaderButton;
