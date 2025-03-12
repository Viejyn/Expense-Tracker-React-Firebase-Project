import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import { Layout } from 'antd';
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Categories from "./components/Categories";
import Records from "./components/Records";
import AppHeader from "./components/AppHeader";
import Logout from "./components/Logout";

const { Content, Footer } = Layout; // Layout alt bileşenlerini burada tanımlıyoruz

function App() {
  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: '48px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
          <Route path="/records" element={<PrivateRoute><Records/></PrivateRoute>} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Content> 
      <Footer style={{ textAlign: 'center' }}>
        Expense Tracker @ React Dersleri 2024
      </Footer>
    </Layout>             
  );
}

export default App;
