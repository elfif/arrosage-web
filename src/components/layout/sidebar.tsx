"use client"

import { Link, useRouterState } from "@tanstack/react-router"
import { ClipboardList, Droplets, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Statut",
    href: "/",
    icon: Droplets,
  },
  {
    name: "Journal",
    href: "/journal",
    icon: ClipboardList,
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border">
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sky-100 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-sidebar">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}