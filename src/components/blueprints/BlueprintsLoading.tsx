
const BlueprintsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-terminal-gray/10 border border-terminal-gray/20 rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-terminal-gray/20 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-terminal-gray/20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-terminal-gray/20 rounded w-full mb-2"></div>
          <div className="h-4 bg-terminal-gray/20 rounded w-5/6 mb-6"></div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-5 bg-terminal-gray/20 rounded w-1/5"></div>
            <div className="h-5 bg-terminal-gray/20 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlueprintsLoading;
