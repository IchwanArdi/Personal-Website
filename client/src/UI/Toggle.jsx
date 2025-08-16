const Toggle = ({ isOn, onToggle, className = '' }) => {
  return (
    <button onClick={onToggle} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${isOn ? 'bg-slate-600' : 'bg-slate-500'} ${className}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
};

export default Toggle;
