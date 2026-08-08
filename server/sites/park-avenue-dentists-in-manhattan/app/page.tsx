"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Star,
  Award,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Smile,
  Compass,
  CheckCircle,
  Menu,
  X,
  Sun,
  Moon,
  VolumeX,
  Coffee,
  Heart,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Map
} from "lucide-react";

// Testimonials data
const testimonials = [
  {
    quote: "The level of care at Park Avenue Dentists is unparalleled. Dr. Vance was incredibly meticulous with my dental implants. From the heated blankets to the painless computerized anesthesia, the experience felt more like a spa than a clinic.",
    author: "Victoria H.",
    location: "Upper East Side, Manhattan",
    rating: 5,
    treatment: "Dental Implants"
  },
  {
    quote: "Dr. Sterling is a true artist. She redesigned my smile using ultra-thin porcelain veneers, and the results are incredibly natural. I get compliments every single day. The staff is exceptionally warm and professional.",
    author: "Julian V.",
    location: "Lenox Hill, Manhattan",
    rating: 5,
    treatment: "Porcelain Veneers"
  },
  {
    quote: "I've always had severe dental anxiety, but their sedation options and noise-canceling headphones made my treatment a breeze. The office is stunning, overlooking Park Avenue, and is impeccably clean.",
    author: "Sarah L.",
    location: "Sutton Place, Manhattan",
    rating: 5,
    treatment: "General Care & Invisalign"
  }
];

// FAQs data
const faqs = [
  {
    question: "Do you accept dental insurance?",
    answer: "We are a boutique, fee-for-service practice dedicated to providing the highest standard of personalized care. While we are out-of-network with insurance providers, our dedicated concierge team will prepare and submit all dental claims on your behalf to maximize your direct insurance reimbursement."
  },
  {
    question: "What makes your technology different?",
    answer: "We utilize the latest innovations in digital dentistry, including the iTero® 5D intraoral scanner (eliminating messy manual impressions), ultra-low-dose 3D Cone Beam CT scans, and the Wand® computerized anesthesia system, which delivers completely painless, localized injections."
  },
  {
    question: "How long does a porcelain veneer smile makeover take?",
    answer: "Typically, a complete smile design takes just two main visits. During the first visit, we design your smile, capture digital impressions, and place beautiful temporary veneers. Approximately two weeks later, you return to have your custom-fabricated, hand-finished porcelain veneers bonded."
  },
  {
    question: "Where should I park for my appointment?",
    answer: "We offer complimentary valet parking vouchers for our patients at the nearby Rapid Park garage (E 61st St between Park & Madison). Alternatively, our clinic is just a short 2-minute walk from the Lexington Av/59 St subway station (4, 5, 6, N, R, W lines) and the Lexington Av/63 St station (F, Q lines)."
  }
];

// Dental services list
const services = [
  {
    title: "Cosmetic & Veneers",
    description: "Bespoke porcelain veneers, composite bonding, and professional whitening designed to enhance your natural beauty.",
    icon: Sparkles,
    details: ["Handcrafted Porcelain Veneers", "Minimal Prep Veneers", "Laser Teeth Whitening", "Cosmetic Bonding"]
  },
  {
    title: "Implants & Restorative",
    description: "State-of-the-art titanium and zirconia implants, metal-free crowns, and full-mouth aesthetic reconstructions.",
    icon: Smile,
    details: ["Single Tooth Implants", "All-on-4® Restoration", "Zirconia & Ceramic Crowns", "Metal-Free Bridges"]
  },
  {
    title: "Invisalign® Orthodontics",
    description: "Discreetly straighten your smile with custom digital aligners, overseen by our experienced cosmetic specialists.",
    icon: Compass,
    details: ["Invisalign® Clear Aligners", "Teen & Adult Orthodontics", "Propel Accelerated Ortho", "Post-Treatment Retainers"]
  },
  {
    title: "Preventive & Holistic Care",
    description: "Comprehensive oral wellness evaluations, gentle laser hygiene, and bio-compatible materials.",
    icon: ShieldCheck,
    details: ["Micro-Ultrasonic Cleanings", "Early Cavity Detection", "Oral Cancer Screenings", "Fluoride-Free Treatments"]
  }
];

