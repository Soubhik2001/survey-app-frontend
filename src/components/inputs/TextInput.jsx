const TextInput = ({ questionText, hintText, value, onChange }) => (
  <div className="form-group">
    <label>{questionText}</label>
    <small>{hintText}</small>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="form-input"
    />
  </div>
);
export default TextInput;