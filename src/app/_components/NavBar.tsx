'use client'
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
import { cn } from '~/lib/utils'
import Link from 'next/link'
import { useSession } from "next-auth/react"



const NavBar = () => {
  // const { data: session } = useSession()
  // if ( !session?.user) {
  //   console.log('working')
  // }
  return (
    <MaxWidthWrapper>
      <div className="sticky top-0 z-50 w-full border-b flex justify-between">
        <div className="flex h-14 items-center px-4 gap-6">
          <h1 className="text-2xl font-bold">
            <Link href="/">OPTCG Tools</Link>
          </h1>
          <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Cards</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75hfr_1fr]">
                      <ListItem href="/cards" title="Card List">List of all OPTCG cards</ListItem>
                      <ListItem href="/price-watch" title="Price Watch">Keep an eye on OPTCG card price trends</ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Decks</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75hfr_1fr]">
                      <ListItem href="/meta-decks" title="Meta Decks">List of all current meta deck profiles</ListItem>
                      <ListItem href="/deck-lists" title="Deck Lits">List of all public deck lists</ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tournaments</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75hfr_1fr]">
                      <ListItem href="/tournament" title="Tournament Data">List of past tournament results</ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex place-items-center">
          
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


export default NavBar