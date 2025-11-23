import Navbar from "./components/navbar/Navbar";
import AppRouter from "./routes/AppRouter";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <AppRouter />
    </>
  );
}

export default App;
