const Tab = ({ title, isActive, onClick }) => {
    return (
      <button
        className={`tab ${isActive ? 'tab-active' : ''}`}
        onClick={onClick}
      >
        {title}
      </button>
    );
};

export default Tab;