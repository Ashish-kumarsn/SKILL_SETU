import { AppWindowIcon, CodeIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLoadUserQuery,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [errors, setErrors] = useState({ signup: {}, login: {} });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const { refetch } = useLoadUserQuery();

  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const validateForm = (type) => {
    const input = type === "signup" ? signupInput : loginInput;
    let formErrors = {};

    if (!input.email) {
      formErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      formErrors.email = "Invalid email format";
    }

    if (!input.password || input.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }

    if (type === "signup") {
      if (!input.name) formErrors.name = "Name is required";
    }

    setErrors((prev) => ({ ...prev, [type]: formErrors }));
    return Object.keys(formErrors).length === 0;
  };

  const handleRegistration = async (type) => {
    if (!validateForm(type)) return;
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.");
      handleRegistration("login"); // auto-login after signup
    }
    if (registerError) {
      toast.error(registerError.data?.message || "Signup failed.");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath);
      refetch();
    }
    if (loginError) {
      toast.error(loginError.data?.message || "Login failed.");
    }
  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
    loginIsSuccess,
    registerIsSuccess,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/10">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 rounded-lg overflow-hidden">
            <TabsTrigger value="signup" className="py-2 text-white hover:bg-white/20 transition">Signup</TabsTrigger>
            <TabsTrigger value="login" className="py-2 text-white hover:bg-white/20 transition">Login</TabsTrigger>
          </TabsList>

          {/* SIGNUP TAB */}
          <TabsContent value="signup">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-white text-xl">Signup</CardTitle>
                <CardDescription className="text-gray-300">
                  Create a new account and click signup when you are done
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-gray-200">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={signupInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. Ashish"
                    className="bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.signup.name && <p className="text-sm text-red-400">{errors.signup.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-200">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Eg. Ashish@gmail.com"
                    className="bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.signup.email && <p className="text-sm text-red-400">{errors.signup.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Input
                      type={showSignupPassword ? "text" : "password"}
                      name="password"
                      value={signupInput.password}
                      onChange={(e) => changeInputHandler(e, "signup")}
                      className="bg-white/10 border border-white/20 placeholder-gray-400 text-white pr-10 focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-white hover:bg-white/10"
                    >
                      {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.signup.password && <p className="text-sm text-red-400">{errors.signup.password}</p>}
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-200">Select Role</Label>
                  <select
                    name="role"
                    value={signupInput.role}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    className="bg-white/10 border border-white/20 rounded-md p-2 text-white focus:ring-2 "
                    required
                  >
                    <option value="student" className="text-black">Student</option>
                    <option value="instructor" className="text-black">Instructor</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={registerIsLoading}
                  onClick={() => handleRegistration("signup")}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition transform shadow-lg"
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      please wait
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-white text-xl">Login</CardTitle>
                <CardDescription className="text-gray-300">
                  Login your password here. After signup, you will be logged in.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label className="text-gray-200">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Eg. Ashish@gmail.com"
                    className="bg-white/10 border border-white/20 placeholder-gray-400 text-white focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.login.email && <p className="text-sm text-red-400">{errors.login.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Input
                      type={showLoginPassword ? "text" : "password"}
                      name="password"
                      value={loginInput.password}
                      onChange={(e) => changeInputHandler(e, "login")}
                      className="bg-white/10 border border-white/20 placeholder-gray-400 text-white pr-10 focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-white hover:bg-white/10"
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.login.password && <p className="text-sm text-red-400">{errors.login.password}</p>}
                </div>
                <div className="text-right">
                  <a href="#" className="text-xs text-purple-300 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={loginIsLoading}
                  onClick={() => handleRegistration("login")}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition transform shadow-lg"
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;