import { Navigate, Route, Routes } from "react-router-dom";

import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout";
import { LoginPage } from "./pages/LoginPage";
import { ParkDetailsPage } from "./pages/ParkDetailsPage";
import { ParksPage } from "./pages/ParksPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AuthenticatedLayout />}>
        <Route path="/parks" element={<ParksPage />} />

        <Route path="/parks/:id" element={<ParkDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;