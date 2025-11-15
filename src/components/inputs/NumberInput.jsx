const NumberInput = ({ questionText, hintText, value, onChange, validationRules }) => {
  const { min, max } = validationRules || {};

  return (
    <div className="form-group">
      <label>{questionText}</label>
      <small>{hintText}</small>
      <input
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="form-input"
      />
    </div>
  );
};
export default NumberInput;