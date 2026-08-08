export default function FixedLayout() {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-gray-100">
        {/* Sidebar - fixed width */}
        <div className="w-64 min-w-[16rem] bg-white h-screen shadow-sm flex-shrink-0 overflow-y-auto border-r border-gray-200 z-10">
          {/* Sidebar content remains the same */}
        </div>
  
        {/* Main content area - KEY FIX: use flex-col to stack header and content vertically */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - KEY FIX: w-full ensures it takes full width of parent container */}
          <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Residents of the Society</h1>
            <div className="flex items-center">
              <span className="mr-2">User</span>
              <span>👤</span>
            </div>
          </header>
  
          {/* Content area - scrollable */}
          <main className="flex-1 overflow-y-auto p-6">{/* Your main content here */}</main>
        </div>
      </div>
    )
  }
  
  