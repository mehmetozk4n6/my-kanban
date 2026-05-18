"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "./AuthProvider";

export function UserMenu() {
  const { user, signOut } = useAuthContext();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        id="user-menu-btn"
        className="user-avatar-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={user.displayName ?? "User"}
            className="user-avatar-img"
          />
        ) : (
          <span className="user-avatar-initials">{initials}</span>
        )}
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-info">
            <p className="user-dropdown-name">{user.displayName}</p>
            <p className="user-dropdown-email">{user.email}</p>
          </div>
          <hr className="user-dropdown-divider" />
          <button
            id="signout-btn"
            className="user-dropdown-signout"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
}
