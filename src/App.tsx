import React, { useState } from 'react'
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
      <nav className="sidebar">
        <h2>ChessDrills</h2>
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
      <main className="content">
        <header className="content-header">
          <h1>{currentPage}</h1>
        </header>
        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App