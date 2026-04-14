const Skeleton = ({ variant = 'text', width, height, className = '' }) => {
  const baseClasses = 'animate-pulse bg-surface-200 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full',
    button: 'h-10 w-24',
    input: 'h-10 w-full',
    image: 'h-48 w-full',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      style={style}
    />
  );
};

export const SkeletonList = ({ count = 5, children }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{children}</div>
      ))}
    </div>
  );
};

export const SkeletonCard = ({ showImage = true }) => {
  return (
    <div className="bg-white rounded-xl border border-surface-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      {showImage && <Skeleton variant="image" />}
      <div className="flex gap-2">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
      <div className="grid gap-4 p-4 border-b border-surface-100 bg-surface-50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 p-4 border-b border-surface-50">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonForm = ({ fieldCount = 4 }) => {
  return (
    <div className="bg-white rounded-xl border border-surface-100 p-6 space-y-5">
      {Array.from({ length: fieldCount }).map((_, index) => (
        <div key={index}>
          <Skeleton variant="text" width="25%" className="mb-2" />
          <Skeleton variant="input" />
        </div>
      ))}
      <Skeleton variant="button" className="w-full mt-6" />
    </div>
  );
};

export default Skeleton;