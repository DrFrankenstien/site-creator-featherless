"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Types
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "coffee" | "brunch" | "pastries" | "cocktails";
  tags: string[];
  image: string;
}

interface TastingItem {
  item: MenuItem;
  quantity: number;
}

interface BrewMethod {
  id: string;
  name: string;
  acidity: number;
  body: number;
  sweetness: number;
  description: string;
  technique: string;
}

// Menu Data
const MENU_ITEMS: MenuItem[] = [
  // Espresso & Coffee
  {
    id: "espresso-almarino",
    name: "Espresso Almarino",
    price: 3.5,
    description: "Double shot of our signature wood-fired Italian espresso blend, featuring notes of rich dark chocolate, toasted almond, and orange peel.",
    category: "coffee",
    tags: ["Signature", "Gluten-Free"],
    image: "/espresso.jpg",
  },
  {
    id: "sea-foam-cappuccino",
    name: "Capri Sea Foam Cappuccino",
    price: 5.0,
    description: "Espresso pulled over a hint of raw brown sugar, topped with thick, velvety microfoam and a drizzle of local organic orange blossom honey.",
    category: "coffee",
    tags: ["Signature", "Best Seller"],
    image: "/espresso.jpg",
  },
  {
    id: "amalfi-cold-brew",
    name: "Amalfi Cold Brew",
    price: 5.5,
    description: "18-hour cold-dripped specialty Arabica beans, gently infused with fresh Sorrento lemon peel and served over a hand-carved crystal ice sphere.",
    category: "coffee",
    tags: ["Vegan", "Refreshed"],
    image: "/espresso.jpg",
  },
  {
    id: "caffe-nocciola",
    name: "Caffè Nocciola",
    price: 4.5,
    description: "Double espresso layered with house-made roasted hazelnut paste from Campania, steamed milk, and a dusting of dark Dutch cocoa.",
    category: "coffee",
    tags: ["Nuts"],
    image: "/espresso.jpg",
  },

  // Coastal Brunch
  {
    id: "lobster-benedict",
    name: "Seaside Lobster Benedict",
    price: 24.0,
    description: "Two poached organic farm eggs, fresh poached local lobster claw, prosecco-infused hollandaise sauce, served on toasted house-baked brioche.",
    category: "brunch",
    tags: ["Signature", "Premium"],
    image: "/brunch.jpg",
  },
  {
    id: "avocado-crostini",
    name: "Avocado Crostini",
    price: 16.0,
    description: "Smashed Haas avocado, heirloom cherry tomatoes, wild mint, pickled red onion, drizzled with cold-pressed Sorrento lemon oil on rustic sourdough.",
    category: "brunch",
    tags: ["Vegan", "Healthy"],
    image: "/brunch.jpg",
  },
  {
    id: "caprese-baked-eggs",
    name: "Caprese Baked Eggs",
    price: 18.0,
    description: "Two eggs baked in rich San Marzano tomato marinara, fresh buffalo mozzarella, aromatic basil oil, served with toasted garlic focaccia.",
    category: "brunch",
    tags: ["Vegetarian"],
    image: "/brunch.jpg",
  },

  // Artisanal Pastries
  {
    id: "pistachio-brioche",
    name: "Pistachio Brioche",
    price: 6.5,
    description: "Flaky, multi-layered artisanal Italian brioche filled with luxurious, warm Bronte pistachio cream and dusted with powdered sugar.",
    category: "pastries",
    tags: ["Signature", "Nuts"],
    image: "/pastry.jpg",
  },
  {
    id: "sfogliatella",
    name: "Sfogliatella Riccia",
    price: 5.0,
    description: "Traditional shell-shaped crispy pastry leaves, filled with a warm sweet ricotta cream, semolina, and candied Sorrento orange peel.",
    category: "pastries",
    tags: ["Classic"],
    image: "/pastry.jpg",
  },
  {
    id: "caprese-cake",
    name: "Caprese Chocolate Cake",
    price: 8.0,
    description: "Rich, flourless dark chocolate cake made with finely ground Campanian almonds, served warm with a scoop of vanilla bean gelato.",
    category: "pastries",
    tags: ["Gluten-Free", "Nuts"],
    image: "/pastry.jpg",
  },

  // Signature Cocktails
  {
    id: "sorrento-spritz",
    name: "Sorrento Spritz",
    price: 14.0,
    description: "Artisanal Limoncello, wild basil leaves, Prosecco Superiore DOCG, soda, served over crushed ice with fresh lemon wheel garnish.",
    category: "cocktails",
    tags: ["Signature", "Alcohol"],
    image: "/brunch.jpg",
  },
  {
    id: "espresso-martini-almarino",
    name: "Espresso Martini Almarino",
    price: 15.0,
    description: "Freshly pulled Espresso Almarino, vanilla-infused vodka, Kahlúa, and a delicate splash of roasted hazelnut liqueur, shaken twice.",
    category: "cocktails",
    tags: ["Alcohol", "Nuts"],
    image: "/espresso.jpg",
  },
  {
    id: "capri-sunset-negroni",
    name: "Capri Sunset Negroni",
    price: 16.0,
    description: "Campania-infused herbaceous gin, Campari, sweet vermouth, orange bitters, smoked with dried rosemary sprig at your table.",
    category: "cocktails",
    tags: ["Alcohol"],
    image: "/brunch.jpg",
  },
];

