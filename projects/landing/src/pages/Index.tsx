import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, Users, Accessibility, Clock, Star, Download, Menu, X, Navigation, Heart, Calendar, Shield, Zap, Award, TrendingUp } from 'lucide-react';

const Index = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Popular routes data
  const popularRoutes = [
    {
      name: "Ιστορική Αθήνα",
      duration: "3-4 ώρες",
      distance: "5.2 km",
      stops: ["Ακρόπολη", "Πλάκα", "Μοναστηράκι", "Αρχαία Αγορά"],
      difficulty: "Εύκολη",
      color: "from-athens-orange to-red-500"
    },
    {
      name: "Γαστρονομική Περιπέτεια",
      duration: "4-5 ώρες",
      distance: "4.8 km",
      stops: ["Κεντρική Αγορά", "Ψυρρή", "Κολωνάκι", "Εξάρχεια"],
      difficulty: "Μέτρια",
      color: "from-athens-light-blue to-blue-600"
    },
    {
      name: "Street Art & Culture",
      duration: "2-3 ώρες",
      distance: "3.5 km",
      stops: ["Μεταξουργείο", "Γκάζι", "Κεραμεικός", "Θησείο"],
      difficulty: "Εύκολη",
      color: "from-purple-500 to-pink-500"
    }
  ];

  // Statistics counter animation
  const stats = [
    { number: "300k+", label: "Ενεργοί Χρήστες", icon: <Users className="w-8 h-8" /> },
    { number: "150+", label: "Διαδρομές", icon: <MapPin className="w-8 h-8" /> },
    { number: "4.9", label: "Αξιολόγηση", icon: <Star className="w-8 h-8" /> },
    { number: "50+", label: "Ξεναγοί", icon: <Award className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen bg-athens-beige">
      {/* Header */}
      <header className="fixed top-0 w-full bg-athens-dark-blue/95 backdrop-blur-md text-white z-50 shadow-lg">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <MapPin className="w-8 h-8 text-athens-orange" />
            <span>AthensGo</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('features')} className="hover:text-athens-light-blue transition-colors">
              Χαρακτηριστικά
            </button>
            <button onClick={() => scrollToSection('routes')} className="hover:text-athens-light-blue transition-colors">
              Διαδρομές
            </button>
            <button onClick={() => scrollToSection('accessibility')} className="hover:text-athens-light-blue transition-colors">
              Προσβασιμότητα
            </button>
            <button onClick={() => scrollToSection('premium')} className="hover:text-athens-light-blue transition-colors">
              Premium
            </button>
            <motion.button
              onClick={() => scrollToSection('download')}
              className="bg-athens-orange px-6 py-2 rounded-full font-semibold hover:bg-athens-light-blue hover:text-athens-dark-blue transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ξεκίνα Τώρα
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden bg-athens-dark-blue border-t border-athens-light-blue/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <button onClick={() => scrollToSection('features')} className="text-left hover:text-athens-light-blue transition-colors">
                  Χαρακτηριστικά
                </button>
                <button onClick={() => scrollToSection('routes')} className="text-left hover:text-athens-light-blue transition-colors">
                  Διαδρομές
                </button>
                <button onClick={() => scrollToSection('accessibility')} className="text-left hover:text-athens-light-blue transition-colors">
                  Προσβασιμότητα
                </button>
                <button onClick={() => scrollToSection('premium')} className="text-left hover:text-athens-light-blue transition-colors">
                  Premium
                </button>
                <button
                  onClick={() => scrollToSection('download')}
                  className="bg-athens-orange px-6 py-2 rounded-full font-semibold text-center"
                >
                  Ξεκίνα Τώρα
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - Enhanced */}
      <section id="hero" className="pt-24 md:pt-32 pb-16 bg-gradient-to-br from-athens-dark-blue via-athens-dark-blue to-blue-900 text-white overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-athens-orange/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-athens-light-blue/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-athens-orange/20 px-4 py-2 rounded-full mb-6 border border-athens-orange/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-athens-orange" />
                <span className="text-sm font-semibold text-athens-light-blue">Powered by AI</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                AthensGo: <br />
                <span className="bg-gradient-to-r from-athens-orange to-athens-light-blue bg-clip-text text-transparent">
                  Η Αθήνα στα Μέτρα Σου
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-athens-light-blue font-semibold">
                Εξατομικευμένες Διαδρομές με AI
              </p>
              <p className="text-lg mb-8 text-white/80 leading-relaxed">
                Ανακάλυψε την Αθήνα με έναν μοναδικό τρόπο. Το AthensGo χρησιμοποιεί τεχνητή νοημοσύνη για να σου προτείνει διαδρομές προσαρμοσμένες στα ενδιαφέροντά σου, τις αλλεργίες σου και τον ρυθμό σου.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={() => scrollToSection('download')}
                  className="bg-athens-orange text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-athens-light-blue hover:text-athens-dark-blue transition-all shadow-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5" />
                  Κατέβασε Τώρα
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection('routes')}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="w-5 h-5" />
                  Δες Διαδρομές
                </motion.button>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-athens-orange rounded-full animate-pulse" />
                  <span className="text-white/80">300k+ Χρήστες</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-athens-light-blue rounded-full animate-pulse" />
                  <span className="text-white/80">150+ Διαδρομές</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80">100% Προσβάσιμο</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -left-4 bg-athens-orange p-4 rounded-2xl shadow-2xl z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Navigation className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-athens-light-blue p-4 rounded-2xl shadow-2xl z-10"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>

                <div className="bg-gradient-to-br from-athens-light-blue to-athens-orange p-1 rounded-3xl shadow-2xl">
                  <div className="bg-white rounded-3xl p-6 shadow-xl">
                    <div className="aspect-[9/16] bg-gradient-to-br from-athens-dark-blue/5 to-athens-light-blue/10 rounded-2xl overflow-hidden">
                      {/* Map Preview */}
                      <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-orange-50">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <MapPin className="w-24 h-24 mx-auto text-athens-dark-blue" />
                            </motion.div>
                            <div className="space-y-2">
                              <p className="text-athens-dark-blue font-bold text-lg">Interactive Map</p>
                              <p className="text-sm text-gray-600 px-4">Εξερεύνησε την Αθήνα με έναν διαδραστικό χάρτη</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Animated route line */}
                        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                          <motion.path
                            d="M 50 50 Q 150 100 250 150 T 350 250"
                            stroke="url(#gradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FF6B35" />
                              <stop offset="100%" stopColor="#4FC3F7" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-athens-light-blue/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-3 text-athens-orange">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-athens-dark-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-gradient-to-br from-athens-beige to-athens-light-blue/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-athens-dark-blue mb-4">
              Εξερεύνησε την Αθήνα
            </h2>
            <p className="text-xl text-gray-700">
              Διαδραστικός χάρτης με όλες τις διαθέσιμες διαδρομές
            </p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 via-orange-50 to-blue-50 relative">
              {/* Map placeholder with Athens landmarks */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full h-full relative">
                  {/* Simulated map with landmarks */}
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-athens-light-blue/30">
                    {/* Acropolis marker */}
                    <motion.div
                      className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      whileHover={{ scale: 1.2 }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="relative">
                        <MapPin className="w-10 h-10 text-athens-orange drop-shadow-lg" />
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-athens-dark-blue text-white px-3 py-1 rounded-full text-xs whitespace-nowrap font-semibold">
                          Ακρόπολη
                        </div>
                      </div>
                    </motion.div>

                    {/* Plaka marker */}
                    <motion.div
                      className="absolute top-1/2 left-2/3"
                      whileHover={{ scale: 1.2 }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <div className="relative">
                        <MapPin className="w-8 h-8 text-athens-light-blue drop-shadow-lg" />
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-athens-dark-blue text-white px-3 py-1 rounded-full text-xs whitespace-nowrap font-semibold">
                          Πλάκα
                        </div>
                      </div>
                    </motion.div>

                    {/* Monastiraki marker */}
                    <motion.div
                      className="absolute top-2/3 left-1/3"
                      whileHover={{ scale: 1.2 }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <div className="relative">
                        <MapPin className="w-8 h-8 text-purple-500 drop-shadow-lg" />
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-athens-dark-blue text-white px-3 py-1 rounded-full text-xs whitespace-nowrap font-semibold">
                          Μοναστηράκι
                        </div>
                      </div>
                    </motion.div>

                    {/* Route lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                      <motion.path
                        d="M 50% 33% L 66% 50%"
                        stroke="#FF6B35"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.path
                        d="M 50% 33% L 33% 66%"
                        stroke="#4FC3F7"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                    </svg>
                  </div>

                  {/* Map controls */}
                  <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                    <button className="bg-white p-3 rounded-lg shadow-lg hover:bg-athens-light-blue/10 transition-colors">
                      <span className="text-2xl font-bold text-athens-dark-blue">+</span>
                    </button>
                    <button className="bg-white p-3 rounded-lg shadow-lg hover:bg-athens-light-blue/10 transition-colors">
                      <span className="text-2xl font-bold text-athens-dark-blue">−</span>
                    </button>
                  </div>

                  {/* Legend */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <h4 className="font-bold text-athens-dark-blue mb-2 text-sm">Κατηγορίες</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-athens-orange" />
                        <span>Ιστορικά</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-athens-light-blue" />
                        <span>Γαστρονομία</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span>Τέχνη & Κουλτούρα</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map info bar */}
            <div className="bg-athens-dark-blue text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Πλήρως Διαδραστικός Χάρτης</h3>
                  <p className="text-athens-light-blue text-sm">Zoom, φιλτράρισμα και ανακάλυψε όλα τα σημεία ενδιαφέροντος</p>
                </div>
                <motion.button
                  className="bg-athens-orange px-6 py-3 rounded-full font-semibold hover:bg-athens-light-blue hover:text-athens-dark-blue transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Άνοιξε στην Εφαρμογή
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section id="routes" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-athens-dark-blue mb-4">
              Δημοφιλείς Διαδρομές
            </h2>
            <p className="text-xl text-gray-700">
              Οι πιο αγαπημένες διαδρομές από την κοινότητά μας
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {popularRoutes.map((route, index) => (
              <motion.div
                key={index}
                className="bg-athens-beige rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className={`h-2 bg-gradient-to-r ${route.color}`} />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-athens-dark-blue mb-4 group-hover:text-athens-orange transition-colors">
                    {route.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5 text-athens-orange" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Navigation className="w-5 h-5 text-athens-light-blue" />
                      <span>{route.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span>{route.difficulty}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-athens-dark-blue mb-2">Στάσεις:</p>
                    <div className="flex flex-wrap gap-2">
                      {route.stops.map((stop, i) => (
                        <span key={i} className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 border border-athens-light-blue/30">
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    className="w-full bg-athens-dark-blue text-white py-3 rounded-xl font-semibold hover:bg-athens-orange transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Δες Λεπτομέρειες
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="py-16 bg-athens-beige">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-athens-dark-blue mb-4">
              Χαρακτηριστικά
            </h2>
            <p className="text-xl text-gray-700">
              Όλα όσα χρειάζεσαι για την τέλεια περιήγηση
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-12 h-12" />,
                title: 'AI Personalized Routes',
                description: 'Η τεχνητή νοημοσύνη δημιουργεί διαδρομές προσαρμοσμένες στα ενδιαφέροντά σου, τις αλλεργίες σου και τον αριθμό των βημάτων που θέλεις να κάνεις.',
                color: 'from-athens-orange to-athens-light-blue',
                badge: 'AI-Powered'
              },
              {
                icon: <Accessibility className="w-12 h-12" />,
                title: '100% Accessibility',
                description: 'Βρες προσβάσιμους δρόμους και μαγαζιά για ΑμεΑ. Το AthensGo εξασφαλίζει ότι όλοι μπορούν να απολαύσουν την Αθήνα χωρίς περιορισμούς.',
                color: 'from-athens-light-blue to-athens-dark-blue',
                badge: 'Inclusive'
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Book a Guide',
                description: 'Άμεση σύνδεση με πιστοποιημένους ξεναγούς που θα σε βοηθήσουν να ανακαλύψεις κρυμμένα μυστικά της πόλης.',
                color: 'from-athens-dark-blue to-athens-orange',
                badge: 'Live Support'
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: 'Safety First',
                description: 'Πληροφορίες για ασφαλείς περιοχές, έκτακτες καταστάσεις και άμεση επικοινωνία με τοπικές αρχές.',
                color: 'from-green-500 to-emerald-600',
                badge: 'Secure'
              },
              {
                icon: <Calendar className="w-12 h-12" />,
                title: 'Events & Activities',
                description: 'Ενημέρωση για εκδηλώσεις, φεστιβάλ και δραστηριότητες που διοργανώνονται στην Αθήνα.',
                color: 'from-purple-500 to-pink-500',
                badge: 'Updated Daily'
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: 'Offline Mode',
                description: 'Κατέβασε χάρτες και διαδρομές για χρήση χωρίς σύνδεση. Περιηγήσου χωρίς ανησυχίες για το διαδίκτυο.',
                color: 'from-athens-orange to-red-500',
                badge: 'No Internet Needed'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 bg-white group`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-athens-dark-blue text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                  {feature.badge}
                </div>

                <div className="p-8">
                  <motion.div
                    className={`bg-gradient-to-br ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-athens-dark-blue mb-4 group-hover:text-athens-orange transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-athens-dark-blue mb-4">
              Πώς Λειτουργεί
            </h2>
            <p className="text-xl text-gray-700">
              Τρία απλά βήματα για την περιπέτειά σου
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                step: '1', 
                title: 'Δώσε τα στοιχεία σου', 
                description: 'Πες μας τι σου αρέσει, τι αποφεύγεις και πόσο θέλεις να περπατήσεις.',
                icon: <Users className="w-8 h-8" />
              },
              { 
                step: '2', 
                title: 'Η AI φτιάχνει τη διαδρομή', 
                description: 'Η τεχνητή νοημοσύνη αναλύει τις προτιμήσεις σου και δημιουργεί την τέλεια διαδρομή.',
                icon: <Sparkles className="w-8 h-8" />
              },
              { 
                step: '3', 
                title: 'Ξεκίνα την περιήγηση', 
                description: 'Ακολούθησε τη διαδρομή και απόλαυσε την Αθήνα με τον δικό σου τρόπο.',
                icon: <Navigation className="w-8 h-8" />
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-athens-beige rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group hover:bg-white">
                  <motion.div
                    className="bg-gradient-to-br from-athens-orange to-athens-dark-blue w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white text-3xl font-bold mx-auto group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.step}
                  </motion.div>
                  <div className="flex justify-center mb-4 text-athens-light-blue">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-athens-dark-blue mb-3 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-center leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <motion.div
                      className="w-8 h-0.5 bg-athens-light-blue"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index + 1) * 0.2 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section id="accessibility" className="py-16 bg-gradient-to-br from-athens-light-blue/20 to-athens-beige">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Accessibility className="w-20 h-20 mb-6 text-athens-dark-blue" />
                <h2 className="text-4xl md:text-5xl font-bold text-athens-dark-blue mb-6">
                  Προσβασιμότητα για Όλους
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Το AthensGo είναι σχεδιασμένο για να είναι προσβάσιμο σε όλους. Βρες προσβάσιμες διαδρομές, μαγαζιά με ειδικές διευκολύνσεις και αξιοθέατα που μπορούν να απολαύσουν όλοι οι επισκέπτες, ανεξάρτητα από τις ανάγκες τους.
                </p>
                <ul className="space-y-4">
                  {[
                    'Χαρτογράφηση προσβάσιμων διαδρομών',
                    'Πληροφορίες για ράμπες και ανελκυστήρες',
                    'Προσβάσιμα μέσα μεταφοράς',
                    'Ειδικές διευκολύνσεις σε επιχειρήσεις'
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-3 text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-athens-orange rounded-full" />
                      <span className="text-lg">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-athens-light-blue/20 to-athens-orange/20 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Accessibility className="w-32 h-32 mx-auto text-athens-dark-blue" />
                      </motion.div>
                      <p className="text-athens-dark-blue font-semibold text-lg px-8">
                        100% Προσβάσιμες Διαδρομές
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Premium */}
      <section id="premium" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-athens-dark-blue mb-4">
              Αγαπημένο από Ταξιδιώτες
            </h2>
            <div className="flex items-center justify-center gap-2 text-athens-orange mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: star * 0.1 }}
                >
                  <Star className="w-8 h-8 fill-current" />
                </motion.div>
              ))}
            </div>
            <motion.div
              className="text-5xl md:text-6xl font-bold text-athens-dark-blue mb-2"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              300k+
            </motion.div>
            <p className="text-2xl text-gray-700">Happy Travelers</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              { name: 'Μαρία Κ.', text: 'Το AthensGo μου έδειξε μέρη της Αθήνας που δεν θα ανακάλυπτα ποτέ μόνη μου! Η AI είναι πραγματικά εξυπνη.', avatar: '🙋‍♀️' },
              { name: 'Γιώργος Π.', text: 'Η προσβασιμότητα που προσφέρει είναι απίστευτη. Επιτέλους μπορώ να απολαύσω την πόλη χωρίς περιορισμούς!', avatar: '👨‍🦽' },
              { name: 'Sofia M.', text: 'The AI recommendations were spot-on! Best travel app for Athens! Highly recommended for everyone.', avatar: '✈️' },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-athens-beige rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2 mb-4 text-athens-orange">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-athens-light-blue/30 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <p className="font-semibold text-athens-dark-blue">{testimonial.name}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Premium Section */}
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-br from-athens-dark-blue to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-2 bg-athens-orange px-4 py-2 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">Premium</span>
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Αναβάθμισε την Εμπειρία σου
              </h3>
              <p className="text-xl text-athens-light-blue mb-8">
                Απόκτησε πρόσβαση σε αποκλειστικά χαρακτηριστικά
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                'Απεριόριστες προσωποποιημένες διαδρομές',
                'Προτεραιότητα υποστήριξης 24/7',
                'Offline maps για όλη την Αθήνα',
                'Exclusive events & tours',
                'Προηγμένα φίλτρα αναζήτησης',
                'Χωρίς διαφημίσεις'
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-6 h-6 bg-athens-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-athens-orange text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-athens-dark-blue transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ξεκίνα Δωρεάν Δοκιμή
              </motion.button>
              <motion.button
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Μάθε Περισσότερα
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-20 bg-gradient-to-br from-athens-dark-blue via-blue-900 to-athens-dark-blue text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-athens-orange/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-athens-light-blue/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Download className="w-20 h-20 mx-auto mb-6 text-athens-orange" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ξεκίνα Τώρα την Περιπέτεια
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-athens-light-blue max-w-3xl mx-auto leading-relaxed">
              Κατέβασε το AthensGo και ανακάλυψε την Αθήνα με έναν εντελώς νέο τρόπο. Δωρεάν για iOS και Android.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.button
                className="bg-athens-orange text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-white hover:text-athens-dark-blue transition-all shadow-2xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Κατέβασε από το</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </motion.button>
              <motion.button
                className="bg-white text-athens-dark-blue px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-athens-light-blue transition-all shadow-2xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Κατέβασε από το</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </motion.button>
            </div>
            <p className="text-athens-light-blue text-sm">
              Διαθέσιμο σε iOS 14+ και Android 8+
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-athens-dark-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold mb-4">
                <MapPin className="w-6 h-6 text-athens-orange" />
                <span>AthensGo</span>
              </div>
              <p className="text-athens-light-blue mb-4">
                Η Αθήνα στα Μέτρα Σου
              </p>
              <div className="flex gap-3">
                <motion.button
                  className="w-10 h-10 bg-athens-orange/20 rounded-full flex items-center justify-center hover:bg-athens-orange transition-colors text-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  f
                </motion.button>
                <motion.button
                  className="w-10 h-10 bg-athens-orange/20 rounded-full flex items-center justify-center hover:bg-athens-orange transition-colors text-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  𝕏
                </motion.button>
                <motion.button
                  className="w-10 h-10 bg-athens-orange/20 rounded-full flex items-center justify-center hover:bg-athens-orange transition-colors text-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  in
                </motion.button>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Εξερεύνηση</h3>
              <ul className="space-y-2 text-athens-light-blue">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Χαρακτηριστικά</button></li>
                <li><button onClick={() => scrollToSection('routes')} className="hover:text-white transition-colors">Διαδρομές</button></li>
                <li><button onClick={() => scrollToSection('accessibility')} className="hover:text-white transition-colors">Προσβασιμότητα</button></li>
                <li><button onClick={() => scrollToSection('premium')} className="hover:text-white transition-colors">Premium</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Υποστήριξη</h3>
              <ul className="space-y-2 text-athens-light-blue">
                <li><a href="#" className="hover:text-white transition-colors">Κέντρο Βοήθειας</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Επικοινωνία</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Αναφορά Προβλήματος</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Νομικά</h3>
              <ul className="space-y-2 text-athens-light-blue">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-athens-light-blue/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-athens-light-blue text-sm text-center md:text-left">
              &copy; 2024 AthensGo. All rights reserved. Made with ❤️ in Athens
            </p>
            <div className="flex gap-6 text-athens-light-blue text-sm">
              <a href="#" className="hover:text-white transition-colors">🇬🇷 Ελληνικά</a>
              <a href="#" className="hover:text-white transition-colors">🇬🇧 English</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
