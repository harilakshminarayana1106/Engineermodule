import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

/* 🔥 CSS */
import "./App.css";

/* 📦 Layout */
import Layout from "./components/Layout";

/* 📊 Core Pages */
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import AssignTask from "./components/AssignTask";

/* 👷 Engineers */
import Engineers from "./components/Engineers";

/* 📞 Calls */
import Calls from "./components/Calls";

/* 🔐 Login Page */
import Login from "./components/Login";


/* ======================================================
   🔐 SESSION CHECK COMPONENT
====================================================== */

function PrivateRoute({ children }) {

  const user = localStorage.getItem("user");

  return user ? children : <Navigate to="/login" />;

}


/* ======================================================
   APP
====================================================== */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* 🔐 LOGIN PAGE */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ======================================================
           PROTECTED ROUTES
        ====================================================== */}

        <Route
          path="/*"
          element={

            <PrivateRoute>

              <Layout>

                <Routes>

                  {/* 🏠 Dashboard */}
                  <Route
                    path="/"
                    element={<Dashboard />}
                  />

                  {/* 🚨 Alerts */}
                  <Route
                    path="/alerts"
                    element={<Alerts />}
                  />

                  {/* 📝 Assign Task */}
                  <Route
                    path="/assign"
                    element={<AssignTask />}
                  />

                  {/* 👷 Engineers */}
                  <Route
                    path="/engineers"
                    element={<Engineers />}
                  />

                  {/* 📞 Calls */}
                  <Route
                    path="/calls"
                    element={<Calls />}
                  />

                </Routes>

              </Layout>

            </PrivateRoute>

          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;