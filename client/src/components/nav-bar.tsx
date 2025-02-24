import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/components/ui/navigation-menu";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

import { Apple, Search, ShoppingBag } from "lucide-react";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#181818]/90 backdrop-blur-sm">
      <NavigationMenu className="max-w-full justify-between px-4 py-2">
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink href="/">
              <Apple className="h-6 w-6 text-gray-200" />
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Store Menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-200 hover:text-white">
              Store
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Shop</h4>
                  <NavigationMenuLink
                    href="/mac"
                    className="block text-lg font-medium text-gray-200 hover:text-white"
                  >
                    Mac
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href="/ipad"
                    className="block text-lg font-medium text-gray-200 hover:text-white"
                  >
                    iPad
                  </NavigationMenuLink>
                  {/* Add more shop items */}
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">
                    Quick Links
                  </h4>
                  <NavigationMenuLink
                    href="/orders"
                    className="block text-lg font-medium text-gray-200 hover:text-white"
                  >
                    Order Status
                  </NavigationMenuLink>
                  {/* Add more quick links */}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Add more navigation items */}
        </NavigationMenuList>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5 text-gray-200" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingBag className="h-5 w-5 text-gray-200" />
          </Button>
        </div>
      </NavigationMenu>

      {/* Search Panel */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#181818] p-4">
          <div className="mx-auto max-w-2xl">
            <Input
              placeholder="Search apple.com"
              className="bg-transparent text-white text-xl border-none focus-visible:ring-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
