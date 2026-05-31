import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import PropertyListPage from "./pages/PropertyList.jsx";
import RoomListPage from "./pages/RoomList.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";

import VendorHome from "./pages/VendorHomePage.jsx";
import VendorDashboard from "./pages/VendorDashboard.jsx";
import AddProperties from "./pages/AddProperty.jsx";
import AddRooms from "./pages/AddRoom.jsx";
import VendorProperties from "./pages/VendorProperty.jsx";
import VendorBookings from "./pages/VendorBookings.jsx";
import VendorRooms from "./pages/VendorRooms.jsx";

import PaymentPage from "./pages/PaymentPage.jsx";
import MyBookings from "./pages/MyBookings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* Push content below navbar */}
      <div style={{ paddingTop: "70px" }}>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ================= CUSTOMER ================= */}
          <Route
            path="/properties"
            element={
              <ProtectedRoute roleRequired="CUSTOMER">
                <PropertyListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/property/:propertyId"
            element={
              <ProtectedRoute roleRequired="CUSTOMER">
                <RoomListPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ ONLY ONE DASHBOARD ROUTE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roleRequired="CUSTOMER">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* ================= PAYMENT ================= */}
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute roleRequired="CUSTOMER">
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          {/* ================= VENDOR ================= */}
          <Route
            path="/vendor/home"
            element={
              <ProtectedRoute roleRequired="VENDOR">
                <VendorHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute roleRequired="VENDOR">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/add-property"
            element={
              <ProtectedRoute roleRequired="VENDOR">
                <AddProperties />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/properties"
            element={
              <ProtectedRoute roleRequired="VENDOR">
                <VendorProperties />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/add-room/:propertyId"
            element={
              <ProtectedRoute roleRequired="VENDOR">
                <AddRooms />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/bookings"
            element={
              <ProtectedRoute roleRequired="VENDOR">
                <VendorBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/property/:propertyId/rooms"
            element={
              <ProtectedRoute roleRequired="VENDOR">
                <VendorRooms />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;