import './App.css'
import { Home } from './screens/home/Home.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

function App() {
  return (
    <SettingsProvider>
      <Home />
    </SettingsProvider>
  )
}

export default App
