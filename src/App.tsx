import { useState } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ReviewPage from './pages/ReviewPage'
import FormulaLibraryPage from './pages/FormulaLibraryPage'
import WeaknessPage from './pages/WeaknessPage'
import SettingsPage from './pages/SettingsPage'
import MindMapPage from './pages/MindMapPage'
import ExamTrainingPage from './pages/ExamTrainingPage'
import QuestionsPage from './pages/QuestionsPage'
import MockExamPage from './pages/MockExamPage'
import CramPage from './pages/CramPage'
import WelcomeModal from './components/WelcomeModal'
import AIHelper from './components/AIHelper'
import GlobalSearch from './components/GlobalSearch'
import { ToastProvider } from './components/Toast'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'exam':
        return <ExamTrainingPage onNavigate={setCurrentPage} />
      case 'review':
        return <ReviewPage />
      case 'library':
        return <FormulaLibraryPage />
      case 'weakness':
        return <WeaknessPage />
      case 'settings':
        return <SettingsPage />
      case 'mindmap':
        return <MindMapPage />
      case 'questions':
        return <QuestionsPage />
      case 'mock':
        return <MockExamPage />
      case 'cram':
        return <CramPage />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <ToastProvider>
      <WelcomeModal onNavigate={setCurrentPage} />
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
      <GlobalSearch onNavigate={setCurrentPage} />
      <AIHelper />
    </ToastProvider>
  )
}
