import { Bookmark, Heart, House, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";

const currency = new Intl.NumberFormat("ne-NP", {
  style: "currency",
  currency: "NPR",
  maximumFractionDigits: 0,
});

const PropertyCard = ({ property, isFavorited, onToggleFavorite, pending }) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFavoriteHovered, setIsModalFavoriteHovered] = useState(false);
  const displayImage = property.imageUrl || "https://via.placeholder.com/400x300?text=No+Image";

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const onEsc = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [isModalOpen]);

  return (
    <>
      <article
        className="group relative rounded-3xl overflow-visible border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        <div
        className="absolute -top-8 right-3 z-50 pointer-events-none rounded-lg bg-slate-900 text-white text-xs px-2.5 py-1.5 whitespace-nowrap transition-opacity duration-75"
        style={{ opacity: isButtonHovered ? 1 : 0 }}
      >
        {isFavorited ? "Remove from favorites" : "Add to favorites"}
      </div>

      <div className="relative overflow-hidden rounded-t-3xl">
        <img
          src={displayImage}
          alt={property.title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-slate-700 border border-white/60">
          {property.type}
        </div>
        <div className="absolute top-3 right-3 z-40">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(property._id);
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            disabled={pending}
            className={`rounded-full p-2.5 transition cursor-pointer ${
              isFavorited
                ? "bg-rose-600 text-white"
                : "bg-white/90 text-slate-700 hover:bg-white"
            } ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-label={isFavorited ? "Remove from favourites" : "Add to favourites"}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 backdrop-blur px-3 py-1.5 border border-white/70">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Price</p>
          <p className="text-base font-extrabold text-amber-700 leading-tight">{currency.format(property.price)}</p>
        </div>
      </div>

        <div className="w-full text-left p-5 space-y-3">
          <h3 className="text-[1.45rem] sm:text-[1.6rem] font-medium tracking-tight text-slate-900 leading-[1.15] break-words line-clamp-2">
          {property.title}
        </h3>
          <div className="flex items-center pt-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{property.location}</span>
          </span>
          </div>
        </div>
      </article>

      <div
        className={`fixed inset-0 z-[80] transition-opacity duration-300 ${isModalOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsModalOpen(false)}
        aria-hidden={!isModalOpen}
      >
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
        <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-6">
          <div
            onClick={(event) => event.stopPropagation()}
            className={`w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 ${isModalOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-3"}`}
          >
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img src={displayImage} alt={property.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(property._id);
                  }}
                  onMouseEnter={() => setIsModalFavoriteHovered(true)}
                  onMouseLeave={() => setIsModalFavoriteHovered(false)}
                  disabled={pending}
                  className={`rounded-full p-2.5 transition cursor-pointer ${
                    isFavorited
                      ? "bg-rose-600 text-white"
                      : "bg-white/90 text-slate-700 hover:bg-white"
                  } ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
                  aria-label={isFavorited ? "Remove from favourites" : "Add to favourites"}
                >
                  <Bookmark className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full bg-white/90 hover:bg-white p-2 text-slate-700 cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div
                className="absolute top-16 right-4 rounded-lg bg-slate-900/95 text-white text-xs px-2.5 py-1.5 whitespace-nowrap pointer-events-none transition-opacity duration-75"
                style={{ opacity: isModalFavoriteHovered ? 1 : 0 }}
              >
                {isFavorited ? "Remove from favorites" : "Add to favorites"}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight break-words">{property.title}</h2>
              </div>
            </div>

            <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
                <p className="mt-1 text-2xl font-extrabold text-amber-700">{currency.format(property.price)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Property Type</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
                  <House className="h-4 w-4" />
                  {property.type}
                </p>
              </div>
              <div className="sm:col-span-2 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Location</p>
                <p className="mt-1 text-base font-medium text-slate-900 inline-flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 shrink-0" />
                  <span>{property.location}</span>
                </p>
              </div>
              <div className="sm:col-span-2 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-1 text-base text-slate-700 leading-relaxed">{property.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;