// Brewing Methods Data
const BREW_METHODS: BrewMethod[] = [
  {
    id: "espresso",
    name: "Manual Lever Espresso",
    acidity: 60,
    body: 95,
    sweetness: 85,
    description: "Our prized hand-pulled lever espresso machine relies on pre-infusion and manually applied pressure profile to extract deep, syrupy espresso.",
    technique: "9-bar extraction using custom brass piston lever, 25-second pull, 93°C spring water.",
  },
  {
    id: "pourover",
    name: "Slow Pour-Over (Chemex)",
    acidity: 90,
    body: 40,
    sweetness: 75,
    description: "Slow gravity brewing through high-density paper filters clarifies the cup, highlighting bright citrus acidity, jasmine notes, and tea-like elegance.",
    technique: "Triple-pour method, blooming for 45s, 1:16 ratio of light-roast single origin beans.",
  },
  {
    id: "cuccumella",
    name: "Neapolitan Cuccumella",
    acidity: 35,
    body: 80,
    sweetness: 65,
    description: "The traditional gravity-flip coffee maker of Naples. It produces a dense, deeply aromatic coffee that embodies old-world Italian coffee heritage.",
    technique: "Coarse ground roasted beans brewed inside a reversible double-chamber tin pot.",
  },
];

// Testimonials Data
const TESTIMONIALS = [
  {
    quote: "Sipping the Capri Sea Foam Cappuccino on the Almarino terrace as the morning sun hit the cliffs of Capri was a spiritual experience. The pastries are out of this world.",
    author: "Elena Rostova",
    role: "Travel Writer",
  },
  {
    quote: "The manual lever espresso is crafted with a level of dedication you rarely see anymore. Rich, textured, and with the signature sea breeze—it's my favorite spot in Campania.",
    author: "Marco Silvestri",
    role: "Local Architect & Coffee Connoisseur",
  },
  {
    quote: "Outstanding seaside lobster benedict followed by the warm pistachio brioche. This cafe doesn't just feed you; it captures the essence of coastal Italy.",
    author: "Chef David Sterling",
    role: "Michelin Guide Reviewer",
  },
];

