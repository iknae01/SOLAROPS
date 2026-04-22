import { createBrowserRouter } from 'react-router';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ConsolePage } from './pages/ConsolePage';
import { PanelFarmViewPage } from './pages/PanelFarmViewPage';
import { UploadPage } from './pages/UploadPage';
import { PanelsPage } from './pages/PanelsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: WelcomePage
  },
  {
    path: '/login',
    Component: LoginPage
  },
  {
    path: '/signup',
    Component: SignupPage
  },
  {
    path: '/console',
    Component: ConsolePage
  },
  {
    path: '/farm-view',
    Component: PanelFarmViewPage
  },
  {
    path: '/upload',
    Component: UploadPage
  },
  {
    path: '/panels',
    Component: PanelsPage
  },
  {
    path: '/history',
    Component: HistoryPage
  },
  {
    path: '/settings',
    Component: SettingsPage
  }
]);