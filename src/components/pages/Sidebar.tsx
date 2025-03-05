import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { List, FileText, BarChart, RollerCoaster, LogOut, HelpCircle, X } from 'lucide-react';

const menuItems = [
    { id: 'trained_data', icon: BarChart, label: 'Trained Data', path: '/trained-data' },
    { id: 'questions', icon: FileText, label: 'Questions', path: '/questions' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const [menuData, setMenuData] = useState(menuItems);
    const [showLogoutModal, setShowLogoutModal] = useState(false);  // <-- Modal state

    useEffect(() => {
        if (userData?.role === 'admin') {
            setMenuData([
                { id: 'roles', icon: RollerCoaster, label: 'Roles', path: '/roles' },
                { id: 'categories', icon: List, label: 'Categories', path: '/categories' },
                { id: 'questions', icon: FileText, label: 'Questions', path: '/questions' },
                { id: 'trained_data', icon: BarChart, label: 'Trained Data', path: '/trained-data' },
                { id: 'help_center', icon: HelpCircle, label: 'Help Center', path: '/help-center' },
            ]);
        } else {
            setMenuData(menuItems);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <>
            {/* Sidebar */}
            <div className="w-64 bg-white min-h-screen shadow-lg flex flex-col fixed left-0 top-0 h-full">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-black">Admin Portal</h1>
                </div>

                <nav className="mt-6 px-4 flex-1 overflow-y-auto">
                    {menuData.map(({ id, icon: Icon, label, path }) => (
                        <NavLink
                            key={id}
                            to={path}
                            className={({ isActive }) =>
                                `w-full flex items-center mb-2 px-4 py-2 rounded-md transition ${isActive
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                    : 'text-black hover:bg-blue-700 hover:text-white'
                                }`
                            }
                        >
                            <Icon className="mr-3 h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
                            <span className='text-white font-bold'>{userData?.name?.charAt(0)}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-black">{userData?.name}</p>
                            <p className="text-xs text-slate-400">{userData?.login_name}</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center py-2 text-red-600 text-xl cursor-pointer font-semibold ml-1"
                    >
                        <LogOut className="h-6 w-6" />
                        <span className='ml-2'>Logout</span>
                    </div>
                </div>
            </div>

            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className='flex items-center justify-between'>
                            <h2 className="text-xl font-semibold text-black">Confirm Logout</h2>
                            <X className="cursor-pointer" onClick={() => setShowLogoutModal(false)} color="black" />
                        </div>
                        <p className="text-gray-600 mt-3">Are you sure you want to logout?</p>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
