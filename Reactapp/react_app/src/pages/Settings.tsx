import Navbar from "../components/Navbar";

const Settings = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Navbar/>
      <p>Modify your preferences here.</p>
      <div className="mt-4">
        <label className="block mb-2">Change Username:</label>
        <input type="text" placeholder="Enter new username" className="border p-2 rounded w-full" />
      </div>
      <div className="mt-4">
        <label className="block mb-2">Change Password:</label>
        <input type="password" placeholder="Enter new password" className="border p-2 rounded w-full" />
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
    </div>
  );
};

export default Settings;
