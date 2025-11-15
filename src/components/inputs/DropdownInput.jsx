const DropdownInput = ({ questionText, hintText, value, options, onChange }) => (
  <div className="form-group">
    <label>{questionText}</label>
    <small>{hintText}</small>
    <select 
      value={value} 
      onChange={onChange} 
      className="form-select"
    >
      <option value="">Select an option...</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
export default DropdownInput;