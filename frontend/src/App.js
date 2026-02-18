import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

/* 🔥 CSS */
import "./App.css";

/* 📦 Layout */
import Layout from "./components/Layout";

/* 📊 Core Pages */
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import AssignTask from "./components/AssignTask";

/* 👷 Engineers (Tabs inside page) */
import Engineers from "./components/Engineers";


import Calls from "./components/Calls";



/* Optional Future */
// import Calls from "./components/Calls";

function App() {

  return (

    <BrowserRouter>

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

          {/* 👷 Engineers (All tabs inside) */}
          <Route
            path="/engineers"
            element={<Engineers />}
          />

          {/* 📞 Future Pages */}
           <Route path="/calls" element={<Calls />} />
          {/*
          <Route
            path="/calls"
            element={<Calls />}
          />
          */}

        </Routes>

      </Layout>

    </BrowserRouter>

  );
}

export default App;
