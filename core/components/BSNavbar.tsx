import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

/** A single navigation link entry. Supports up to 3 levels of nesting via `children`. */
interface MenuItem {
  /** URL the link points to. Optional when the item is a dropdown parent with no direct link. */
  href?: string;
  /** Visible label rendered in the nav. */
  label: string;
  /** When `true`, the link receives the `active` class. */
  isActive?: boolean;
  /** Nested items rendered as a dropdown (level 2) or sub-dropdown (level 3). */
  children?: MenuItem[];
}

/** Brand / logo configuration for the navbar. */
interface BrandProps {
  /** Text displayed as the brand name. */
  text: string;
  /** URL the brand name links to. */
  link: string;
  /** Additional CSS classes applied to the brand anchor. */
  cssClasses?: string;
}

/** Optional CSS class overrides for individual navbar elements. */
interface CssClasses {
  /** Classes applied to the `<nav>` element. */
  nav?: string;
  /** Classes applied to the `<ul>` list. */
  ul?: string;
  /** Classes applied to each `<li>` item. */
  li?: string;
}

/**
 * Bootstrap-compatible responsive navbar with a React-controlled toggle.
 * Supports up to 3 levels of navigation via the `children` property on `MenuItem`.
 *
 * Must be hydrated with `client:load` (or equivalent) when used inside an
 * Astro component so that the toggle button is interactive on the client.
 *
 * @example
 * ```astro
 * <BSNavbar
 *   client:load
 *   menuItems={menuItems}
 *   cssClasses={{ nav: "sticky-top shadow-sm", ul: "ms-auto" }}
 *   brand={{ text: "My Site", link: "/" }}
 * />
 * ```
 *
 * @example Nested menu items
 * ```ts
 * const menuItems = [
 *   { href: "/", label: "Home" },
 *   {
 *     label: "Docs",
 *     children: [
 *       { href: "/docs/guides/architecture", label: "Architecture" },
 *       {
 *         label: "Components",
 *         children: [
 *           { href: "/docs/components/datatb", label: "DataTb" },
 *           { href: "/docs/components/map",    label: "Map" },
 *         ],
 *       },
 *     ],
 *   },
 * ];
 * ```
 */
interface BSNavbarProps {
  /** Array of navigation items to render in the menu. */
  menuItems: MenuItem[];
  /** Optional CSS class overrides for navbar sub-elements. */
  cssClasses?: CssClasses;
  /** Optional brand / logo configuration. Omit to hide the brand area. */
  brand?: BrandProps;
}

// ---------------------------------------------------------------------------
// DropdownItem — renders an item inside a dropdown (level ≥ 2).
// When the item has children a sub-dropdown opens to the right on click.
// ---------------------------------------------------------------------------
const DropdownItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const hasChildren = !!item.children?.length;

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen]);

  if (!hasChildren) {
    return (
      <li>
        <a
          className={`dropdown-item${item.isActive ? " active" : ""}`}
          href={item.href ?? "#"}
        >
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className={`dropdown-item d-flex justify-content-between align-items-center${item.isActive ? " active" : ""}`}
        onClick={() => setIsOpen(p => !p)}
        aria-expanded={isOpen}
      >
        {item.label}
        <ChevronRight size={14} className="ms-2 flex-shrink-0" />
      </button>
      {isOpen && (
        <ul
          className="dropdown-menu show"
          style={{ position: "absolute", left: "100%", top: 0, minWidth: "12rem" }}
        >
          {item.children!.map((child, i) => (
            <DropdownItem key={child.href ?? i} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// ---------------------------------------------------------------------------
// NavItem — renders a top-level nav entry (level 1).
// When the item has children it renders as a Bootstrap dropdown.
// ---------------------------------------------------------------------------
const NavItem: React.FC<{ item: MenuItem; liClass?: string }> = ({ item, liClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const hasChildren = !!item.children?.length;

  useEffect(() => {
    if (!isOpen) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen]);

  const liBase = `nav-item${hasChildren ? " dropdown" : ""}${item.isActive ? " active" : ""}${liClass ? ` ${liClass}` : ""}`;

  if (!hasChildren) {
    return (
      <li className={liBase} ref={ref}>
        <a
          className={`nav-link${item.isActive ? " active" : ""}`}
          href={item.href ?? "#"}
        >
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li className={liBase} ref={ref}>
      <button
        type="button"
        className={`nav-link dropdown-toggle${item.isActive ? " active" : ""}`}
        onClick={() => setIsOpen(p => !p)}
        aria-expanded={isOpen}
      >
        {item.label}
      </button>
      {isOpen && (
        <ul className="dropdown-menu show">
          {item.children!.map((child, i) => (
            <DropdownItem key={child.href ?? i} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

// ---------------------------------------------------------------------------
// BSNavbar — root component
// ---------------------------------------------------------------------------
const BSNavbar: React.FC<BSNavbarProps> = ({ menuItems, cssClasses = {}, brand }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`navbar navbar-expand-md ${cssClasses.nav ?? ""}`}>
      <div className="container">
        {brand && (
          <a className={`navbar-brand ${brand.cssClasses ?? ""}`} href={brand.link}>
            {brand.text}
          </a>
        )}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          aria-controls="navbarCollapse"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} className="text-dark" /> : <Menu size={24} className="text-dark" />}
        </button>
        <div className={`collapse navbar-collapse${isOpen ? " show" : ""}`} id="navbarCollapse">
          <ul className={`navbar-nav ${cssClasses.ul ?? ""}`}>
            {menuItems.map((item, i) => (
              <NavItem key={item.href ?? i} item={item} liClass={cssClasses.li} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default BSNavbar;
