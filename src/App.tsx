import { useState } from 'react'
import './App.css'
import Analysis from './components/Analysis'

function App() {
  const [currentPage, setCurrentPage] = useState('Analysis')

  const handleNavClick = (pageName: string) => {
    setCurrentPage(pageName)
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'Analysis':
        return <Analysis />;
      // ... other cases for different pages
      default:
        return <p>This is the {currentPage} page. Select a different option from the menu to change pages.</p>;
    }
  }

  return (
    <div className="app-container">
      <div className="logo">
        <h2>ChessDrills</h2>
      </div>
      <div className="menu">
      <nav className="sidebar">
        <ul>
          <li className={currentPage === 'Analysis' ? 'active' : ''}>
            <a href="#" onClick={() => handleNavClick('Analysis')}>Analysis</a>
          </li>
          <li className={currentPage === 'Drills' ? 'active' : ''}>
            <a href="#" onClick={() => handleNavClick('Drills')}>Drills</a>
          </li>
          <li className={currentPage === 'Progress' ? 'active' : ''}>
            <a href="#" onClick={() => handleNavClick('Progress')}>Progress</a>
          </li>
          <li className={currentPage === 'Settings' ? 'active' : ''}>
            <a href="#" onClick={() => handleNavClick('Settings')}>Settings</a>
          </li>
        </ul>
      </nav>
      </div>
      <header className="head">
        <h1>{currentPage}</h1>
      </header>
      <main className="main">
        {renderContent()}
      </main>
    </div>
  )
}

export default App