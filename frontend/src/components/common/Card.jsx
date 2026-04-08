const Card = ({ children, className = '', title, icon: Icon, subtitle, action }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden ${className}`}>
      {(title || Icon || action) && (
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="w-6 h-6 text-indigo-400" />}
            <div>
              {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
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
