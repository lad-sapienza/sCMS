import React, { useState } from "react";
import { Menu, X } from "lucide-react";

/** A single navigation link entry. */
interface MenuItem {
  /** URL the link points to. */
  href: string;
  /** Visible label rendered in the nav. */
  label: string;
  /** When `true`, the link receives the `active` class. */
  isActive?: boolean;
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
 */
interface BSNavbarProps {
  /** Array of navigation items to render in the menu. */
  menuItems: MenuItem[];
  /** Optional CSS class overrides for navbar sub-elements. */
  cssClasses?: CssClasses;
  /** Optional brand / logo configuration. Omit to hide the brand area. */
  brand?: BrandProps;
}

const BSNavbar: React.FC<BSNavbarProps> = ({ menuItems, cssClasses = {}, brand }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

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
          onClick={handleToggle}
          aria-controls="navbarCollapse"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} className="text-dark" /> : <Menu size={24} className="text-dark" />}
        </button>
        <div className={`collapse navbar-collapse${isOpen ? " show" : ""}`} id="navbarCollapse">
          <ul className={`navbar-nav ${cssClasses.ul ?? ""}`}>
            {menuItems.map(item => (
              <li className={`nav-item ${cssClasses.li ?? ""}`} key={item.href}>
                <a
                  className={`nav-link ${item.isActive ? "active" : ""}`}
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default BSNavbar;