// Luxury Amenities
const amenities = [
  { icon: VolumeX, title: "Noise-Canceling", desc: "Bose headphones with your choice of music or streaming show." },
  { icon: Coffee, title: "Concierge Bar", desc: "Premium espresso, artisanal teas, and alkaline waters in our lounge." },
  { icon: Heart, title: "Comfort Menu", desc: "Heated neck pillows, cashmere blankets, and soothing aromatherapy." },
  { icon: Zap, title: "Painless Tech", desc: "Computer-controlled Wand® anesthesia and gentle lasers." }
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [faqOpen, setFaqOpen] = useState<number[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  
  // Booking form states
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Cosmetic & Veneers",
    doctor: "First Available",
    date: "",
    time: "",
    notes: ""
  });

  // Load system theme on mount
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Toggle FAQ Accordion
  const toggleFaq = (index: number) => {
    if (faqOpen.includes(index)) {
      setFaqOpen(faqOpen.filter((i) => i !== index));
    } else {
      setFaqOpen([...faqOpen, index]);
    }
  };

  // Form Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date || !bookingForm.time) {
      alert("Please fill in all required fields.");
      return;
    }
    // Generate confirmation code
    const randCode = "PA-" + Math.floor(1000 + Math.random() * 9000);
    setConfirmationCode(randCode);
    setIsBooked(true);
  };

  // Reset Booking Form
  const resetBooking = () => {
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      service: "Cosmetic & Veneers",
      doctor: "First Available",
      date: "",
      time: "",
      notes: ""
    });
    setIsBooked(false);
  };

  // Scroll to section
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Banner - Announcement */}
      <div className="bg-navy-950 text-gold-200 dark:bg-black dark:text-gold-300 py-2.5 px-4 text-center text-xs tracking-wider font-medium border-b border-gold-900/20">
        <span className="inline-block mr-2">✦</span>
        UPPER EAST SIDE’S PREMIER DIGITAL DENTAL OFFICE • ACCEPTING NEW PATIENTS
        <span className="inline-block ml-2">✦</span>
      </div>

      {/* Premium Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gold-500/10 dark:border-gold-500/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo("hero")}>
            <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-navy-900 dark:bg-gold-500 text-gold-400 dark:text-navy-950 font-serif font-bold text-lg border border-gold-400/30">
              P
              <div className="absolute inset-0 rounded-full border border-gold-400/20 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-navy-900 dark:text-gold-400">
                PARK AVENUE
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-navy-500 dark:text-zinc-400 -mt-1.5">
                Dental Specialists
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {["services", "doctors", "amenities", "testimonials", "faq", "contact"].map((sec) => (
              <button
                key={sec}
                onClick={() => scrollTo(sec)}
                className={`text-sm tracking-widest uppercase transition-colors duration-200 cursor-pointer font-medium hover:text-gold-500 ${
                  activeSection === sec ? "text-gold-500" : "text-navy-700 dark:text-zinc-300"
                }`}
              >
                {sec}
              </button>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full border border-gold-500/20 text-navy-800 dark:text-zinc-300 hover:text-gold-500 hover:border-gold-500/50 transition-all duration-200 cursor-pointer bg-gold-50/30 dark:bg-zinc-900/50"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Quick Consultation CTA */}
            <button
              onClick={() => scrollTo("booking")}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white dark:text-navy-950 bg-navy-900 dark:bg-gold-400 hover:bg-gold-600 dark:hover:bg-gold-300 transition-all duration-300 shadow-md shadow-navy-900/10 dark:shadow-none cursor-pointer"
            >
              Reserve Visit
            </button>
          </div>

          {/* Mobile Menu & Dark Mode trigger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-gold-500/20 text-navy-800 dark:text-zinc-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-navy-900 dark:text-white cursor-pointer"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 flex flex-col justify-center px-8 py-12 transition-all duration-300 animate-fade-in-up lg:hidden">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-navy-900 dark:text-white"
          >
            <X size={28} />
          </button>
          
          <div className="flex flex-col gap-6 text-center">
            {["services", "doctors", "amenities", "testimonials", "faq", "contact"].map((sec) => (
              <button
                key={sec}
                onClick={() => scrollTo(sec)}
                className="font-serif text-2xl font-semibold text-navy-900 dark:text-gold-300 hover:text-gold-500 transition-colors uppercase tracking-wider"
              >
                {sec}
              </button>
            ))}
            
            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={() => scrollTo("booking")}
                className="w-full py-4 rounded-full font-semibold uppercase tracking-widest text-white dark:text-navy-950 bg-navy-900 dark:bg-gold-400"
              >
                Request Appointment
              </button>
              <a
                href="tel:2125550190"
                className="flex items-center justify-center gap-2 text-navy-700 dark:text-zinc-300 font-medium"
              >
                <Phone size={16} /> (212) 555-0190
              </a>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-8 pb-16 md:py-24 overflow-hidden bg-gradient-to-b from-gold-50/50 to-transparent dark:from-navy-950/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 self-center lg:self-start bg-gold-100 dark:bg-gold-950/50 border border-gold-300/30 px-3.5 py-1.5 rounded-full">
              <Star className="text-gold-600 fill-gold-600" size={13} />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-800 dark:text-gold-300">
                Columbia & NYU Ivy League Credentials
              </span>
            </div>

            {/* Main Header */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-navy-900 dark:text-white text-balance">
              Bespoke Smile Design on <span className="text-gold-500 font-normal italic">Park Avenue</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-navy-700 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0 text-pretty leading-relaxed">
              Experience the pinnacle of New York dental artistry. We combine luxury comfort, advanced 3D technology, and world-class cosmetic expertise to curate your signature smile in a private, tranquil environment.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 pb-2 border-t border-b border-gold-500/10 dark:border-gold-500/5 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-serif font-bold text-gold-500">5.0 ★★★★★</span>
                <span className="text-[11px] uppercase tracking-wider text-navy-500 dark:text-zinc-400">Google Verified Reviews</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-serif font-bold text-gold-500">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-navy-500 dark:text-zinc-400">Digital / Impression-Free</span>
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col items-center lg:items-start justify-center">
                <span className="text-2xl font-serif font-bold text-gold-500">Private</span>
                <span className="text-[11px] uppercase tracking-wider text-navy-500 dark:text-zinc-400">Boutique Office Suites</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => scrollTo("booking")}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest text-white dark:text-navy-950 bg-navy-900 dark:bg-gold-400 hover:bg-gold-600 dark:hover:bg-gold-300 transition-all duration-300 shadow-lg cursor-pointer"
              >
                Schedule Private Consultation
              </button>
              <button
                onClick={() => scrollTo("services")}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest text-navy-900 dark:text-white border border-gold-500/30 hover:border-gold-500 transition-all duration-300 bg-transparent flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Services <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Hero Image / Luxury Presentation */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Visual background decor */}
            <div className="absolute -inset-4 bg-gold-400/10 dark:bg-gold-500/5 rounded-2xl blur-2xl -z-10"></div>
            
            {/* Main Picture Container */}
            <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 shadow-2xl bg-zinc-100 dark:bg-zinc-900 aspect-[3/2] lg:aspect-square xl:aspect-[3/2]">
              <Image
                src="/clinic_interior.jpg"
                alt="Park Avenue Dentists Luxury Reception Lobby"
                fill
                priority
                className="object-cover transform hover:scale-102 transition-transform duration-700"
              />
              
              {/* Image Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent"></div>

              {/* Floating Badge (Painless Technology) */}
              <div className="absolute bottom-4 left-4 right-4 bg-background/80 dark:bg-navy-950/80 backdrop-blur-md p-4 rounded-xl border border-gold-500/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-950/50 flex items-center justify-center text-gold-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold tracking-wider text-gold-800 dark:text-gold-300">
                    Same-Day Smile Upgrades
                  </h4>
                  <p className="text-[11px] text-navy-700 dark:text-zinc-400">
                    Bespoke porcelain veneers & in-office custom CAD/CAM design.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES SECTION (BENTO GRID DESIGN) */}
      <section id="services" className="py-20 border-t border-gold-500/10 dark:border-gold-500/5">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
              Areas of Esthetic Excellence
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
              Bespoke Clinical Expertise
            </h2>
            <p className="text-sm md:text-base text-navy-700 dark:text-zinc-400 text-pretty">
              Combining master dental artisanship with advanced digital protocols. We craft solutions uniquely tailored to your individual anatomy and cosmetic aspirations.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {services.map((svc, idx) => {
              const ServiceIcon = svc.icon;
              // Alternate sizes to create Bento Grid layout
              const isLarge = idx === 0 || idx === 3;
              return (
                <div
                  key={svc.title}
                  className={`group relative overflow-hidden rounded-2xl border border-gold-500/10 dark:border-gold-500/5 bg-gradient-to-b from-white to-gold-50/10 dark:from-zinc-900 dark:to-zinc-950 p-6 md:p-8 hover:border-gold-500/30 dark:hover:border-gold-500/20 hover:shadow-xl transition-all duration-300 ${
                    isLarge ? "md:col-span-7" : "md:col-span-5"
                  }`}
                >
                  {/* Decorative background glow on hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 group-hover:bg-gold-400/10 rounded-full blur-2xl transition-all duration-300"></div>

                  <div className="flex flex-col h-full justify-between gap-6">
                    <div>
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gold-100 dark:bg-gold-950/40 border border-gold-400/20 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                        <ServiceIcon size={24} />
                      </div>

                      {/* Content */}
                      <h3 className="font-serif text-2xl font-bold text-navy-900 dark:text-gold-200 mb-3 group-hover:text-gold-500 transition-colors duration-200">
                        {svc.title}
                      </h3>
                      <p className="text-sm text-navy-700 dark:text-zinc-400 leading-relaxed text-pretty mb-6">
                        {svc.description}
                      </p>
                    </div>

                    {/* Tags / Details */}
                    <div className="border-t border-gold-500/10 dark:border-gold-500/5 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {svc.details.map((detail) => (
                          <span
                            key={detail}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-gold-500/20 bg-gold-50/35 dark:bg-navy-900/30 text-navy-800 dark:text-zinc-300"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* APPOINTMENT BOOKING ENGINE */}
      <section id="booking" className="py-20 bg-gold-50/30 dark:bg-navy-950/10 border-t border-b border-gold-500/10 dark:border-gold-500/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden border border-gold-500/20 dark:border-gold-500/10 shadow-2xl bg-white dark:bg-zinc-950/80 backdrop-blur-md p-8 md:p-12">
            
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gold-400/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-400/5 rounded-full blur-3xl"></div>

            {!isBooked ? (
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8 flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-gold-600">
                    Bespoke Reservation
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-navy-900 dark:text-white">
                    Schedule Your Consultation
                  </h2>
                  <p className="text-xs md:text-sm text-navy-700 dark:text-zinc-400">
                    Reserve a private consulting suite with our elite clinical specialists.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Full Name *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={bookingForm.name}
                        onChange={handleInputChange}
                        placeholder="Johnathan Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Email Address *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={bookingForm.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={bookingForm.phone}
                        onChange={handleInputChange}
                        placeholder="(212) 555-0190"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Specialty */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="service" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Esthetic Specialty
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <Sparkles size={16} />
                      </span>
                      <select
                        id="service"
                        name="service"
                        value={bookingForm.service}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option>Cosmetic & Veneers</option>
                        <option>Implants & Restorative</option>
                        <option>Invisalign® Orthodontics</option>
                        <option>Preventive & Holistic Care</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Doctor */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="doctor" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Preferred Clinician
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <Award size={16} />
                      </span>
                      <select
                        id="doctor"
                        name="doctor"
                        value={bookingForm.doctor}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option>First Available</option>
                        <option>Dr. Alexander Vance (Implants & General)</option>
                        <option>Dr. Clara Sterling (Cosmetic Makeovers)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Consultation Date *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <Calendar size={16} />
                      </span>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={bookingForm.date}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="time" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-400">
                        <Clock size={16} />
                      </span>
                      <select
                        id="time"
                        name="time"
                        required
                        value={bookingForm.time}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select Time Slot</option>
                        <option>08:30 AM</option>
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>01:30 PM</option>
                        <option>03:00 PM</option>
                        <option>04:30 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Requests / Notes */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-navy-800 dark:text-zinc-300">
                      Medical Concierge Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={bookingForm.notes}
                      onChange={handleInputChange}
                      placeholder="Please note any specific goals or anxieties here..."
                      className="w-full px-4 py-3 rounded-xl border border-gold-500/20 dark:border-gold-500/10 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full text-xs font-semibold uppercase tracking-widest text-white dark:text-navy-950 bg-navy-900 dark:bg-gold-400 hover:bg-gold-600 dark:hover:bg-gold-300 transition-all duration-300 cursor-pointer text-center"
                    >
                      Secure Private Consultation
                    </button>
                    <p className="text-[10px] text-center text-zinc-500 dark:text-zinc-400 mt-3 tracking-wide">
                      ✦ Your reservation is subject to concierge review. We will contact you within 2 business hours.
                    </p>
                  </div>

                </form>
              </div>
            ) : (
              // Beautiful booking success panel
              <div className="relative z-10 text-center flex flex-col items-center py-6 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-gold-100 dark:bg-gold-950/50 text-gold-600 dark:text-gold-400 flex items-center justify-center mb-6 border border-gold-500/20">
                  <CheckCircle size={32} className="stroke-[1.5]" />
                </div>
                
                <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-600 mb-2">
                  Reservation Confirmed
                </span>
                
                <h3 className="font-serif text-3xl font-bold text-navy-900 dark:text-white mb-4">
                  Welcome to Park Avenue Dentists, {bookingForm.name}
                </h3>
                
                <div className="w-full max-w-md bg-gold-50/50 dark:bg-navy-900/35 border border-gold-500/10 rounded-2xl p-6 text-left flex flex-col gap-3.5 mb-8 text-sm">
                  <div className="flex justify-between border-b border-gold-500/5 pb-2">
                    <span className="text-navy-500 dark:text-zinc-400">Appointment Code</span>
                    <span className="font-mono font-bold text-gold-600">{confirmationCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/5 pb-2">
                    <span className="text-navy-500 dark:text-zinc-400">Specialty</span>
                    <span className="font-medium text-navy-900 dark:text-white">{bookingForm.service}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/5 pb-2">
                    <span className="text-navy-500 dark:text-zinc-400">Doctor</span>
                    <span className="font-medium text-navy-900 dark:text-white">{bookingForm.doctor}</span>
                  </div>
                  <div className="flex justify-between border-b border-gold-500/5 pb-2">
                    <span className="text-navy-500 dark:text-zinc-400">Date</span>
                    <span className="font-medium text-navy-900 dark:text-white">{bookingForm.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-500 dark:text-zinc-400">Time</span>
                    <span className="font-medium text-navy-900 dark:text-white">{bookingForm.time}</span>
                  </div>
                </div>

                <p className="text-xs text-navy-700 dark:text-zinc-300 max-w-md mb-8 leading-relaxed">
                  A verification email has been sent to <span className="font-semibold text-gold-600">{bookingForm.email}</span>. Our clinic coordinator will contact you shortly to coordinate medical history intakes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={resetBooking}
                    className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-white dark:text-navy-950 bg-navy-900 dark:bg-gold-400 hover:bg-gold-600 dark:hover:bg-gold-300 transition-all duration-200 cursor-pointer"
                  >
                    Schedule Another
                  </button>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest border border-gold-500/30 hover:border-gold-500 transition-all duration-200 cursor-pointer"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* MEET THE DOCTORS */}
      <section id="doctors" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
              Masters of Aesthetic Medicine
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-navy-900 dark:text-white">
              Meet Our Ivy League Dentists
            </h2>
            <p className="text-sm md:text-base text-navy-700 dark:text-zinc-400 text-pretty">
              Our clinical directors hold degrees from the nation’s top institutions and actively teach the next generation of dentists. They focus on micro-esthetic detail and gentle patient care.
            </p>
          </div>

          {/* Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            
            {/* Dr. Vance */}
            <div className="group flex flex-col gap-6 rounded-2xl border border-gold-500/10 dark:border-gold-500/5 p-6 bg-gradient-to-b from-white to-gold-50/5 dark:from-zinc-900/60 dark:to-zinc-950 hover:border-gold-500/30 dark:hover:border-gold-500/20 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-gold-500/10 shadow-lg">
                <Image
                  src="/dr_vance.jpg"
                  alt="Dr. Alexander Vance, DDS"
                  fill
                  className="object-cover transform group-hover:scale-103 transition-transform duration-700"
                />
                
                {/* Credentials Overlay on Hover */}
                <div className="absolute inset-0 bg-navy-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white gap-2.5">
                  <div className="flex items-center gap-1.5 text-gold-400">
                    <Award size={15} />
                    <span className="text-xs uppercase tracking-wider font-semibold">Columbia University DDS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    \"Every treatment should be custom, conservative, and built to last. I focus on restorative dentistry that feels like your natural teeth.\"
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-navy-900 dark:text-white">
                    Dr. Alexander Vance, DDS
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-100 dark:bg-gold-950/40 px-2.5 py-1 rounded-md">
                    Implants Specialist
                  </span>
                </div>
                <p className="text-xs uppercase tracking-widest text-navy-500 dark:text-zinc-400 font-medium">
                  Principal Dentist • 12+ Years Experience
                </p>
                <p className="text-sm text-navy-700 dark:text-zinc-300 leading-relaxed text-pretty">
                  Dr. Vance completed his dental doctorate at Columbia University and specialized in implantology. He specializes in computer-guided surgery and full-arch restorative cosmetics.
                </p>

                <div className="mt-4 pt-4 border-t border-gold-500/10 flex items-center justify-between">
                  <span className="text-xs text-navy-500 dark:text-zinc-400">Restorative / Implantology</span>
                  <button
                    onClick={() => {
                      setBookingForm((prev) => ({ ...prev, doctor: "Dr. Alexander Vance (Implants & General)" }));
                      scrollTo("booking");
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-gold-600 hover:text-gold-500 flex items-center gap-1.5 cursor-pointer"
                  >
                    Book with Dr. Vance <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dr. Sterling */}
            <div className="group flex flex-col gap-6 rounded-2xl border border-gold-500/10 dark:border-gold-500/5 p-6 bg-gradient-to-b from-white to-gold-50/5 dark:from-zinc-900/60 dark:to-zinc-950 hover:border-gold-500/30 dark:hover:border-gold-500/20 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-gold-500/10 shadow-lg">
                <Image
                  src="/dr_sterling.jpg"
                  alt="Dr. Clara Sterling, DDS"
                  fill
                  className="object-cover transform group-hover:scale-103 transition-transform duration-700"
                />
                
                {/* Credentials Overlay on Hover */}
                <div className="absolute inset-0 bg-navy-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white gap-2.5">
                  <div className="flex items-center gap-1.5 text-gold-400">
                    <Award size={15} />
                    <span className="text-xs uppercase tracking-wider font-semibold">NYU College of Dentistry</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    \"A smile transformation changes a person's life. We combine cosmetic symmetry with micro-layering porcelain techniques to match your personality.\"
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-navy-900 dark:text-white">
                    Dr. Clara Sterling, DDS
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-100 dark:bg-gold-950/40 px-2.5 py-1 rounded-md">
                    Cosmetic Specialist
                  </span>
                </div>
                <p className="text-xs uppercase tracking-widest text-navy-500 dark:text-zinc-400 font-medium">
                  Esthetic Director • Master of Esthetic Dentistry
                </p>
                <p className="text-sm text-navy-700 dark:text-zinc-300 leading-relaxed text-pretty">
                  Dr. Sterling completed her DDS at NYU and holds masterships in Esthetic Dentistry. She is a member of the American Academy of Cosmetic Dentistry and coordinates custom smile designs.
                </p>

                <div className="mt-4 pt-4 border-t border-gold-500/10 flex items-center justify-between">
                  <span className="text-xs text-navy-500 dark:text-zinc-400">Porcelain Veneers / Invisalign</span>
                  <button
                    onClick={() => {
                      setBookingForm((prev) => ({ ...prev, doctor: "Dr. Clara Sterling (Cosmetic Makeovers)" }));
                      scrollTo("booking");
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-gold-600 hover:text-gold-500 flex items-center gap-1.5 cursor-pointer"
                  >
                    Book with Dr. Sterling <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* AMENITIES & TECH SECTION */}
      <section id="amenities" className="py-20 bg-navy-950 dark:bg-black text-white relative overflow-hidden">
        {/* Light decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-900/40 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-400">
                Painless Luxury Protocols
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white leading-snug">
                Where Elite Science Meets Sanctuary
              </h2>
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed text-pretty">
                We believe that premium results start with an anxiety-free environment. We designed our Park Avenue suites to feel like a high-end wellness lounge rather than a traditional medical office.
              </p>
              
              <div className="mt-4">
                <button
                  onClick={() => scrollTo("booking")}
                  className="px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-navy-950 bg-gold-400 hover:bg-gold-300 transition-all duration-300 cursor-pointer"
                >
                  Reserve Your Suite
                </button>
              </div>
            </div>

            {/* Right Grid Column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {amenities.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-6 rounded-2xl border border-gold-500/10 bg-white/5 backdrop-blur-sm flex gap-4 hover:border-gold-500/30 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <ItemIcon size={18} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-300">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 border-b border-gold-500/10 dark:border-gold-500/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          {/* Header */}
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400 block mb-6">
            Private Word of Mouth
          </span>

          <div className="min-h-[280px] flex flex-col justify-center items-center">
            
            {/* Large Quote Mark */}
            <span className="font-serif text-8xl text-gold-300 dark:text-gold-950/60 leading-none h-10 -mt-8 select-none">
              “
            </span>

            {/* Animated Testimonial Text */}
            <div className="key={currentTestimonial} animate-fade-in-up">
              <p className="font-serif text-xl sm:text-2xl italic text-navy-900 dark:text-zinc-100 max-w-3xl mx-auto leading-relaxed mb-6">
                {testimonials[currentTestimonial].quote}
              </p>
              
              <div className="flex flex-col items-center gap-1.5">
                <span className="font-bold text-navy-900 dark:text-gold-300">
                  {testimonials[currentTestimonial].author}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-navy-500 dark:text-zinc-400">
                  {testimonials[currentTestimonial].location} • Treatment: {testimonials[currentTestimonial].treatment}
                </span>
                
                {/* 5 stars */}
                <div className="flex gap-1 mt-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="text-gold-600 fill-gold-600" size={13} />
                  ))}
                </div>
              </div>
            </div>
            
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2.5 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentTestimonial === idx
                    ? "bg-gold-500 w-6"
                    : "bg-gold-500/20 dark:bg-gold-500/10 hover:bg-gold-500/40"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              ></button>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-gold-50/20 dark:bg-navy-950/5">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-16 flex flex-col gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
              Concierge Services & Support
            </span>
            <h2 className="font-serif text-3xl font-bold text-navy-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-navy-700 dark:text-zinc-400">
              Everything you need to know about our premium fee structure, modern techniques, and clinic operations.
            </p>
          </div>

          {/* FAQ Accordions */}
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen.includes(idx);
              return (
                <div
                  key={idx}
                  className="border border-gold-500/15 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden transition-all duration-300 hover:border-gold-500/35"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left font-serif text-base md:text-lg font-bold text-navy-900 dark:text-gold-200 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className={`text-gold-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown size={20} />
                    </span>
                  </button>

                  {/* Collapse Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[300px] border-t border-gold-500/10" : "max-h-0"
                    }`}
                  >
                    <div className="p-5 md:p-6 text-xs md:text-sm text-navy-700 dark:text-zinc-400 leading-relaxed text-pretty">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CONTACT & LOCATION (ARTISTIC SVG MAP) */}
      <section id="contact" className="py-20 border-t border-gold-500/10 dark:border-gold-500/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Contact Panel */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              <div className="flex flex-col gap-3">
                <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gold-600 dark:text-gold-400">
                  Private Consultations
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 dark:text-white">
                  Visit Our Park Avenue Suite
                </h2>
                <p className="text-sm text-navy-700 dark:text-zinc-400 leading-relaxed text-pretty">
                  We are located in a secure, upscale private medical cooperative on Park Avenue. Our entrance is street-level for absolute convenience and privacy.
                </p>
              </div>

              {/* Contact details cards */}
              <div className="flex flex-col gap-4">
                
                {/* Location */}
                <div className="flex gap-4 items-start p-4 rounded-xl border border-gold-500/10 bg-gold-50/10 dark:bg-navy-900/10">
                  <div className="w-9 h-9 rounded-lg bg-gold-100 dark:bg-gold-950/40 text-gold-600 flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-semibold tracking-wider text-navy-900 dark:text-gold-300">
                      Clinic Location
                    </h4>
                    <p className="text-xs text-navy-700 dark:text-zinc-400 mt-1">
                      580 Park Avenue, Suite 1E (Cross street: 63rd St)<br />
                      New York, NY 10021
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex gap-4 items-start p-4 rounded-xl border border-gold-500/10 bg-gold-50/10 dark:bg-navy-900/10">
                  <div className="w-9 h-9 rounded-lg bg-gold-100 dark:bg-gold-950/40 text-gold-600 flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-semibold tracking-wider text-navy-900 dark:text-gold-300">
                      Telephone
                    </h4>
                    <a href="tel:2125550190" className="text-xs text-gold-600 hover:text-gold-500 font-bold block mt-1">
                      (212) 555-0190
                    </a>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex gap-4 items-start p-4 rounded-xl border border-gold-500/10 bg-gold-50/10 dark:bg-navy-900/10">
                  <div className="w-9 h-9 rounded-lg bg-gold-100 dark:bg-gold-950/40 text-gold-600 flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-semibold tracking-wider text-navy-900 dark:text-gold-300">
                      Operating Hours
                    </h4>
                    <p className="text-xs text-navy-700 dark:text-zinc-400 mt-1">
                      Monday – Thursday: 8:00 AM – 5:00 PM<br />
                      Friday: 8:00 AM – 2:00 PM<br />
                      Saturday – Sunday: By Special arrangement only
                    </p>
                  </div>
                </div>

              </div>
              
            </div>

            {/* Right Map Canvas (Bespoke Editorial SVG Map of UES NYC) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-gold-500/20 bg-gold-50/45 dark:bg-zinc-950/90 aspect-[4/3] p-4 flex flex-col justify-between shadow-lg">
                
                {/* Header tag */}
                <div className="flex justify-between items-center bg-white dark:bg-navy-950/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-gold-500/15">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600 flex items-center gap-1.5">
                    <Map size={12} /> Manhattan Upper East Side Map
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-navy-500 dark:text-zinc-400">
                    Valet Parking available
                  </span>
                </div>

                {/* SVG Vector Map */}
                <div className="flex-1 w-full relative mt-4">
                  <svg
                    viewBox="0 0 500 350"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full stroke-gold-500/20 text-navy-900/40 dark:text-zinc-400/40"
                  >
                    {/* Central Park Area */}
                    <rect
                      x="10"
                      y="10"
                      width="120"
                      height="330"
                      rx="8"
                      className="fill-zinc-200/50 dark:fill-navy-900/30 stroke-gold-500/10"
                    />
                    <text
                      x="70"
                      y="180"
                      fill="currentColor"
                      fontSize="10"
                      fontWeight="600"
                      letterSpacing="0.25em"
                      textAnchor="middle"
                      className="rotate-90 select-none opacity-60"
                    >
                      CENTRAL PARK
                    </text>

                    {/* Avenue Lines */}
                    {/* 5th Ave */}
                    <line x1="140" y1="10" x2="140" y2="340" strokeWidth="2" />
                    <text x="146" y="30" fill="currentColor" fontSize="8" className="select-none opacity-40">5th Ave</text>

                    {/* Madison Ave */}
                    <line x1="200" y1="10" x2="200" y2="340" strokeWidth="2" />
                    <text x="206" y="30" fill="currentColor" fontSize="8" className="select-none opacity-40">Madison Ave</text>

                    {/* Park Ave */}
                    <line x1="270" y1="10" x2="270" y2="340" strokeWidth="4" className="stroke-gold-500/30" />
                    <text x="278" y="30" fill="currentColor" fontSize="9" fontWeight="600" className="select-none opacity-80 text-gold-500">PARK AVE</text>

                    {/* Lexington Ave */}
                    <line x1="340" y1="10" x2="340" y2="340" strokeWidth="2" />
                    <text x="346" y="30" fill="currentColor" fontSize="8" className="select-none opacity-40">Lexington Ave</text>

                    {/* 3rd Ave */}
                    <line x1="410" y1="10" x2="410" y2="340" strokeWidth="2" />
                    <text x="416" y="30" fill="currentColor" fontSize="8" className="select-none opacity-40">3rd Ave</text>

                    {/* Street Lines */}
                    {/* 60th St */}
                    <line x1="10" y1="300" x2="490" y2="300" strokeWidth="1.5" />
                    <text x="460" y="295" fill="currentColor" fontSize="8" className="select-none opacity-40">E 60th St</text>

                    {/* 61st St */}
                    <line x1="10" y1="240" x2="490" y2="240" strokeWidth="1.5" />
                    <text x="460" y="235" fill="currentColor" fontSize="8" className="select-none opacity-40">E 61st St</text>
                    <text x="220" y="252" fill="#c5a880" fontSize="7" fontWeight="bold" className="select-none">Valet Parking ➔</text>

                    {/* 62nd St */}
                    <line x1="10" y1="180" x2="490" y2="180" strokeWidth="1.5" />
                    <text x="460" y="175" fill="currentColor" fontSize="8" className="select-none opacity-40">E 62nd St</text>

                    {/* 63rd St */}
                    <line x1="10" y1="120" x2="490" y2="120" strokeWidth="2" className="stroke-gold-500/20" />
                    <text x="460" y="115" fill="currentColor" fontSize="9" fontWeight="600" className="select-none opacity-60">E 63rd St</text>

                    {/* 64th St */}
                    <line x1="10" y1="60" x2="490" y2="60" strokeWidth="1.5" />
                    <text x="460" y="55" fill="currentColor" fontSize="8" className="select-none opacity-40">E 64th St</text>

                    {/* Metro Stations Icons */}
                    {/* 59/Lex Subway */}
                    <circle cx="340" cy="300" r="8" className="fill-gold-100 dark:fill-gold-950/60 stroke-gold-500" strokeWidth="1.5" />
                    <text x="340" y="303" fill="#c5a880" fontSize="7" fontWeight="bold" textAnchor="middle" className="select-none">M</text>
                    <text x="352" y="309" fill="currentColor" fontSize="7" className="select-none opacity-50">59 St Station (4,5,6,N,R,W)</text>

                    {/* 63/Lex Subway */}
                    <circle cx="340" cy="120" r="8" className="fill-gold-100 dark:fill-gold-950/60 stroke-gold-500" strokeWidth="1.5" />
                    <text x="340" y="123" fill="#c5a880" fontSize="7" fontWeight="bold" textAnchor="middle" className="select-none">M</text>
                    <text x="352" y="129" fill="currentColor" fontSize="7" className="select-none opacity-50">63 St Station (F,Q)</text>

                    {/* PULSING GOLD PIN (CLINIC AT 580 PARK) */}
                    {/* Coordinates: Intersection of Park Ave (270) and E 63rd St (120). 580 Park is just south of 63rd on west side: ~262, 135 */}
                    <g transform="translate(262, 135)">
                      {/* Pulse Circle */}
                      <circle cx="0" cy="0" r="16" className="fill-gold-400/20 stroke-gold-400/40" strokeWidth="1">
                        <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                      </circle>
                      {/* Solid Center */}
                      <circle cx="0" cy="0" r="5" className="fill-navy-900 dark:fill-gold-400 stroke-gold-400 dark:stroke-navy-950" strokeWidth="1.5" />
                      {/* Label tooltip */}
                      <rect x="-65" y="-30" width="130" height="20" rx="4" className="fill-navy-900 dark:fill-gold-400" />
                      <text x="0" y="-17" fill="var(--background)" fontSize="7" fontWeight="bold" textAnchor="middle" className="select-none tracking-wider">
                        580 PARK AVENUE
                      </text>
                      {/* Small pointer triangle for tooltip */}
                      <polygon points="-4,-10 4,-10 0,-7" className="fill-navy-900 dark:fill-gold-400" />
                    </g>
                  </svg>
                </div>

                {/* Valet Parking callout */}
                <div className="bg-navy-900 dark:bg-gold-400 text-white dark:text-navy-950 px-4 py-3 rounded-2xl border border-gold-500/20 text-xs leading-relaxed mt-2">
                  <span className="font-bold uppercase tracking-wider block mb-0.5 text-gold-400 dark:text-navy-950">Patient Comfort Parking Vouchers</span>
                  Complimentary valet parking vouchers provided for Rapid Park garage at 150 E 61st St. Just hand your ticket to our concierge team at checkout.
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-950 dark:bg-black text-white pt-16 pb-12 border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-400 text-navy-950 flex items-center justify-center font-serif font-bold text-sm">
                P
              </div>
              <span className="font-serif text-lg font-bold tracking-wide text-gold-400">
                PARK AVENUE
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed text-pretty">
              Premier Ivy League-credentialed digital dentistry in the heart of Upper East Side Manhattan. Curating flawless natural smiles.
            </p>
            <p className="text-[10px] text-zinc-500 tracking-wide mt-2">
              © {new Date().getFullYear()} Park Avenue Dental Specialists. All rights reserved.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-gold-400">
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <button onClick={() => scrollTo("services")} className="text-left hover:text-white transition-colors cursor-pointer">Clinical Services</button>
              <button onClick={() => scrollTo("doctors")} className="text-left hover:text-white transition-colors cursor-pointer">Our Dentists</button>
              <button onClick={() => scrollTo("amenities")} className="text-left hover:text-white transition-colors cursor-pointer">Luxury Amenities</button>
              <button onClick={() => scrollTo("testimonials")} className="text-left hover:text-white transition-colors cursor-pointer">Client Testimonials</button>
              <button onClick={() => scrollTo("booking")} className="text-left hover:text-white transition-colors cursor-pointer">Reserve Consultation</button>
            </div>
          </div>

          {/* Col 3: Specialties */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-gold-400">
              Specialties
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <span>Handcrafted Porcelain Veneers</span>
              <span>Computer-Guided Dental Implants</span>
              <span>Invisalign® Smile Straightening</span>
              <span>Holistic & Laser Preventive Care</span>
              <span>Intraoral 3D Impression-Free Scanning</span>
            </div>
          </div>

          {/* Col 4: Contact info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-gold-400">
              Concierge Desk
            </h4>
            <div className="flex flex-col gap-3 text-xs text-zinc-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-gold-400 shrink-0 mt-0.5" />
                <span>580 Park Avenue, Suite 1E,<br />New York, NY 10021</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-gold-400 shrink-0" />
                <a href="tel:2125550190" className="hover:text-white transition-colors">(212) 555-0190</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-gold-400 shrink-0" />
                <a href="mailto:concierge@parkavenuedentists.com" className="hover:text-white transition-colors">concierge@parkavenuedentists.com</a>
              </div>
            </div>
          </div>

        </div>
        
        {/* Footnotes / Compliance */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gold-500/10 text-[10px] text-zinc-500 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Accessibility Statement</a>
          </div>
          <div>
            All medical procedures carry inherent benefits & risks. Consult with our DDS specialists for detailed clinical assessments.
          </div>
        </div>
      </footer>

    </div>
  );
}
