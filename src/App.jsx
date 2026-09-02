import './App.css';
import {Home} from './screens/home/Home.jsx';
import {SettingsProvider} from './context/SettingsContext.jsx';
import {ThemeProvider} from './context/ThemeContext.jsx';
import {BrowserRouter, Route, Routes} from 'react-router';
import {TextCanvas} from './screens/text-canvas/TextCanvas.jsx';

function App() {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/image-canvas" element={<Home />} />
                        <Route path="/text-canvas" element={<TextCanvas />} />
                    </Routes>
                </BrowserRouter>
            </SettingsProvider>
        </ThemeProvider>
    );
}

export default App;
