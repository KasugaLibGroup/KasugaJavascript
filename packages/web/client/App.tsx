import React, {useState} from 'react';
import './index.css'
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import GUIDebuggerTool from './tools/GUIDebuggerTool.tsx'

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        {key:'gui',label:'GUI Debugger Tool'},
        {key:'model',label:'Model Debugger Tool'},
    ];

    const [stateOpenKeys, setStateOpenKeys] = useState(['gui']);

    function openMenu(e){
        setStateOpenKeys([e.key]);
    }

    return (
        <Layout style={{height:'100%'}}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                    selectedKeys = { stateOpenKeys }
                    onClick = { openMenu }
                />
            </Header>
            <Content style={{ padding: '0 48px',overflowY:'scroll',overflowX:'hidden' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        marginTop: 20,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {
                        stateOpenKeys[0] == 'gui' ? <GUIDebuggerTool/> : null
                    }
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default App;