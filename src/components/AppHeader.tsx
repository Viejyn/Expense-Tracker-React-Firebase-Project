import { Layout, Menu } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoggedIn } from "../store/actions/userActions";
import { RootState } from "../store";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout; // Layout alt bileşenlerini burada tanımlıyoruz

function AppHeader() {
  const { data, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(isLoggedIn());
  }, [dispatch]);

  const { pathname } = useLocation();

  // Menü öğelerini `items` dizisi olarak tanımlıyoruz
  const menuItems = data
    ? [
        { key: "/records", label: <Link to="/records">Harcama Kayıtları</Link> },
        { key: "/categories", label: <Link to="/categories">Kategori</Link> },
        { key: "/logout", label: <Link to="/logout">Çıkış</Link> },
      ]
    : loading
    ? []
    : [{ key: "/login", label: <Link to="/login">Giriş</Link> }];

    return (
        <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />   
      </Header>
    );
}

export default AppHeader;