import { useState } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ReviewPage from './pages/ReviewPage'
import FormulaLibraryPage from './pages/FormulaLibraryPage'
import WeaknessPage from './pages/WeaknessPage'
import SettingsPage from './pages/SettingsPage'
import ExamTrainingPage from './pages/ExamTrainingPage'
import WelcomeModal from './components/WelcomeModal'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'exam':
        return <ExamTrainingPage />
      case 'review':
        return <ReviewPage />
      case 'library':
        return <FormulaLibraryPage />
      case 'weakness':
        return <WeaknessPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <>
      <WelcomeModal />
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </>
  )
}
