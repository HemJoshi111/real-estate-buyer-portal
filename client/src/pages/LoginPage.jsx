import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const initialLogin = {
  email: "",
  password: "",
};

const initialSignup = {
  name: "",
  email: "",
  password: "",
};

const parseAuthError = (rawMessage) => {
  const message = (rawMessage || "").trim();
  const lower = message.toLowerCase();

  const items = [];

  if (
    lower.includes("user already exists") ||
    lower.includes("email already exists")
  ) {
    items.push(
      "An account with this email already exists. Please sign in instead.",
    );
  }

  if (lower.includes("invalid email or password")) {
    items.push("Email or password is incorrect.");
  }

  if (lower.includes("please add a valid email")) {
    items.push("Please enter a valid email address.");
  }

  if (lower.includes("password must be at least 8 characters")) {
    items.push("Password must be at least 8 characters long.");
  }

  if (lower.includes("password must contain")) {
    items.push(
      "Password must include uppercase, lowercase, number, and a special character.",
    );
  }

  if (lower.includes("please include all fields")) {
    items.push("Please fill in all required fields.");
  }

  if (lower.includes("please include email and password")) {
    items.push("Please enter both email and password.");
  }

  if (!items.length && message) {
    items.push(message);
  }

  if (!items.length) {
    items.push("Something went wrong. Please try again.");
  }

  return {
    title: "Could not complete your request",
    items: [...new Set(items)],
  };
};

const LoginPage = () => {
  const { isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [errorState, setErrorState] = useState(null);
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const fromPath = location.state?.from || "/dashboard";

  const title = useMemo(
    () => (mode === "login" ? "Welcome back" : "Create your account"),
    [mode],
  );

  useEffect(() => {
    document.title =
      mode === "login" ? "EstateHub | Login" : "EstateHub | Signup";
  }, [mode]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const clearAlerts = () => {
    setErrorState(null);
    setSuccess("");
  };

  const validateSignup = () => {
    if (!signupForm.name.trim()) {
      return "Name is required";
    }

    if (!signupForm.email.trim()) {
      return "Email is required";
    }

    if (signupForm.password.length < 8) {
      return "Password must be at least 8 characters";
    }

    return "";
  };

  const onSubmitLogin = async (event) => {
    event.preventDefault();
    clearAlerts();

    if (!loginForm.email.trim() || !loginForm.password) {
      setErrorState(parseAuthError("Please include email and password"));
      return;
    }

    try {
      setSubmitting(true);
      await login(loginForm);
      navigate(fromPath, { replace: true });
    } catch (submitError) {
      setErrorState(parseAuthError(submitError.message || "Login failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitSignup = async (event) => {
    event.preventDefault();
    clearAlerts();

    const validationError = validateSignup();
    if (validationError) {
      setErrorState(parseAuthError(validationError));
      return;
    }

    try {
      setSubmitting(true);
      await register(signupForm);
      setSuccess(
        "Account created successfully. Redirecting to your dashboard...",
      );
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setErrorState(
        parseAuthError(submitError.message || "Registration failed"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(251,191,36,0.2),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(14,165,233,0.18),transparent_38%),linear-gradient(145deg,#020617,#0f172a_55%,#1e293b)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-12 lg:py-20 grid lg:grid-cols-2 gap-6 sm:gap-10 items-center">
        <section className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 border border-white/20 text-sm">
            <Building2 className="h-4 w-4 text-amber-300" />
            EstateHub
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            Find homes you love, and save them in one place.
          </h1>
          <p className="text-slate-300 max-w-xl">
            Track your favourite properties, explore updated listings, and keep
            your buying journey organized.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1">
              Verified Listings
            </span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1">
              Personal favourites
            </span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1">
              Curated Homes
            </span>
          </div>
        </section>

        <section className="rounded-2xl bg-white text-slate-900 p-5 sm:p-6 md:p-8 shadow-2xl border border-slate-100">
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              className={`w-1/2 rounded-lg py-2 text-sm font-semibold transition ${isLogin ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
              onClick={() => {
                clearAlerts();
                setMode("login");
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={`w-1/2 rounded-lg py-2 text-sm font-semibold transition ${!isLogin ? "bg-white shadow text-slate-900" : "text-slate-500"}`}
              onClick={() => {
                clearAlerts();
                setMode("signup");
              }}
            >
              Sign up
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-5">{title}</h2>

          {errorState ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/90 px-3.5 py-3 text-rose-800 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{errorState.title}</p>
                  <ul className="mt-1 space-y-0.5 list-disc pl-4 text-rose-700">
                    {errorState.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
          {success ? (
            <p className="mb-4 rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
              {success}
            </p>
          ) : null}

          {isLogin ? (
            <form onSubmit={onSubmitLogin} className="space-y-3 sm:space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <div className="mt-1.5 relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 pl-9 pr-3 py-2.5 outline-none"
                    placeholder="you@email.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="mt-1.5 relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 pl-9 pr-10 py-2.5 outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={
                      showLoginPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 font-semibold transition disabled:opacity-70"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={onSubmitSignup} className="space-y-3 sm:space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Full name
                </span>
                <div className="mt-1.5 relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 pl-9 pr-3 py-2.5 outline-none"
                    placeholder="Your name"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Email
                </span>
                <div className="mt-1.5 relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 pl-9 pr-3 py-2.5 outline-none"
                    placeholder="you@email.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Password
                </span>
                <div className="mt-1.5 relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 pl-9 pr-10 py-2.5 outline-none"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={
                      showSignupPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showSignupPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Use uppercase, lowercase, number, and special character.
                </p>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 py-2.5 font-semibold transition disabled:opacity-70"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
