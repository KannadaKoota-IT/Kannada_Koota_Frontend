import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children, title = "Admin Portal" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FCF9F8] text-[#1C1B1B]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-64 z-30 shadow-lg">
        <SidebarNav />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-64 h-full bg-[#1A1818]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 flex justify-end">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarNav />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-[#1A1818] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 text-[#F5B000]"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm font-kannada">ಕನ್ನಡ ಕೂಟ Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
