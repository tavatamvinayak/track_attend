"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Map, MapPinned } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";

export default function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="">
      <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default bg-white">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          ><MapPinned />
            <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
               Track Attend
            </span>
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {isAuthenticated ? (
              <button
                type="button"
                className="flex text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
              >
                <span className="sr-only">Open user menu</span>
                <IoPersonCircleOutline size={30} />
              </button>
            ) : (
              <Link href={"/auth/login"}>
                <button
                  type="button"
                  className="flex text-sm bg-neutral-primary px-5 py-2 border cursor-pointer rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary     hover:bg-black hover:text-white transition duration-600 ease-in-out"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <p>Login</p>
                </button>
              </Link>
            )}
          </div>

        </div>
      </nav>
    </div>
  );
}
