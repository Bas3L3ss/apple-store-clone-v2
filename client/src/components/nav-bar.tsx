"use client";

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/src/components/ui/navigation-menu";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Apple, Search, ShoppingBag, X } from "lucide-react";

const navigationItems = [
  { name: "Store", href: "" },
  { name: "Mac", href: "macbook" },
  { name: "iPad", href: "ipad" },
  { name: "iPhone", href: "iphone" },
  { name: "AirPods", href: "airpods" },
  { name: "AppleWatch", href: "apple_watch" },
  { name: "Accessories", href: "phonecase" },
  { name: "Support", href: "support" },
];

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative">
        <nav className="bg-white/80 backdrop-blur-xl ">
          <NavigationMenu className="mx-auto max-w-[1024px] flex items-center justify-center px-4 py-3">
            <NavigationMenuList className="flex-1 justify-center gap-8  ">
              <NavigationMenuItem className="flex items-center">
                <a href="/" className="flex items-center">
                  <Apple className="h-5 w-5 text-black-200" />
                </a>
              </NavigationMenuItem>

              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <a
                    href={`/shop?category=${item.href}`}
                    className="text-[12px] font-normal text-black-200 transition-colors hover:text-black/80"
                  >
                    {item.name}
                  </a>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-transparent"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  {isSearchOpen ? (
                    <X className="h-4 w-4 text-black-200" />
                  ) : (
                    <Search className="h-4 w-4 text-black-200" />
                  )}
                </Button>
              </NavigationMenuItem>

              <NavigationMenuItem className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 hover:bg-transparent"
                >
                  <ShoppingBag className="h-4 w-4 text-black-200" />
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Search Panel */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl">
            <div className="mx-auto max-w-[680px] px-4 py-12">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search apple.com"
                  className="border-none bg-transparent pl-8 text-[22px] font-normal text-white placeholder:text-gray-400 focus-visible:ring-0"
                  autoFocus
                />
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-400">
                  Quick as
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {[
                    "Visiting an Apple Store",
                    "AirPods",
                    "Apple Vision Pro",
                    "iPhone",
                    "iPad",
                    "Mac",
                  ].map((a) => (
                    <a
                      key={a}
                      href="#"
                      className="text-sm text-gray-200 hover:text-white"
                    >
                      {a}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
