import { Route, Routes } from 'react-router-dom'

import { ParksPage } from './components/parks/ParksPage'
import { LoginPage } from './components/auth/LoginPage'
import { RegisterPage } from './components/auth/RegisterPage'
import { ParkDetailsPage } from './components/parks/ParkDetailsPage'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/parks"
        element={<ParksPage />}
      />

      <Route
        path="/parks/:id"
        element={<ParkDetailsPage />}
      />
    </Routes>
  )
}

export default App
