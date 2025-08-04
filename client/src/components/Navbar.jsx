import React, { useEffect } from "react";
import { Menu, School, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/components/ThemeProvider";
import logoDark from "@/assets/logo-dark.png";
import { userLoggedOut } from "@/features/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  const [logoutUserApi, { data, isSuccess }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUserApi();
    dispatch(userLoggedOut());
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <header className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-gray-800 border-gray-200 fixed top-0 left-0 right-0 z-[100] text-sm">
      <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 ">
  <img
    src={logoDark}
    alt="SkillSetu Logo"
    className="h-20 w-auto object-contain "
  />
  <span className="text-3xl font-semibold text-black dark:text-white tracking-wide">
    SkillSetu
  </span>
</Link>


        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle theme={theme} setTheme={setTheme} />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 ring-blue-500">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="User"
                  />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler} className="text-red-500">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/register")}>Signup</Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNavbar user={user} logoutHandler={logoutHandler} theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// ----------------- Mobile Navbar -----------------

const MobileNavbar = ({ user, logoutHandler, theme, setTheme }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col gap-6 dark:bg-[#0A0A0A] bg-white ">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold flex justify-between items-center ">
            E-learning
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <nav className="flex flex-col gap-4 text-sm ">
          {user ? (
            <>
              <Link to="/my-learning" className="hover:text-blue-500">My Learning</Link>
              <Link to="/profile" className="hover:text-blue-500">Edit Profile</Link>
              <button onClick={logoutHandler} className="text-left text-red-500 hover:underline">Log out</button>
              {user?.role === "instructor" && (
                <SheetFooter className="mt-auto">
                  <SheetClose asChild>
                    <Button onClick={() => navigate("/admin/dashboard")} className="w-full">
                      Dashboard
                    </Button>
                  </SheetClose>
                </SheetFooter>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/register")} className="w-full">Signup</Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

// ----------------- Theme Toggle Component -----------------

const ThemeToggle = ({ theme, setTheme }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    aria-label="Toggle theme"
    className="relative "
  >
    <Sun
      className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out ${theme === "dark" ? "scale-0 -rotate-90" : "scale-100 rotate-0 text-yellow-400"}`}
    />
    <Moon
      className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out ${theme === "dark" ? "scale-100 rotate-0 text-white" : "scale-0 rotate-90"}`}
    />
    <span className="sr-only">Toggle theme</span>
  </Button>
);
