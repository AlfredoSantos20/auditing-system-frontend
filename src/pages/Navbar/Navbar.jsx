import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Dropdown, Avatar, theme } from 'antd';

const { Header, Sider, Content, Footer } = Layout;

const Navbar = ({ children, onSectionChange, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const [selectedKey, setSelectedKey] = useState(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = ({ key }) => {
    const sectionMap = {
      'bsmare-1': 'BUTANE',
      'bsmare-2': 'ETHANE',
      'bsmare-3': 'METHANE',
      'bsmare-4': 'PENTANE',
      'bsmare-5': 'PROPANE',
      'bsmt-1': 'SCHEDAR',
      'bsmt-2': 'SHAULA',
      'bsmt-3': 'SPICA',
      'bsmt-4': 'POLLUX',
      'bsmt-5': 'PROCYON',
    };
    const section = sectionMap[key] || 'ALL SECTIONS';
    setSelectedKey(sectionMap[key] ? key : null);
    if (onSectionChange) onSectionChange(section);
  };

  const dropdownMenu = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span onClick={onLogout}>Logout</span>,
    },
  ];

  const sidebarItems = [
    {
      key: 'bsmare',
      icon: <UserOutlined />,
      label: 'BSMARE',
      children: [
        { key: 'bsmare-1', label: 'BUTANE' },
        { key: 'bsmare-2', label: 'ETHANE' },
        { key: 'bsmare-3', label: 'METHANE' },
        { key: 'bsmare-4', label: 'PENTANE' },
        { key: 'bsmare-5', label: 'PROPANE' },
      ],
    },
    {
      key: 'bsmt',
      icon: <TeamOutlined />,
      label: 'BSMT',
      children: [
        { key: 'bsmt-1', label: 'SCHEDAR' },
        { key: 'bsmt-2', label: 'SHAULA' },
        { key: 'bsmt-3', label: 'SPICA' },
        { key: 'bsmt-4', label: 'POLLUX' },
        { key: 'bsmt-5', label: 'PROCYON' },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="sm"
        onBreakpoint={(broken) => setCollapsed(broken)}
        width={200}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: collapsed ? '64px' : '120px',
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
          }}
        >
          <img
            src="/logobsm.png"
            alt="Logo"
            style={{
              width: collapsed ? '40px' : '80px',
              height: 'auto',
              transition: 'all 0.3s ease-in-out',
              objectFit: 'contain',
            }}
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={sidebarItems}
          onClick={handleMenuClick}
            className="!bg-transparent [&_.ant-menu-item-selected]:bg-gradient-to-r [&_.ant-menu-item-selected]:from-cyan-400 [&_.ant-menu-item-selected]:to-blue-500 [&_.ant-menu-item-selected]:text-white [&_.ant-menu-item-selected]:rounded-md"
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.3s' }}>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            position: 'sticky',
            top: 0,
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
              }}
            />
            <h1
            style={{
                margin: 0,
                fontWeight: 600,
                textAlign: 'center',
                width: '100%',
                fontSize: isMobile ? '16px' : '28px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                
            }}
            >
            {isMobile ? 'MAAP' : 'MAAP HERZIVANES CLASS OF 2028'}
            </h1>

          </div>

          <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" trigger={['click']}>
            <Avatar size="large" src="/admin.png" style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            flex: 1,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Navbar;
