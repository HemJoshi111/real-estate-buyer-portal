import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  Home,
  LogOut,
  RefreshCw,
  X,
} from "lucide-react";
import { api } from "../api/api";
import { useAuth } from "../hooks/useAuth";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });
  const [pendingPropertyId, setPendingPropertyId] = useState("");
  const [activeMenu, setActiveMenu] = useState("home");

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, visible: true });
  }, []);

  const favoriteIds = useMemo(() => {
    return new Set(
      favorites.map((favorite) => favorite?.property?._id).filter(Boolean),
    );
  }, [favorites]);

  const loadDashboard = useCallback(async () => {
    try {
      const [allProperties, myFavorites] = await Promise.all([
        api.getProperties(),
        api.getMyFavorites(token),
      ]);

      setProperties(allProperties || []);
      setFavorites(myFavorites || []);
    } catch (loadError) {
      showToast(loadError.message || "Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (!toast.message || !toast.visible) {
      return undefined;
    }

    const hideTimer = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);

    const clearTimer = setTimeout(() => {
      setToast((prev) => ({ ...prev, message: "" }));
    }, 3500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [toast.message, toast.visible]);

  const onToggleFavorite = async (propertyId) => {
    if (!token) return;

    setPendingPropertyId(propertyId);

    try {
      const result = await api.toggleFavorite({ propertyId }, token);
      const isFavorited = result?.isFavorited;

      setFavorites((previous) => {
        if (isFavorited) {
          const property = properties.find((item) => item._id === propertyId);
          if (!property) return previous;

          const alreadyExists = previous.some(
            (item) => item?.property?._id === propertyId,
          );
          if (alreadyExists) return previous;

          return [
            ...previous,
            {
              _id: result?.favorite?._id || `temp-${propertyId}`,
              property,
            },
          ];
        }

        return previous.filter((item) => item?.property?._id !== propertyId);
      });

      showToast(result?.message || "Updated favourites", "success");
    } catch (toggleError) {
      showToast(toggleError.message || "Could not update favourites", "error");
    } finally {
      setPendingPropertyId("");
    }
  };

  const onLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const favoriteProperties = favorites
    .map((favorite) => favorite.property)
    .filter(Boolean);

  const menuItems = [
    {
      key: "home",
      label: "Home",
      icon: Home,
      count: properties.length,
    },
    {
      key: "favorites",
      label: "My Favorites",
      icon: Heart,
      count: favoriteProperties.length,
    },
  ];

  useEffect(() => {
    document.title = "EstateHub | Dashboard";
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-amber-50 p-6">
        <div className="max-w-6xl mx-auto text-slate-700 font-medium">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(160deg,#fffef9,#f8fafc_55%,#ecfeff)]">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur px-4 py-2.5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Buyer Workspace
            </p>
            <h1 className="text-[1.7rem] font-semibold text-slate-900 leading-tight mt-0.5">
              Welcome back, {user?.name || "Guest"}
            </h1>
            <div className="mt-1.5">
              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 border border-amber-200">
                Role: {user?.role || "Buyer"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadDashboard();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[90] pointer-events-none max-w-xs sm:max-w-sm">
        <div
          className={`${toast.message && toast.visible ? "pointer-events-auto" : "pointer-events-none"} w-full rounded-2xl border p-3 shadow-lg transition-all duration-300 ${
            toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          } ${
            toast.message
              ? toast.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
              : "opacity-0 -translate-y-2"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            {toast.type === "error" ? (
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            )}
            <p className="text-sm font-medium leading-snug flex-1">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="rounded-md p-1 hover:bg-black/5"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6 space-y-6">
        <div className="grid lg:grid-cols-[240px_1fr] gap-4 sm:gap-5">
          <aside className="rounded-2xl bg-white border border-slate-200 p-3 h-fit lg:sticky lg:top-[168px] flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
            <p className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500 font-semibold whitespace-nowrap\">
              Menu
            </p>
            <nav className="flex lg:flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveMenu(item.key)}
                    className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 ${item.key === "favorites" && isActive ? "fill-current" : ""}`}
                      />
                      {item.label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section>
            {activeMenu === "favorites" ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-rose-600" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    My Favorites
                  </h2>
                  <span className="text-sm text-slate-500">
                    ({favoriteProperties.length})
                  </span>
                </div>

                {favoriteProperties.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-slate-200 p-5">
                    <p className="text-sm text-slate-600">
                      You have not liked any properties yet. Visit Home and tap
                      the heart icon to add favorites.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {favoriteProperties.map((property) => (
                      <PropertyCard
                        key={`fav-${property._id}`}
                        property={property}
                        isFavorited
                        onToggleFavorite={onToggleFavorite}
                        pending={pendingPropertyId === property._id}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Home
                </h2>
                {properties.length === 0 ? (
                  <div className="rounded-2xl bg-white border border-slate-200 p-5">
                    <p className="text-sm text-slate-600">
                      No properties available yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        isFavorited={favoriteIds.has(property._id)}
                        onToggleFavorite={onToggleFavorite}
                        pending={pendingPropertyId === property._id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
