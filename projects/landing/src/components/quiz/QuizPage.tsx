import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Sparkles, Trophy, TrendingUp, History, RefreshCw } from 'lucide-react';
import StatCard from './StatCard';
import WarningDialog from './WarningDialog';
import TechBackground from './TechBackground';

// Props interfaces for components that need to be created elsewhere
interface Quiz {
  id: string;
  [key: string]: any;
}

interface AppContextType {
  nickname?: string;
  setNickname?: (name: string) => void;
  fetchLeaderboard?: () => void;
}

// Mock context hook - replace with actual import when available
const useAppContext = (): AppContextType => {
  return {
    nickname: localStorage.getItem('nickname') || 'Guest',
    setNickname: (name: string) => localStorage.setItem('nickname', name),
    fetchLeaderboard: () => {},
  };
};

const QuizPage = () => {
  const { nickname, setNickname, fetchLeaderboard } = useAppContext();

  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [showQuizMenu, setShowQuizMenu] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, Record<string, any>>>({});
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);

  // Initialize nickname
  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
    } else if (!nickname) {
      setNickname('Guest');
      localStorage.setItem('nickname', 'Guest');
    }
    setIsInitialized(true);
  }, [nickname, setNickname]);

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quizProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCategoryAnswers(parsed);
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quizProgress', JSON.stringify(categoryAnswers));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [categoryAnswers]);

  const handleQuizCategorySelect = useCallback((quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizDialogOpen(true);
    setShowQuizMenu(false);
  }, []);

  const handleMenuClose = useCallback(() => {
    const hasProgress = Object.values(categoryAnswers).some((obj) => Object.keys(obj).length > 0);
    if (hasProgress) {
      setShowExitWarning(true);
    } else {
      setShowQuizMenu(false);
    }
  }, [categoryAnswers]);

  const confirmExit = useCallback(() => {
    setShowExitWarning(false);
    setShowQuizMenu(false);
  }, []);

  const cancelExit = useCallback(() => {
    setShowExitWarning(false);
  }, []);

  const handleQuizDialogClose = useCallback(() => {
    setIsQuizDialogOpen(false);
    setShowQuizMenu(false);
  }, []);

  const handleQuestionAnswered = useCallback((quizId: string, questionIdx: number, selectedIdx: number, isCorrect: boolean, pointsEarned?: number) => {
    setCategoryAnswers((prev) => {
      const prevQuiz = prev[quizId] ? { ...prev[quizId] } : {};
      prevQuiz[questionIdx] = {
        selectedAnswer: selectedIdx,
        isCorrect,
        pointsEarned: pointsEarned || 0,
        timestamp: new Date().toISOString(),
      };
      return { ...prev, [quizId]: prevQuiz };
    });
    
    if (isCorrect) {
      fetchLeaderboard?.();
    }
  }, [fetchLeaderboard]);

  const handleResetProgress = useCallback(() => {
    setCategoryAnswers({});
    localStorage.removeItem('quizProgress');
    setShowResetWarning(false);
  }, []);

  // Calculate statistics
  const totalAnswered: number = Object.values(categoryAnswers).reduce(
    (sum: number, quiz) => sum + Object.keys(quiz).length,
    0
  );

  const totalCorrect: number = Object.values(categoryAnswers).reduce(
    (sum: number, quiz) => sum + Object.values(quiz).filter((ans: any) => ans.isCorrect).length,
    0
  );

  const accuracy: number = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const totalPoints: number = Object.values(categoryAnswers).reduce(
    (sum: number, quiz) => sum + Object.values(quiz).reduce((s: number, ans: any) => s + (ans.pointsEarned || 0), 0),
    0
  );

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tech-bg via-pink-100 to-rose-100">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-t-transparent border-quiz-brand"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TechBackground />

      <div className="relative z-10">
        {/* Center Content */}
        <AnimatePresence mode="wait">
          {!showQuizMenu && !isQuizDialogOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center max-w-3xl w-full">
                {/* Welcome Message */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                    Καλώς ήρθες στο Quiz! 🎓
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-2">
                    Δοκίμασε τις γνώσεις σου στην Πληροφορική
                  </p>
                </motion.div>

                {/* Stats */}
                {totalAnswered > 0 && (
                  <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <StatCard
                      icon={Target}
                      value={totalAnswered}
                      label="Απαντήσεις"
                      colorClass="border-pink-200"
                      delay={0.1}
                    />
                    <StatCard
                      icon={Sparkles}
                      value={totalCorrect}
                      label="Σωστές"
                      colorClass="border-green-200"
                      delay={0.2}
                    />
                    <StatCard
                      icon={TrendingUp}
                      value={`${accuracy}%`}
                      label="Ακρίβεια"
                      colorClass="border-blue-200"
                      delay={0.3}
                    />
                    <StatCard
                      icon={Trophy}
                      value={totalPoints}
                      label="Πόντοι"
                      colorClass="border-yellow-200"
                      delay={0.4}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <motion.button
                    onClick={() => setShowQuizMenu(true)}
                    className="px-10 py-5 rounded-2xl shadow-2xl font-black text-xl md:text-2xl text-white bg-gradient-to-r from-quiz-brand to-quiz-brand-dark hover:shadow-quiz-brand/50 transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-7 h-7" />
                      {totalAnswered > 0 ? 'Συνέχεια Quiz' : 'Ξεκίνησε Quiz'}
                    </div>
                  </motion.button>

                  {totalAnswered > 0 && (
                    <motion.button
                      onClick={() => setShowResetWarning(true)}
                      className="px-8 py-4 rounded-2xl bg-background border-2 border-border text-foreground font-bold hover:bg-secondary transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Επαναφορά Προόδου
                      </div>
                    </motion.button>
                  )}
                </motion.div>

                {/* Progress Indicator */}
                {totalAnswered > 0 && (
                  <motion.div 
                    className="mt-8 text-muted-foreground text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <History className="w-5 h-5 inline mr-2" />
                    Η πρόοδός σου αποθηκεύεται αυτόματα
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz Menu - Placeholder */}
        {showQuizMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-background p-8 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Quiz Menu</h2>
              <p className="text-muted-foreground mb-4">QuizMenu component needs to be imported</p>
              <button onClick={handleMenuClose} className="px-4 py-2 bg-quiz-brand rounded-lg text-white">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Quiz Dialog - Placeholder */}
        {isQuizDialogOpen && selectedQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-background p-8 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Quiz Dialog</h2>
              <p className="text-muted-foreground mb-4">QuizDialog component needs to be imported</p>
              <button onClick={handleQuizDialogClose} className="px-4 py-2 bg-quiz-brand rounded-lg text-white">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Exit Warning */}
        <WarningDialog
          isOpen={showExitWarning}
          title="Κλείσιμο Menu"
          message="Η πρόοδός σου είναι αποθηκευμένη!"
          description={`Έχεις απαντήσει σε ${totalAnswered} ερωτήσεις. Η πρόοδός σου θα παραμείνει αποθηκευμένη. Θέλεις να κλείσεις το μενού;`}
          confirmLabel="Ναι, κλείσιμο"
          cancelLabel="Ακύρωση"
          onConfirm={confirmExit}
          onCancel={cancelExit}
          variant="warning"
        />

        {/* Reset Warning */}
        <WarningDialog
          isOpen={showResetWarning}
          title="Επαναφορά Προόδου"
          message="Διαγραφή όλης της προόδου;"
          description={`Αυτή η ενέργεια θα διαγράψει όλες τις απαντήσεις σου (${totalAnswered} ερωτήσεις, ${totalPoints} πόντοι). Η ενέργεία είναι μη αναστρέψιμη!`}
          confirmLabel="Ναι, διαγραφή όλων"
          cancelLabel="Ακύρωση"
          onConfirm={handleResetProgress}
          onCancel={() => setShowResetWarning(false)}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default QuizPage;
