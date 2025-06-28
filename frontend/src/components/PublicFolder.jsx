import Navbar from "./Navbar";
import SideBar from "./Sidebar";

function PublicFolder() {
  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <SideBar />
        <div className="folders"></div>
      </div>
    </div>
  );
}

export default PublicFolder;
