import { NavLink } from 'react-router-dom';
import { useUser } from '../Context/useUser';
import { Home, LayoutPanelTop, Gift, NotebookTabs } from "lucide-react";

const Nav = () => {
  const { darkMode } = useUser();

  const navItems = [
    { label: "Inicio", path: "/app-jewerly/Home", icon: Home },
    { label: "Planes", path: "/app-jewerly/Planes", icon: LayoutPanelTop },
    { label: "Items", path: "/app-jewerly/Resumen", icon: Gift },
    { label: "Historial", path: "/app-jewerly/perfil", icon: NotebookTabs },
  ];

  return (
    <nav  className={`fixed bottom-0 w-full flex justify-around pt-2 pb-2 border-t transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}
    >
      {navItems.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `
            flex flex-col items-center text-[12px] transition-all duration-300 no-underline
            ${isActive 
              ? 'text-pink-500 -translate-y-1 scale-110' 
              : (darkMode ? 'text-gray-400' : 'text-gray-500')
            }
          `}
        >
          <Icon size={22} />
          <span className="mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Nav;