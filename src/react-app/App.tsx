import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import ApiDocumentation from "@/react-app/pages/ApiDocumentation";
import IdFinder from "@/react-app/pages/IdFinder";
import Configuration from "@/react-app/pages/Configuration";
import ApiStatus from "@/react-app/pages/ApiStatus";
import Integrations from "@/react-app/pages/Integrations";
import Languages from "@/react-app/pages/Languages";
import EcosystemDashboard from "@/react-app/pages/EcosystemDashboard";
import BrandExplorer from "@/react-app/pages/BrandExplorer";
import SyncListener from "@/react-app/pages/SyncListener";
import GlobalDeployment from "@/react-app/pages/GlobalDeployment";
import RepositorySync from "@/react-app/pages/RepositorySync";
import PlanetChange from "@/react-app/pages/PlanetChange";
import Omnigrid from "@/react-app/pages/Omnigrid";
import BaobabPortal from "@/react-app/pages/BaobabPortal";
import OmnigridEngine from "@/react-app/pages/OmnigridEngine";
import EnterprisePayroll from "@/react-app/pages/EnterprisePayroll";
import NexusNair from "@/react-app/pages/NexusNair";
import ThesisDebug from "@/react-app/pages/ThesisDebug";
import FruitfulAPI from "@/react-app/pages/FruitfulAPI";
import LicenseVault from "@/react-app/pages/LicenseVault";
import BaobabEcoStack from "@/react-app/pages/BaobabEcoStack";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/api-docs" element={<ApiDocumentation />} />
        <Route path="/id-finder" element={<IdFinder />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/api-status" element={<ApiStatus />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/ecosystem" element={<EcosystemDashboard />} />
        <Route path="/brands" element={<BrandExplorer />} />
        <Route path="/sync" element={<SyncListener />} />
        <Route path="/deployment" element={<GlobalDeployment />} />
        <Route path="/repo-sync" element={<RepositorySync />} />
        <Route path="/planet-change" element={<PlanetChange />} />
        <Route path="/omnigrid" element={<Omnigrid />} />
        <Route path="/baobab-portal" element={<BaobabPortal />} />
        <Route path="/omnigrid-engine" element={<OmnigridEngine />} />
        <Route path="/enterprise-payroll" element={<EnterprisePayroll />} />
        <Route path="/nexus-nair" element={<NexusNair />} />
        <Route path="/thesis-debug" element={<ThesisDebug />} />
        <Route path="/fruitful-api" element={<FruitfulAPI />} />
        <Route path="/license-vault" element={<LicenseVault />} />
        <Route path="/baobab-ecostack" element={<BaobabEcoStack />} />
      </Routes>
    </Router>
  );
}
