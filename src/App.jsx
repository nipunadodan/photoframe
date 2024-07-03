import './App.css'
import { Home } from './screens/uploadReady/Home.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

function App() {
  return (
    <SettingsProvider>
      <Home />
    </SettingsProvider>
  )
}

export default App
