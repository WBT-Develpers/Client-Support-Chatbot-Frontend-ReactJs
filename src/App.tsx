import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoriesTab from './pages/CategoriesTab';
import QuestionsTab from './pages/QuestionsTab';
import TrainedData from './pages/TrainedData';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import Layout from './pages/Layout';
import Roles from './pages/Roles';
import HeplCenter from './pages/HeplCenter';
import HeplCategories from './pages/HeplCategories';
import KnowledgeBase from './pages/KnowledgeBase';
import { ViewAll } from './pages/ViewAll';
import DocumentSection from './pages/DocumentSection';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen antialiased">
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/categories" element={<CategoriesTab />} />
              <Route path="/questions" element={<QuestionsTab />} />
              <Route path="/trained-data" element={<TrainedData />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/help-center" element={<HeplCenter />} />
              <Route path="/categories-knowledge-base" element={<HeplCategories />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/view-all-knowledge-base" element={<ViewAll />} />
              <Route path="/knowledge-base-docs" element={<DocumentSection />} />
            </Route>
          </Route>
          <Route path="*" element={<div>Invalid tab</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
