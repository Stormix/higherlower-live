import { useAuthQuery } from "@/lib/client/auth.query";
import { LuSettings } from "react-icons/lu";

const Navbar = () => {
  const user = useAuthQuery();
  return (
    <div className="flex items-center justify-between px-6 py-3 border-2 rounded-lg border-border">
      <p className="text-sm uppercase">
        Connected as <span className="text-primary">{user?.name}</span>
      </p>

      <LuSettings className="w-6 h-6" />
    </div>
  );
};

export default Navbar;
