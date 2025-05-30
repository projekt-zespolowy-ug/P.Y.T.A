"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { useGetUser } from "@/query/auth";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";

const BarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSuccess: isAuthenticated } = useGetUser();
  const tLeftTabs = useTranslations("Header.LeftTabs");
  const tHeader = useTranslations("Header");
  const { resolvedTheme } = useTheme();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger name="bar-menu-trigger">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle>
            <Image
              width={100}
              height={100}
              src={
                resolvedTheme === "dark"
                  ? "/static/pyta-white-simple.svg"
                  : "/static/pyta-black-simple.svg"
              }
              alt={tHeader("logoAlt")}
              priority
            />
          </SheetTitle>

          <div className="tabs flex flex-col">
            <ul className="flex flex-col list-none gap-2 text-lg text-start">
              <li className="hover:text-primary">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  {tLeftTabs("browseStocks")}
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link href="/portfolio" onClick={() => setIsOpen(false)}>
                    {tLeftTabs("portfolio")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </SheetHeader>
        <SheetFooter>
          <ModeToggle />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BarMenu;
