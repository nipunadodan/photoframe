import './App.css'
import { Home } from './screens/home/Home.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

function App() {
  return (
      <ThemeProvider>
        <SettingsProvider>
          <Home />
        </SettingsProvider>
      </ThemeProvider>
  )
}

export default App
