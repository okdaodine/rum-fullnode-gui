import { BrowserRouter as Router, Route } from 'react-router-dom';

import Index from './pages/Index';

import SnackBar from 'components/SnackBar';
import ConfirmDialog from './components/ConfirmDialog';

import { StoreProvider } from './store';

const AppRouter = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="dark w-screen h-screen bg-[#181818]">
          <Route path="/" component={Index} />
          <SnackBar />
          <ConfirmDialog />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default AppRouter;
