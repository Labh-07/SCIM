import { User } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar - fixed width */}
      <div className="w-64 min-w-[16rem] bg-white h-screen shadow-sm flex-shrink-0 overflow-y-auto border-r border-gray-200 z-10">
        {/* Sidebar content */}
        <div className="p-4 border-b border-gray-200">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>
        <nav className="py-4">
          {/* Navigation items */}
          <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-600">
            <span className="mr-3">📊</span>
            <span>Dashboard</span>
          </div>
          {/* Other nav items */}
        </nav>
      </div>

      {/* Main content area - takes remaining width */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - full width of content area */}
        <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Residents of the Society</h1>
          <div className="flex items-center">
            <span className="mr-2">User</span>
            <User className="h-6 w-6" />
          </div>
        </header>

        {/* Content - scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Residents of the Society
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Apartments</h3>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative w-full md:max-w-md">
                  <input
                    type="text"
                    placeholder="Search residents..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-md">
                    Block A
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-md">
                    Block B
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 py-8">
              No residents found in Block
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