export default function Home() {
  // Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll States
  const [scrolled, setScrolled] = useState(false);

  // Menu Category
  const [activeTab, setActiveTab] = useState<"coffee" | "brunch" | "pastries" | "cocktails">("coffee");

  // Tasting Menu Planner
  const [tastingMenu, setTastingMenu] = useState<TastingItem[]>([]);
  const [showPlannerPanel, setShowPlannerPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Brewing Experience
  const [activeBrew, setActiveBrew] = useState<string>("espresso");

  // Reservation Modal State
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    guests: "2",
    zone: "Tiberius Terrace",
    name: "",
    email: "",
    phone: "",
    requests: "",
  });
  const [bookingId, setBookingId] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Testimonial state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Live Cafe Status State
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [timeString, setTimeString] = useState("");

  // Initialize Theme and Scroll Listeners
  useEffect(() => {
    // Scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Theme initialization
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setTimeout(() => {
      setDarkMode(isDark);
    }, 0);

    // Dynamic Live Status Timer
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      const isOpen = currentHour >= 7 && currentHour < 22;
      setIsOpenNow(isOpen);

      // Pretty display time
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTimeString(formattedTime);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Theme Toggler
  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Tasting Menu Planner Functions
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToTastingMenu = (item: MenuItem) => {
    const existing = tastingMenu.find((t) => t.item.id === item.id);
    if (existing) {
      setTastingMenu(
        tastingMenu.map((t) =>
          t.item.id === item.id ? { ...t, quantity: t.quantity + 1 } : t
        )
      );
    } else {
      setTastingMenu([...tastingMenu, { item, quantity: 1 }]);
    }
    showToast(`Added ${item.name} to your Tasting Menu!`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const updated = tastingMenu
      .map((t) => {
        if (t.item.id === itemId) {
          const newQty = t.quantity + delta;
          return newQty > 0 ? { ...t, quantity: newQty } : null;
        }
        return t;
      })
      .filter((t): t is TastingItem => t !== null);

    setTastingMenu(updated);
  };

  const clearTastingMenu = () => {
    setTastingMenu([]);
    showToast("Cleared tasting menu selection.");
  };

  const tastingMenuTotal = tastingMenu.reduce(
    (sum, t) => sum + t.item.price * t.quantity,
    0
  );

  const tastingMenuCount = tastingMenu.reduce((sum, t) => sum + t.quantity, 0);

  // Reservation Dialog Handlers
  const openBookingModal = (withTasting = false) => {
    setBookingStep(1);
    
    // Autofill tasting menu details if desired
    if (withTasting && tastingMenu.length > 0) {
      const summaryText = tastingMenu
        .map((t) => `${t.quantity}x ${t.item.name}`)
        .join(", ");
      setBookingForm((prev) => ({
        ...prev,
        requests: `Pre-planned Sea Tasting Menu: [${summaryText}] (~€${tastingMenuTotal.toFixed(2)})`,
      }));
    }

    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
    }
  };

  const closeBookingModal = () => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
  };

  // Dialog click handler for backdrop light-dismiss
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (e.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= e.clientY &&
        e.clientY <= rect.bottom &&
        rect.left <= e.clientX &&
        e.clientX <= rect.right;
      if (!isInside) {
        closeBookingModal();
      }
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1);
    } else {
      // Simulate booking generation
      const code = `ALM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingId(code);
      setBookingStep(4);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail("");
        setNewsletterSuccess(false);
      }, 5000);
    }
  };

  // Find active brewing details
  const brewDetails = BREW_METHODS.find((b) => b.id === activeBrew) || BREW_METHODS[0];

  return (
    <div className="flex-1 flex flex-col font-sans text-stone-900 bg-[#fbfbf9] transition-colors duration-300 dark:text-stone-100 dark:bg-zinc-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-4 rounded-xl shadow-2xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border border-gold-500/30 flex items-center gap-3 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping"></span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm border-b border-stone-200/20 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a
            href="#hero"
            className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center gap-2 group"
          >
            <span className="text-gold-500 group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </span>
            <span>
              Almarino <span className="font-light italic text-gold-600">Caffè</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#menu"
              className="text-sm font-medium hover:text-gold-600 transition-colors duration-200 relative group py-2"
            >
              The Menu
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#experience"
              className="text-sm font-medium hover:text-gold-600 transition-colors duration-200 relative group py-2"
            >
              The Experience
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#reviews"
              className="text-sm font-medium hover:text-gold-600 transition-colors duration-200 relative group py-2"
            >
              Reviews
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#location"
              className="text-sm font-medium hover:text-gold-600 transition-colors duration-200 relative group py-2"
            >
              Location
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            {/* Dark mode switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full border border-stone-200/60 dark:border-stone-800/80 bg-white/50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-850 hover:text-gold-500 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                // Sun Icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                // Moon Icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => openBookingModal(false)}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gold-500 text-stone-950 text-sm font-semibold tracking-wide hover:bg-gold-400 active:scale-95 transition-all duration-200 shadow-lg shadow-gold-500/10 cursor-pointer"
            >
              Book a Table
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-full border border-stone-200/60 dark:border-stone-800/80 bg-white/50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-850 hover:text-gold-500 transition-all duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200/20 py-8 px-6 flex flex-col gap-6 md:hidden shadow-xl animate-fade-in-up">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif font-bold text-stone-800 dark:text-stone-200 hover:text-gold-500 transition-colors"
            >
              The Menu
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif font-bold text-stone-800 dark:text-stone-200 hover:text-gold-500 transition-colors"
            >
              The Experience
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif font-bold text-stone-800 dark:text-stone-200 hover:text-gold-500 transition-colors"
            >
              Reviews
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif font-bold text-stone-800 dark:text-stone-200 hover:text-gold-500 transition-colors"
            >
              Location
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal(false);
              }}
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-gold-500 text-stone-955 text-sm font-bold tracking-wide hover:bg-gold-400 active:scale-95 transition-all shadow-lg shadow-gold-500/10 cursor-pointer"
            >
              Book a Table
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Almarino Cafe Seaside Terrace view of the Mediterranean"
            fill
            priority
            className="object-cover scale-105 animate-[subtle-zoom_20s_ease-out_infinite]"
            sizes="100vw"
          />          {/* Multi-layered gradient overlay for premium look */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/60 to-transparent dark:from-black/90 dark:via-zinc-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbfbf9] via-transparent to-transparent dark:from-zinc-950" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Live Status indicator */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-up">
              <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? "bg-emerald-400" : "bg-rose-500"} relative`}>
                <span className={`absolute inset-0 w-full h-full rounded-full ${isOpenNow ? "bg-emerald-400" : "bg-rose-500"} animate-ping opacity-75`}></span>
              </span>
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                {isOpenNow ? "Open Now" : "Closed"} • Hours: 7am - 10pm • {timeString}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 animate-fade-in-up">
              Where Capri Sun Meets <br />
              <span className="italic font-light text-gold-400">Artisanal Roast</span>
            </h1>

            <p className="max-w-xl text-lg md:text-xl text-stone-200/90 leading-relaxed font-light mb-10 animate-fade-in-up">
              Savor meticulously crafted espresso and warm, hand-rolled Italian pastries on our sea-facing terrace. Experience the authentic, slow-paced luxury of the Mediterranean coast.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up">
              <a
                href="#menu"
                className="flex items-center justify-center px-8 py-4 rounded-full bg-gold-500 text-stone-950 text-base font-bold hover:bg-gold-400 active:scale-95 shadow-xl shadow-gold-500/20 transition-all duration-200"
              >
                Discover Our Menu
              </a>
              <button
                onClick={() => openBookingModal(false)}
                className="flex items-center justify-center px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-base font-semibold border border-white/20 backdrop-blur-sm active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Reserve a Terrace Table
              </button>
            </div>
          </div>

          {/* Interactive Hero Badge widget */}
          <div className="hidden lg:col-span-5 lg:flex justify-end animate-fade-in-up">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm text-white shadow-2xl relative overflow-hidden group">
              {/* Decorative light reflection */}
              <div className="absolute -top-[150%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 group-hover:top-[100%] transition-all duration-1000 ease-in-out" />
              
              <h3 className="font-serif text-2xl font-semibold mb-4 text-gold-300">Today&apos;s Special</h3>
              <p className="text-sm text-stone-200/80 leading-relaxed mb-6">
                Freshly baked Sicilian Brioche paired with cold brew whipped cream & candied citrus zest. Crafted fresh at 6:00 AM daily.
              </p>
              
              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-stone-300">
                <div>
                  <p className="font-medium text-stone-400">Available Until</p>
                  <p className="text-white font-semibold">1:30 PM or Sold Out</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-stone-400">Price</p>
                  <p className="text-gold-400 font-bold text-lg">€7.50</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 dark:text-stone-400">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-stone-400 dark:border-stone-600 flex justify-center p-1">
            <div className="w-1 h-2 bg-gold-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Weekly Highlights Carousel/Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold tracking-widest text-gold-600 uppercase mb-3 block">Bespoke Offerings</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-950 dark:text-white">
            This Week&apos;s Signature Highlights
          </h2>
          <div className="w-20 h-0.5 bg-gold-500 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-stone-200/40 dark:border-stone-800/40 shadow-md hover:shadow-xl dark:shadow-black/20 hover:-translate-y-2 transition-all duration-300 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/espresso.jpg"
                alt="Almarino Espresso"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-stone-900/90 text-gold-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                Specialty Coffee
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-serif text-2xl font-bold group-hover:text-gold-600 transition-colors duration-200">
                    Almarino Cold Foam Crema
                  </h3>
                  <span className="text-lg font-bold text-stone-900 dark:text-white">€5.50</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                  Smooth wood-roasted espresso floated on sweetened, chilled mineral milk froth, topped with finely grated dehydrated orange segments.
                </p>
              </div>
              <button
                onClick={() => addToTastingMenu(MENU_ITEMS[1])} // uses index 1
                className="w-full py-3 rounded-xl border border-gold-500/30 group-hover:border-gold-500/100 text-gold-600 group-hover:bg-gold-500 group-hover:text-stone-950 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Add to Tasting Menu
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-stone-200/40 dark:border-stone-800/40 shadow-md hover:shadow-xl dark:shadow-black/20 hover:-translate-y-2 transition-all duration-300 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/pastry.jpg"
                alt="Pistachio Brioche"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-stone-900/90 text-gold-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                Pasticceria
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-serif text-2xl font-bold group-hover:text-gold-600 transition-colors duration-200">
                    Artisanal Pistachio Brioche
                  </h3>
                  <span className="text-lg font-bold text-stone-900 dark:text-white">€6.50</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                  Warm, layered brioche dough crafted in house, filled with high-grade sweet cream from Sicilian Bronte pistachios, lightly powdered.
                </p>
              </div>
              <button
                onClick={() => addToTastingMenu(MENU_ITEMS[7])} // uses index 7
                className="w-full py-3 rounded-xl border border-gold-500/30 group-hover:border-gold-500/100 text-gold-600 group-hover:bg-gold-500 group-hover:text-stone-950 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Add to Tasting Menu
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-stone-200/40 dark:border-stone-800/40 shadow-md hover:shadow-xl dark:shadow-black/20 hover:-translate-y-2 transition-all duration-300 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <Image
                src="/brunch.jpg"
                alt="Seaside Lobster Benedict"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-stone-900/90 text-gold-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                Coastal Brunch
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-serif text-2xl font-bold group-hover:text-gold-600 transition-colors duration-200">
                    Seaside Lobster Benedict
                  </h3>
                  <span className="text-lg font-bold text-stone-900 dark:text-white">€24.00</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                  Slow-poached local lobster tail and claws, two organic soft eggs, wild fennel fronds, and rich prosecco hollandaise over buttered brioche.
                </p>
              </div>
              <button
                onClick={() => addToTastingMenu(MENU_ITEMS[4])} // uses index 4
                className="w-full py-3 rounded-xl border border-gold-500/30 group-hover:border-gold-500/100 text-gold-600 group-hover:bg-gold-500 group-hover:text-stone-950 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Add to Tasting Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Experience & Interactive Brewing Simulator */}
      <section id="experience" className="py-24 bg-stone-100 dark:bg-zinc-900/30 border-y border-stone-200/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6">
            <span className="text-xs font-extrabold tracking-widest text-gold-600 uppercase mb-3 block">Coastal Heritage</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-stone-950 dark:text-white">
              Every Extraction Tells <br />
              <span className="italic font-light text-gold-600">an Italian Story</span>
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mb-8"></div>
            
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
              Our coffee is roasted in micro-batches over seasoned cherrywood fires in the hills overlooking Mount Vesuvius. The salty coastal winds of Capri blend uniquely with the smoke during storage, yielding a low-acid bean with a naturally caramel finish.
            </p>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
              We extract utilizing manual lever machines. This demands precision from our baristas, ensuring the water temperature, pre-infusion pressure, and final flow rate align perfectly with each bean&apos;s personality.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t border-stone-200/80 dark:border-stone-800/80 pt-8 text-center sm:text-left">
              <div>
                <p className="font-serif text-3xl font-bold text-gold-600">100%</p>
                <p className="text-xs text-stone-500 uppercase font-semibold mt-1">Sustainably Sourced</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-gold-600">Cherrywood</p>
                <p className="text-xs text-stone-500 uppercase font-semibold mt-1">Slow Roasting</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-gold-600">Capri</p>
                <p className="text-xs text-stone-500 uppercase font-semibold mt-1">Terrace View</p>
              </div>
            </div>
          </div>

          {/* Right Simulator Column */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-stone-800/60 rounded-3xl p-8 shadow-xl dark:shadow-black/30">
            <h3 className="font-serif text-2xl font-bold mb-2 text-stone-900 dark:text-white">Brewing Style Simulator</h3>
            <p className="text-xs text-stone-500 mb-6">Select a traditional brewing technique to analyze its sensory footprint:</p>

            {/* Selector Buttons */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {BREW_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setActiveBrew(method.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                    activeBrew === method.id
                      ? "bg-gold-500 border-gold-500 text-stone-950 shadow-md shadow-gold-500/10"
                      : "bg-stone-50 dark:bg-zinc-800/50 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>

            {/* Sensory Progress Indicators */}
            <div className="space-y-5 mb-8">
              {/* Acidity */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  <span>Bright Acidity</span>
                  <span>{brewDetails.acidity}%</span>
                </div>
                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${brewDetails.acidity}%` }}
                  ></div>
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  <span>Body & Mouthfeel</span>
                  <span>{brewDetails.body}%</span>
                </div>
                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${brewDetails.body}%` }}
                  ></div>
                </div>
              </div>

              {/* Sweetness */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  <span>Caramelized Sweetness</span>
                  <span>{brewDetails.sweetness}%</span>
                </div>
                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${brewDetails.sweetness}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-zinc-950/60 border border-stone-200/40 dark:border-stone-800/40">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-gold-600 mb-2">Extraction Profile</h4>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-4">
                {brewDetails.description}
              </p>
              <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 flex items-start gap-1.5 border-t border-stone-200/40 dark:border-stone-800/40 pt-3">
                <span className="text-gold-500">◆</span>
                <span>{brewDetails.technique}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Menu & Custom Tasting Menu Planner */}
      <section id="menu" className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full relative">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold tracking-widest text-gold-600 uppercase mb-3 block">Il Menu</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-950 dark:text-white">
            Curated Artisanal Menu
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mt-3">
            Hand-plucked organic coffee cherries, local sea-farm ingredients, and traditional Neapolitan pastry methods.
          </p>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-6"></div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-stone-200/40 dark:border-stone-800/40 pb-6 max-w-2xl mx-auto">
          {(["coffee", "brunch", "pastries", "cocktails"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-stone-950 text-white dark:bg-white dark:text-stone-950 shadow-lg"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-900"
              }`}
            >
              {tab === "coffee" && "Coffee & Espresso"}
              {tab === "brunch" && "Coastal Brunch"}
              {tab === "pastries" && "Artisanal Pastries"}
              {tab === "cocktails" && "Seaside Cocktails"}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {MENU_ITEMS.filter((item) => item.category === activeTab).map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-905 border border-stone-200/40 dark:border-stone-800/40 hover:border-gold-500/40 transition-all duration-300 flex flex-col sm:flex-row gap-6 group shadow-sm hover:shadow-md"
            >
              {/* Item Thumbnail */}
              <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-serif text-xl font-bold text-stone-950 dark:text-white group-hover:text-gold-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-md font-bold text-gold-600">€{item.price.toFixed(2)}</span>
                  </div>

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-gold-500/10 text-gold-700 dark:text-gold-400 text-[10px] uppercase font-bold tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-stone-550 dark:text-stone-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Planner Button */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/50 flex justify-end">
                  <button
                    onClick={() => addToTastingMenu(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 hover:text-gold-750 dark:hover:text-gold-400 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Tasting Planner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tasting Menu Planner Section */}
        <div className="p-8 rounded-3xl bg-stone-950 text-white dark:bg-zinc-900 border border-gold-500/20 shadow-2xl relative overflow-hidden">
          {/* Decorative design assets */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div>
              <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-bold uppercase tracking-widest mb-3 inline-block">
                Exclusive Planner
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                Your Sea-Facing Tasting Menu
              </h3>
              <p className="text-stone-400 text-sm max-w-xl leading-relaxed">
                Build your perfect menu combination. Add coffees, brunch dishes, or signature cocktails, and instantly pre-plan your order when booking a seaside table.
              </p>
            </div>
            
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => setShowPlannerPanel(!showPlannerPanel)}
                className="px-6 py-3.5 rounded-full border border-stone-850 hover:border-gold-500/30 bg-stone-900 text-white text-sm font-semibold transition-all duration-200 cursor-pointer"
              >
                Review Planner ({tastingMenuCount})
              </button>

              <button
                disabled={tastingMenu.length === 0}
                onClick={() => openBookingModal(true)}
                className={`px-8 py-3.5 rounded-full bg-gold-500 text-stone-950 font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  tastingMenu.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gold-400 active:scale-95 shadow-lg shadow-gold-500/20"
                }`}
              >
                Book Table with this Menu
              </button>
            </div>
          </div>

          {/* Collapsible Planner Drawer */}
          {showPlannerPanel && (
            <div className="mt-8 pt-8 border-t border-stone-800 animate-fade-in-up">
              {tastingMenu.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                  <p className="text-sm">No items added to your planner yet. Sift through the menu above!</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                  {tastingMenu.map((t) => (
                    <div
                      key={t.item.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-stone-900 border border-stone-800"
                    >
                      <div>
                        <h4 className="font-semibold text-sm">{t.item.name}</h4>
                        <p className="text-xs text-gold-500 font-medium mt-0.5">€{t.item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-stone-750 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(t.item.id, -1)}
                            className="p-2 hover:bg-stone-800 text-stone-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-3 font-semibold text-sm">{t.quantity}</span>
                          <button
                            onClick={() => updateQuantity(t.item.id, 1)}
                            className="p-2 hover:bg-stone-800 text-stone-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold w-16 text-right">
                          €{(t.item.price * t.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-6 border-t border-stone-800 flex justify-between items-center text-white">
                    <button
                      onClick={clearTastingMenu}
                      className="text-xs text-stone-550 hover:text-stone-300 underline"
                    >
                      Clear Selection
                    </button>
                    <div className="text-right">
                      <span className="text-stone-400 text-xs mr-2">Estimated Total:</span>
                      <span className="text-2xl font-bold text-gold-400">€{tastingMenuTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Guest Reviews Section */}
      <section id="reviews" className="py-24 bg-stone-150 dark:bg-zinc-955 border-t border-stone-200/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-extrabold tracking-widest text-gold-600 uppercase mb-3 block">Guest Journals</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-12 text-stone-950 dark:text-white">
            Words From Our Sea Terrace
          </h2>
          
          <div className="relative px-8 md:px-16 min-h-[160px] flex items-center justify-center">
            <span className="absolute top-0 left-0 text-7xl font-serif text-gold-500/20 pointer-events-none select-none">“</span>
            <p className="text-lg md:text-2xl font-serif italic text-stone-800 dark:text-stone-250 leading-relaxed animate-fade-in-up">
              {TESTIMONIALS[currentTestimonial].quote}
            </p>
            <span className="absolute bottom-0 right-0 text-7xl font-serif text-gold-500/20 pointer-events-none select-none">”</span>
          </div>

          <div className="mt-8">
            <h4 className="font-bold text-base text-stone-900 dark:text-white">{TESTIMONIALS[currentTestimonial].author}</h4>
            <p className="text-xs text-gold-600 uppercase tracking-wider font-semibold mt-1">
              {TESTIMONIALS[currentTestimonial].role}
            </p>
          </div>

          {/* Testimonial dot controls */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  currentTestimonial === index ? "bg-gold-500 w-6" : "bg-stone-300 dark:bg-stone-700"
                }`}
                aria-label={`Go to review ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Address & Hours section */}
      <section id="location" className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left info column */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <span className="text-xs font-extrabold tracking-widest text-gold-600 uppercase mb-3 block">Benvenuti</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-stone-950 dark:text-white">
            Find Us on the Capri Cliffs
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mb-8"></div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-gold-500 mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Indirizzo</h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  Via Marina Grande, 42<br />
                  80076 Capri (NA), Campania, Italy
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-gold-500 mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Orari di Apertura</h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  Lunedì - Domenica: 7:00 AM - 10:00 PM<br />
                  <span className="text-xs text-stone-400">(Kitchen closes at 9:30 PM)</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-gold-500 mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.099.281L7.75 7.75a10 10 0 005.45 5.45l1.587-1.587a1 1 0 01.506-.24l2.2-.549a1 1 0 01.96.725V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 4V5z" />
                </svg>
              </span>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Contatti</h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  Telefono: +39 081 123 4567<br />
                  Email: ciao@almarinocaffe.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right maps/visual mockup column */}
        <div className="lg:col-span-7 h-96 w-full rounded-3xl overflow-hidden border border-stone-200/50 dark:border-stone-800/50 relative shadow-lg group">
          {/* We simulate a map with a beautiful high-fidelity visual layout */}
          <div className="absolute inset-0 bg-stone-900 z-0 overflow-hidden flex flex-col justify-between p-8 text-white">
            {/* Styled backdrop mimicking dark radar maps */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}></div>
            
            {/* Glowing Map pin overlay */}
            <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold-500 ring-8 ring-gold-500/20 border-2 border-white animate-pulse"></span>
              <div className="px-3.5 py-1.5 rounded-lg bg-stone-950 border border-gold-500/30 shadow-2xl text-xs font-bold text-gold-400 flex items-center gap-1.5">
                <span>Almarino Caffè</span>
              </div>
            </div>

            {/* Simulated UI components */}
            <div className="relative z-10 self-start bg-stone-950/90 border border-white/10 p-4 rounded-xl max-w-xs shadow-lg">
              <p className="text-xs font-bold tracking-wide uppercase text-gold-400">Capri Cliffs Marina</p>
              <h4 className="font-serif text-sm font-semibold mt-1">Via Marina Grande 42</h4>
              <p className="text-[11px] text-stone-400 mt-1.5 leading-relaxed">
                Located 5 minutes walk up from the main Marina Grande pier, along the scenic clifftop path.
              </p>
            </div>

            <div className="relative z-10 self-end bg-gold-500 text-stone-950 p-4 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gold-400 transition-colors shadow-lg pointer-events-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Get Directions via Google Maps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Dialog Modal */}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        closedby="any"
        aria-labelledby="booking-title"
        className="w-full max-w-2xl p-0 rounded-3xl border border-stone-200/50 bg-[#fbfbf9] text-stone-900 shadow-2xl dark:border-stone-800/80 dark:bg-zinc-900 dark:text-stone-100 overflow-hidden"
      >
        {/* Header bar */}
        <div className="px-8 py-6 border-b border-stone-200/40 dark:border-stone-850 flex items-center justify-between bg-stone-50 dark:bg-zinc-950">
          <h3 id="booking-title" className="font-serif text-2xl font-bold flex items-center gap-2">
            <span className="text-gold-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <span>Reserve Table</span>
          </h3>
          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Multi-step progress bar */}
        {bookingStep <= 3 && (
          <div className="bg-stone-100/50 dark:bg-zinc-950/30 px-8 py-4 border-b border-stone-200/20 flex items-center gap-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  bookingStep >= step
                    ? "bg-gold-500 text-stone-950 font-bold"
                    : "bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                }`}>
                  {step}
                </span>
                <span className={`text-xs font-medium ${
                  bookingStep >= step ? "text-stone-955 dark:text-white" : "text-stone-400"
                }`}>
                  {step === 1 && "Details"}
                  {step === 2 && "Seating"}
                  {step === 3 && "Contact"}
                </span>
                {step < 3 && <span className="flex-1 h-0.5 bg-stone-200 dark:bg-stone-800"></span>}
              </div>
            ))}
          </div>
        )}

        {/* Content & Form */}
        <form onSubmit={handleBookingSubmit} className="p-8">
          
          {/* STEP 1: General Details */}
          {bookingStep === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="guests" className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Number of Guests
                  </label>
                  <select
                    id="guests"
                    required
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-gold-500 transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} Guests</option>
                    ))}
                    <option value="9+">9+ (Group / Event)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM", "09:30 PM"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, time: t })}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all duration-200 cursor-pointer ${
                        bookingForm.time === t
                          ? "bg-gold-500 border-gold-500 text-stone-955 font-bold"
                          : "border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 hover:bg-stone-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (bookingForm.date && bookingForm.time) {
                      setBookingStep(2);
                    } else {
                      showToast("Please fill in both date and time slot.");
                    }
                  }}
                  className="px-6 py-3 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-sm font-semibold tracking-wide hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
                >
                  Continue to Seating
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Seating Zone Select */}
          {bookingStep === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                Choose Terrace/Saloon Zone
              </label>

              <div className="space-y-4">
                {[
                  {
                    name: "Tiberius Terrace",
                    desc: "Full open sea breeze, views of Mount Vesuvius and the Napoli bay. Heavily requested for sunsets.",
                    badge: "Best Sea View",
                  },
                  {
                    name: "Amalfi Saloon",
                    desc: "Indoors, air-conditioned, rich acoustic piano music. Elegant marble seating, perfect for cozy conversations.",
                    badge: "Acoustic Comfort",
                  },
                  {
                    name: "Espresso Bar Counter",
                    desc: "Direct layout facing our copper lever espresso machine. Highly engaging sensory interaction with our baristas.",
                    badge: "Engaged Baristas",
                  },
                ].map((zone) => (
                  <label
                    key={zone.name}
                    className={`flex items-start justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      bookingForm.zone === zone.name
                        ? "border-gold-500 bg-gold-500/5"
                        : "border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 hover:bg-stone-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="bookingZone"
                        value={zone.name}
                        checked={bookingForm.zone === zone.name}
                        onChange={() => setBookingForm({ ...bookingForm, zone: zone.name })}
                        className="mt-1.5 accent-gold-500"
                      />
                      <div>
                        <span className="font-serif font-bold text-base text-stone-900 dark:text-white">
                          {zone.name}
                        </span>
                        <p className="text-xs text-stone-550 dark:text-stone-450 mt-1 max-w-md">
                          {zone.desc}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-300 text-[10px] uppercase font-bold tracking-wider">
                      {zone.badge}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setBookingStep(1)}
                  className="px-6 py-3 rounded-full border border-stone-200 dark:border-stone-850 text-stone-600 hover:text-stone-900 dark:text-stone-400 text-sm font-semibold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStep(3)}
                  className="px-6 py-3 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-sm font-semibold tracking-wide hover:bg-stone-800 active:scale-95 transition-all cursor-pointer"
                >
                  Continue to Contact
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact & Request Info */}
          {bookingStep === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bookingName" className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Full Name
                  </label>
                  <input
                    id="bookingName"
                    type="text"
                    required
                    placeholder="Giuseppe Rossi"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="bookingEmail" className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Email Address
                  </label>
                  <input
                    id="bookingEmail"
                    type="email"
                    required
                    placeholder="giuseppe@email.it"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bookingPhone" className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="bookingPhone"
                    type="tel"
                    required
                    placeholder="+39 333 123 4567"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="bookingRequests" className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                    Special Requests / Sea Tasting
                  </label>
                  <textarea
                    id="bookingRequests"
                    rows={2}
                    placeholder="Allergies, wheelchair access, or celebrating a special sunset..."
                    value={bookingForm.requests}
                    onChange={(e) => setBookingForm({ ...bookingForm, requests: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Display tasting menu summary if pre-planned */}
              {tastingMenu.length > 0 && (
                <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-stone-900 dark:text-gold-100 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold">Attached Tasting Menu Plan</p>
                    <p className="text-stone-500 dark:text-stone-400 mt-0.5">{tastingMenuCount} items selected</p>
                  </div>
                  <span className="font-bold text-sm text-gold-600 dark:text-gold-400">~€{tastingMenuTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setBookingStep(2)}
                  className="px-6 py-3 rounded-full border border-stone-200 dark:border-stone-850 text-stone-600 hover:text-stone-900 dark:text-stone-400 text-sm font-semibold transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-gold-500 text-stone-950 font-bold text-sm tracking-wide hover:bg-gold-400 active:scale-95 shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS STATE */}
          {bookingStep === 4 && (
            <div className="text-center py-10 space-y-6 animate-fade-in-up">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">Grazie, {bookingForm.name}!</h3>
                <p className="text-sm text-stone-500 max-w-sm mx-auto">
                  Your table at Almarino Caffè has been reserved. A confirmation summary has been sent to {bookingForm.email}.
                </p>
              </div>

              {/* Booking Voucher details */}
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-stone-50 dark:bg-zinc-950 border border-stone-200/50 dark:border-stone-850 text-left space-y-3">
                <div className="flex justify-between text-xs border-b border-stone-200/40 dark:border-stone-850 pb-2">
                  <span className="text-stone-400 uppercase font-bold tracking-wider">Booking ID</span>
                  <span className="font-mono font-bold text-gold-600">{bookingId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400 uppercase font-bold tracking-wider">Guests</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{bookingForm.guests} Guests</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400 uppercase font-bold tracking-wider">Date & Time</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{bookingForm.date} at {bookingForm.time}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400 uppercase font-bold tracking-wider">Seating Zone</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{bookingForm.zone}</span>
                </div>
                {tastingMenu.length > 0 && (
                  <div className="flex justify-between text-xs border-t border-stone-200/40 dark:border-stone-850 pt-2 text-gold-600 dark:text-gold-400 font-bold">
                    <span>Planned Tasting Menu Value</span>
                    <span>€{tastingMenuTotal.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-8 py-3 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-sm font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Close & Explore
                </button>
              </div>
            </div>
          )}

        </form>
      </dialog>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-300 dark:bg-black border-t border-stone-900">
        
        {/* Newsletter Signup grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-b border-stone-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="font-serif text-2xl font-bold text-white mb-2">Join the Almarino Club</h4>
            <p className="text-sm text-stone-400 max-w-sm">
              Receive secret sunset invites, custom barista roasting summaries, and pastry vouchers straight to your inbox.
            </p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="px-5 py-3 rounded-full bg-stone-900 border border-stone-800 text-white text-sm focus:outline-none focus:border-gold-500 w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gold-500 text-stone-955 font-bold text-sm tracking-wide hover:bg-gold-400 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              {newsletterSuccess ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Info Columns */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-gold-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </span>
              <span>Almarino Caffè</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Meticulous extraction, wood-roasted micro-batches, and sea-view terraces. Elevating Neapolitan heritage on the shores of Capri.
            </p>
            <p className="text-xs text-stone-500">
              © {new Date().getFullYear()} Almarino Caffè. All rights reserved.
            </p>
          </div>

          {/* Site links */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-gold-500 mb-4">Navigazione</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">The Menu</a>
              </li>
              <li>
                <a href="#experience" className="hover:text-white transition-colors">The Experience</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">Guest Reviews</a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">Seaside Location</a>
              </li>
            </ul>
          </div>

          {/* Social connections */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-gold-500 mb-4">Social Network</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  TripAdvisor
                </a>
              </li>
              <li>
                <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Google Maps
                </a>
              </li>
            </ul>
          </div>

          {/* Open statement */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-gold-500 mb-4">Orari d&apos;Ufficio</h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-1">
              7:00 AM - 10:00 PM Daily
            </p>
            <p className="text-xs text-stone-550 leading-relaxed">
              Via Marina Grande, 42, 80076 Capri, Italy
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
