import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "~/components/ui/navigation-menu"




const NavBar = () => {
  return (
    <MaxWidthWrapper>
      <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
        <div className="flex h-14 items-center px-4 gap-6">
          <h1 className="text-2xl font-bold">
            OPTCG Tools
          </h1>
          <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Cards</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Card List</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Decks</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Meta Decks</NavigationMenuLink>
                    <NavigationMenuLink>Deck Lists</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tournament</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Latest Tournament Results</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div>
            other
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default NavBar