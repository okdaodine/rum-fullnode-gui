import { BrowserRouter as Router, Route } from 'react-router-dom';

import Index from './pages';

import SnackBar from 'components/SnackBar';
import ConfirmDialog from './components/ConfirmDialog';
import PageLoadingModal from './components/PageLoadingModal';

import { StoreProvider } from './store';

const AppRouter = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="w-screen h-screen bg-[#181818]">
          <Route path="/" component={Index} />
          <SnackBar />
          <ConfirmDialog />
          <PageLoadingModal />
        </div>
      </Router>
    </StoreProvider>
  );
};

export default AppRouter;
