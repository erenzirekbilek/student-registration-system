import PropTypes from 'prop-types';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, error, className = '', inputClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-surface-800 border border-surface-600 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 ${
          error ? 'border-red-500 focus:ring-red-500/20' : 'hover:border-surface-500'
        } ${inputClassName}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default Input;