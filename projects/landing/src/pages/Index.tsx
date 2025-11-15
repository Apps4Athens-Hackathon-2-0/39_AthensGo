import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Users, Accessibility, Clock, Star, Download, Menu, X } from 'lucide-react';

const Index = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-athens-beige">
      {/* Header */}
      <header className="fixed top-0 w-full bg-athens-dark-blue text-white z-50 shadow-lg">
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
            <button onClick={() => scrollToSection('accessibility')} className="hover:text-athens-light-blue transition-colors">
              Προσβασιμότητα
            </button>
            <button onClick={() => scrollToSection('premium')} className="hover:text-athens-light-blue transition-colors">
              Premium
            </button>
            <button onClick={() => scrollToSection('download')} className="hover:text-athens-light-blue transition-colors">
              Download
            </button>
            <motion.button
              onClick={() => scrollToSection('hero')}
              className="bg-athens-orange px-6 py-2 rounded-full font-semibold hover:bg-athens-light-blue hover:text-athens-dark-blue transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ξεκίνα το Ταξίδι σου
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
              <button onClick={() => scrollToSection('accessibility')} className="text-left hover:text-athens-light-blue transition-colors">
                Προσβασιμότητα
              </button>
              <button onClick={() => scrollToSection('premium')} className="text-left hover:text-athens-light-blue transition-colors">
                Premium
              </button>
              <button onClick={() => scrollToSection('download')} className="text-left hover:text-athens-light-blue transition-colors">
                Download
              </button>
              <button
                onClick={() => scrollToSection('hero')}
                className="bg-athens-orange px-6 py-2 rounded-full font-semibold text-center"
              >
                Ξεκίνα το Ταξίδι σου
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-24 md:pt-32 pb-16 bg-gradient-to-br from-athens-dark-blue to-athens-dark-blue/90 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                AthensGo: Η Αθήνα στα Μέτρα Σου
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-athens-light-blue">
                Εξατομικευμένες Διαδρομές με AI
              </p>
              <p className="text-lg mb-8 text-white/90">
                Ανακάλυψε την Αθήνα με έναν μοναδικό τρόπο. Το AthensGo χρησιμοποιεί τεχνητή νοημοσύνη για να σου προτείνει διαδρομές προσαρμοσμένες στα ενδιαφέροντά σου, τις αλλεργίες σου και τον ρυθμό σου.
              </p>
              <motion.button
                onClick={() => scrollToSection('download')}
                className="bg-athens-orange text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-athens-light-blue hover:text-athens-dark-blue transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Κατέβασε Τώρα
              </motion.button>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-athens-light-blue to-athens-orange p-8 rounded-3xl shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="aspect-[9/16] bg-gradient-to-br from-athens-dark-blue/10 to-athens-light-blue/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-24 h-24 mx-auto mb-4 text-athens-dark-blue" />
                      <p className="text-athens-dark-blue font-semibold text-lg">App Mockup</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              },
              {
                icon: <Accessibility className="w-12 h-12" />,
                title: '100% Accessibility',
                description: 'Βρες προσβάσιμους δρόμους και μαγαζιά για ΑμεΑ. Το AthensGo εξασφαλίζει ότι όλοι μπορούν να απολαύσουν την Αθήνα χωρίς περιορισμούς.',
                color: 'from-athens-light-blue to-athens-dark-blue',
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Book a Guide',
                description: 'Άμεση σύνδεση με πιστοποιημένους ξεναγούς που θα σε βοηθήσουν να ανακαλύψεις κρυμμένα μυστικά της πόλης.',
                color: 'from-athens-dark-blue to-athens-orange',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ${
                  hoveredFeature === index ? 'bg-athens-light-blue/20' : 'bg-white'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-8">
                  <div className={`bg-gradient-to-br ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-athens-dark-blue mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
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
              { step: '1', title: 'Δώσε τα στοιχεία σου', description: 'Πες μας τι σου αρέσει, τι αποφεύγεις και πόσο θέλεις να περπατήσεις.' },
              { step: '2', title: 'Η AI φτιάχνει τη διαδρομή', description: 'Η τεχνητή νοημοσύνη αναλύει τις προτιμήσεις σου και δημιουργεί την τέλεια διαδρομή.' },
              { step: '3', title: 'Ξεκίνα την περιήγηση', description: 'Ακολούθησε τη διαδρομή και απόλαυσε την Αθήνα με τον δικό σου τρόπο.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-athens-beige rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-athens-orange to-athens-dark-blue w-16 h-16 rounded-full flex items-center justify-center mb-6 text-white text-3xl font-bold mx-auto">
                    {item.step}
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
                    <div className="w-8 h-0.5 bg-athens-light-blue"></div>
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
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Accessibility className="w-20 h-20 mx-auto mb-6 text-athens-dark-blue" />
              <h2 className="text-4xl md:text-5xl font-bold text-athens-dark-blue mb-6">
                Προσβασιμότητα για Όλους
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Το AthensGo είναι σχεδιασμένο για να είναι προσβάσιμο σε όλους. Βρες προσβάσιμες διαδρομές, μαγαζιά με ειδικές διευκολύνσεις και αξιοθέατα που μπορούν να απολαύσουν όλοι οι επισκέπτες, ανεξάρτητα από τις ανάγκες τους.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials & Stats */}
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
                <Star key={star} className="w-8 h-8 fill-current" />
              ))}
            </div>
            <div className="text-5xl md:text-6xl font-bold text-athens-dark-blue mb-2">
              300k+
            </div>
            <p className="text-2xl text-gray-700">Happy Travelers</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Μαρία Κ.', text: 'Το AthensGo μου έδειξε μέρη της Αθήνας που δεν θα ανακάλυπτα ποτέ μόνη μου!' },
              { name: 'Γιώργος Π.', text: 'Η προσβασιμότητα που προσφέρει είναι απίστευτη. Επιτέλους μπορώ να απολαύσω την πόλη!' },
              { name: 'Sofia M.', text: 'The AI recommendations were spot-on! Best travel app for Athens!' },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-athens-beige rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4 text-athens-orange">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-athens-dark-blue">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-16 bg-gradient-to-br from-athens-dark-blue to-athens-dark-blue/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Download className="w-20 h-20 mx-auto mb-6 text-athens-orange" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ξεκίνα Τώρα την Περιπέτεια
            </h2>
            <p className="text-xl mb-10 text-athens-light-blue max-w-2xl mx-auto">
              Κατέβασε το AthensGo και ανακάλυψε την Αθήνα με έναν εντελώς νέο τρόπο
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="bg-athens-orange text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-athens-light-blue hover:text-athens-dark-blue transition-all shadow-xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-6 h-6" />
                App Store
              </motion.button>
              <motion.button
                className="bg-white text-athens-dark-blue px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-athens-light-blue transition-all shadow-xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-6 h-6" />
                Google Play
              </motion.button>
            </div>
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
              <p className="text-athens-light-blue">
                Η Αθήνα στα Μέτρα Σου
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Σύνδεσμοι</h3>
              <ul className="space-y-2 text-athens-light-blue">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Χαρακτηριστικά</button></li>
                <li><button onClick={() => scrollToSection('accessibility')} className="hover:text-white transition-colors">Προσβασιμότητα</button></li>
                <li><button onClick={() => scrollToSection('download')} className="hover:text-white transition-colors">Download</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Νομικά</h3>
              <ul className="space-y-2 text-athens-light-blue">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Social Media</h3>
              <div className="flex gap-4">
                <motion.button
                  className="w-10 h-10 bg-athens-orange rounded-full flex items-center justify-center hover:bg-athens-light-blue transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  f
                </motion.button>
                <motion.button
                  className="w-10 h-10 bg-athens-orange rounded-full flex items-center justify-center hover:bg-athens-light-blue transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  t
                </motion.button>
                <motion.button
                  className="w-10 h-10 bg-athens-orange rounded-full flex items-center justify-center hover:bg-athens-light-blue transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  i
                </motion.button>
              </div>
            </div>
          </div>
          <div className="border-t border-athens-light-blue/20 pt-8 text-center text-athens-light-blue">
            <p>&copy; 2024 AthensGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
