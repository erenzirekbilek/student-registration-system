const Card = ({ children, className = '', title, icon: Icon, subtitle, action, hover = true }) => {
  return (
    <div className={`bg-surface-800/50 backdrop-blur-sm border border-surface-700 rounded-2xl overflow-hidden transition-all duration-300 ${hover ? 'hover:bg-surface-800 hover:border-surface-600 hover:-translate-y-1 hover:shadow-soft' : ''} ${className}`}>
      {(title || Icon || action) && (
        <div className="px-6 py-4 border-b border-surface-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="w-6 h-6 text-primary-400" />}
            <div>
              {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-surface-400">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
};

export default Card;