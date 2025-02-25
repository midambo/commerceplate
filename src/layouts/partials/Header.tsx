"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Logo from "@/components/Logo";
import NavUser from "@/components/NavUser";
import SearchBar from "@/components/SearchBar";
import config from "@/config/config.json";
import menu from "@/config/menu.json";

const CartModal = dynamic(() => import("@/layouts/components/ModalCart"), {
  ssr: false,
});

interface IChildNavigationLink {
  name: string;
  url: string;
}

interface INavigationLink {
  name: string;
  url: string;
  hasChildren?: boolean;
  children?: IChildNavigationLink[];
}

const isMenuItemActive = (menu: INavigationLink, pathname: string) => {
  return (pathname === `${menu.url}/` || pathname === menu.url) && "nav-active";
};

const renderMenuItem = (
  menu: INavigationLink,
  pathname: string,
  handleToggleChildMenu: () => void,
  showChildMenu: boolean,
) => {
  return menu.hasChildren ? (
    <li className="nav-item nav-dropdown group relative" key={menu.name}>
      <span
        className={`nav-link inline-flex items-center ${
          (menu.children?.map(({ url }) => url).includes(pathname) ||
            menu.children?.map(({ url }) => `${url}/`).includes(pathname)) &&
          "active"
        }`}
        onClick={handleToggleChildMenu}
      >
        {menu.name}
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </span>
      <ul
        className={`nav-dropdown-list ${showChildMenu ? "visible" : "hidden"}`}
      >
        {menu.children?.map((child, i) => (
          <li className="nav-dropdown-item" key={`children-${i}`}>
            <Link
              href={child.url}
              className={`nav-dropdown-link ${isMenuItemActive(child, pathname)}`}
            >
              {child.name}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  ) : (
    <li className="nav-item" key={menu.name}>
      <Link
        href={menu.url}
        className={`nav-link block ${isMenuItemActive(menu, pathname)}`}
      >
        {menu.name}
      </Link>
    </li>
  );
};

const Header: React.FC<{ children: any }> = ({ children }) => {
  const [navbarShadow, setNavbarShadow] = useState(false);
  const { main }: { main: INavigationLink[] } = menu;
  const { navigation_button, settings } = config;
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChildMenu, setShowChildMenu] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    setShowSidebar(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarShadow(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setShowChildMenu(false);
  };

  const handleToggleChildMenu = () => {
    setShowChildMenu(!showChildMenu);
  };

  return (
    <header
      className={`header z-30 ${settings.sticky_header && "sticky top-0"} ${navbarShadow ? "shadow-sm" : "shadow-none"}`}
    >
      <nav className="navbar container">
        <div className="order-0">
          <Logo />
        </div>
        <button
          className="order-1 cursor-pointer flex items-center md:hidden"
          onClick={handleToggleSidebar}
        >
          <svg className="h-6 fill-current" viewBox="0 0 20 20">
            <title>Menu Open</title>
            <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z" />
          </svg>
        </button>
        <div className="order-2 ml-auto md:order-3 md:ml-0">
          <div className="relative">
            <SearchBar />
          </div>
        </div>
        <div
          className={`order-4 md:order-1 ${
            showSidebar ? "max-h-[1000px]" : "max-h-0"
          } w-full md:w-auto md:max-h-none overflow-hidden md:flex items-center transition-all`}
        >
          <ul className="navbar-nav block w-full md:flex md:w-auto lg:space-x-2">
            {main.map((menu, i) => (
              <React.Fragment key={`menu-${i}`}>
                {renderMenuItem(
                  menu,
                  pathname,
                  handleToggleChildMenu,
                  showChildMenu,
                )}
              </React.Fragment>
            ))}
            {navigation_button.enable && (
              <li className="mt-4 inline-block lg:hidden mr-4 md:mr-6">
                <Link
                  className="btn btn-outline-primary btn-sm"
                  href={navigation_button.link}
                >
                  {navigation_button.label}
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="order-3 md:order-4">
          <div className="flex items-center gap-4">
            <Suspense fallback={children[0]}>{children[1]}</Suspense>
            {settings.account && (
              <div className="ml-4 md:ml-6">
                <NavUser />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
