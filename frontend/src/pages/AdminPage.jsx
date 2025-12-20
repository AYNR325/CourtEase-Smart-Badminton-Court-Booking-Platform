import { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import { toast } from "react-toastify";

function AdminPage() {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState("");

    // Admin Data State
    const [activeTab, setActiveTab] = useState("courts");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [activeTab, isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded PIN for lightweight protection
        if (pin === "admin123") {
            setIsAuthenticated(true);
            toast.success("Welcome, Admin");
        } else {
            toast.error("Invalid PIN");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint = "";
            let key = "";
            switch (activeTab) {
                case "courts": endpoint = "/courts"; key = "courts"; break;
                case "equipment": endpoint = "/equipments"; key = "equipments"; break;
                case "coaches": endpoint = "/coaches"; key = "coaches"; break;
                case "pricing": endpoint = "/pricing-rules"; key = "rules"; break;
            }
            const response = await API.get(endpoint);
            setData(response.data[key]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        try {
            let endpoint = "";
            switch (activeTab) {
                case "courts": endpoint = `/courts/${id}`; break;
                case "equipment": endpoint = `/equipments/${id}`; break;
                case "coaches": endpoint = `/coaches/${id}`; break;
                case "pricing": endpoint = `/pricing-rules/${id}`; break;
            }
            await API.delete(endpoint);
            toast.success("Deleted successfully");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Delete failed");
        }
    }

    const openModal = () => {
        setFormData({});
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint = "";
            switch (activeTab) {
                case "courts": endpoint = "/courts"; break;
                case "equipment": endpoint = "/equipments"; break;
                case "coaches": endpoint = "/coaches"; break;
                case "pricing": endpoint = "/pricing-rules"; break;
            }

            let payload = { ...formData };
            if (activeTab === 'pricing' && typeof payload.condition === 'string') {
                try {
                    payload.condition = JSON.parse(payload.condition);
                } catch (err) {
                    toast.error("Invalid JSON format for Condition");
                    return;
                }
            }

            await API.post(endpoint, payload);
            toast.success("Added successfully");
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add item");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const tabs = [
        { id: 'courts', label: 'Courts', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { id: 'equipment', label: 'Equipment', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { id: 'coaches', label: 'Coaches', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { id: 'pricing', label: 'Pricing Rules', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 flex-col">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
                    <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h2>
                    <p className="text-gray-500 mb-6">Restricted area. Please enter PIN to continue.</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            autoFocus
                            placeholder="Enter PIN (admin123)"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-center text-xl tracking-widest font-bold mb-4 transition-all"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar / Topbar */}
            <aside className="bg-white w-full md:w-64 md:min-h-screen shadow-lg border-r border-gray-100 z-10 flex-shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">Admin<span className="font-light text-gray-400">Panel</span></h2>
                    {/* <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Dashboard</p> */}
                </div>
                <nav className="p-4 space-y-1 overflow-x-auto md:overflow-visible flex md:block gap-4 md:gap-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 ml-0 hover:pl-5'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10">
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
                        <p className="text-gray-500 mt-1">Manage your court {activeTab === 'pricing' ? 'rules' : activeTab} here.</p>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add New
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data.length === 0 && (
                            <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                <p>No {activeTab} found. Add one to get started!</p>
                            </div>
                        )}
                        {data.map(item => (
                            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 transition-opacity opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-white/90 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 shadow-sm border border-gray-100 transition-colors backdrop-blur-sm"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                    {/* Simple Icon based on tab */}
                                    {activeTab === 'courts' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                                    {activeTab === 'equipment' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                                    {activeTab === 'coaches' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                                    {activeTab === 'pricing' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.name}</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    {activeTab === 'courts' && (
                                        <>
                                            <div className="flex justify-between border-b border-gray-100 pb-1"><span>Type</span> <span className="font-medium text-gray-800">{item.type}</span></div>
                                            <div className="flex justify-between pt-1"><span className="text-gray-500">Rate</span> <span className="font-bold text-indigo-600">₹{item.basePricePerHour}/hr</span></div>
                                        </>
                                    )}
                                    {activeTab === 'equipment' && (
                                        <>
                                            <div className="flex justify-between border-b border-gray-100 pb-1"><span>Category</span> <span className="font-medium text-gray-800">{item.type}</span></div>
                                            <div className="flex justify-between border-b border-gray-100 pb-1"><span>Stock</span> <span className={`font-medium ${item.totalStock < 5 ? 'text-red-500' : 'text-green-600'}`}>{item.totalStock} units</span></div>
                                            <div className="flex justify-between pt-1"><span className="text-gray-500">Price</span> <span className="font-bold text-indigo-600">₹{item.pricePerUnit}</span></div>
                                        </>
                                    )}
                                    {activeTab === 'coaches' && (
                                        <>
                                            <div className="flex justify-between border-b border-gray-100 pb-1"><span>Expertise</span> <span className="font-medium text-gray-800">{item.specialization}</span></div>
                                            <div className="flex justify-between pt-1"><span className="text-gray-500">Rate</span> <span className="font-bold text-indigo-600">₹{item.hourlyRate}/hr</span></div>
                                        </>
                                    )}
                                    {activeTab === 'pricing' && (
                                        <>
                                            <div className="flex justify-between border-b border-gray-100 pb-1"><span>Type</span> <span className="font-medium text-gray-800">{item.type}</span></div>
                                            <div className="flex justify-between border-b border-gray-100 pb-1"><span>Adjustment</span> <span className="font-bold text-indigo-600">{item.value > 0 ? `+${item.value}` : item.value}</span></div>
                                            <div className="pt-2">
                                                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Condition</p>
                                                <code className="block bg-gray-50 p-2 rounded text-xs text-indigo-600 font-mono overflow-hidden whitespace-nowrap text-ellipsis">{JSON.stringify(item.condition)}</code>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex justify-between items-center text-white shrink-0">
                            <div>
                                <h3 className="text-2xl font-bold capitalize">Add {activeTab}</h3>
                                <p className="text-indigo-100 text-sm opacity-90">Enter details for new resource</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
                            {/* Generic Name Field */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input name="name" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="Enter name..." />
                            </div>

                            {/* Specific Fields based on Tab */}
                            {activeTab === 'courts' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                                        <div className="relative">
                                            <select name="type" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none transition-all">
                                                <option value="">Select</option>
                                                <option value="Indoor">Indoor</option>
                                                <option value="Outdoor">Outdoor</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Price / Hour</label>
                                        <input type="number" name="basePricePerHour" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'equipment' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                                        <input name="type" required onChange={handleChange} placeholder="e.g. Racket, Shoe, Grip" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Price / Unit</label>
                                            <input type="number" name="pricePerUnit" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                                            <input type="number" name="totalStock" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'coaches' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Expertise</label>
                                        <input name="specialization" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Hourly Rate</label>
                                        <input type="number" name="hourlyRate" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Rule Type</label>
                                            <div className="relative">
                                                <select name="type" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none transition-all">
                                                    <option value="">Select</option>
                                                    <option value="Percentage">Percentage</option>
                                                    <option value="Fixed">Fixed Amount</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Value</label>
                                            <input type="number" name="value" required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Condition (JSON Link)</label>
                                        <textarea
                                            name="condition"
                                            rows="3"
                                            placeholder='{"startHour": 17, "endHour": 20}'
                                            required
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono text-sm transition-all"
                                        />
                                        <p className="text-xs text-indigo-400 mt-2 font-medium bg-indigo-50 inline-block px-2 py-1 rounded">Tip: Use {'{"startHour": 18}'} for evening price hikes.</p>
                                    </div>
                                </>
                            )}

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform active:scale-95">
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
