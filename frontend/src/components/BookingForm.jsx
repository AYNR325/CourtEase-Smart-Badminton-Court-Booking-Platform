import { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import { toast } from 'react-toastify';

function BookingForm({ court, selectedDate }) {
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState(1);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    // User Details
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    // Add-ons Data
    const [availableEquipments, setAvailableEquipments] = useState([]);
    const [availableCoaches, setAvailableCoaches] = useState([]);

    // Add-ons Selection
    const [selectedEquipment, setSelectedEquipment] = useState({}); // { id: quantity }
    const [selectedCoach, setSelectedCoach] = useState("");

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const [equipRes, coachRes] = await Promise.all([
                    API.get('/equipments'),
                    API.get('/coaches')
                ]);
                setAvailableEquipments(equipRes.data.equipments);
                setAvailableCoaches(coachRes.data.coaches);
            } catch (error) {
                console.error("Failed to load add-ons", error);
                toast.error("Failed to load add-ons");
            }
        };
        fetchResources();
    }, []);

    const handleEquipmentChange = (id, price) => {
        setSelectedEquipment(prev => {
            const currentQty = prev[id] || 0;
            const newQty = currentQty === 0 ? 1 : 0;
            const newState = { ...prev, [id]: newQty };
            if (newQty === 0) delete newState[id];
            return newState;
        });
    };

    const getEquipmentList = () => {
        return Object.entries(selectedEquipment).map(([id, quantity]) => ({
            equipmentId: id,
            quantity: quantity
        }));
    };

    const handleCheckPrice = async (e) => {
        e.preventDefault();
        setLoading(true);
        const start = new Date(`${selectedDate}T${startTime}`);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

        try {
            const response = await API.post('/bookings/check-price', {
                courtId: court._id,
                startTime: start,
                endTime: end,
                equipmentList: getEquipmentList(),
                coachId: selectedCoach || null
            });
            setPrice(response.data.price);
            toast.success("Price Calculated!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error checking price");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!userName || !userEmail) {
            toast.warn("Please enter your name and email to confirm booking.");
            return;
        }

        setLoading(true);
        const start = new Date(`${selectedDate}T${startTime}`);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

        try {
            await API.post('/bookings', {
                courtId: court._id,
                name: userName,
                email: userEmail,
                startTime: start,
                endTime: end,
                equipmentList: getEquipmentList(),
                coachId: selectedCoach || null
            });
            toast.success("Booking Confirmed Successfully! Check booking in history.");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Booking Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <form onSubmit={handleCheckPrice} className="space-y-8">
                {/* Time & Duration Section */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Schedule</h4>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Start Time</label>
                            <input
                                type="time"
                                required
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Duration <span className="text-gray-400 font-normal">(hrs)</span></label>
                            <input
                                type="number"
                                min={1}
                                max={4}
                                required
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Add-ons Section */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Extras</h4>

                    {/* Equipment Grid */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Rent Equipment</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableEquipments.map(item => (
                                <label key={item._id} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all duration-200 group ${selectedEquipment[item._id]
                                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedEquipment[item._id] ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                                            {selectedEquipment[item._id] && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                        </div>
                                        <div>
                                            <span className={`font-semibold block ${selectedEquipment[item._id] ? 'text-indigo-900' : 'text-gray-700'}`}>{item.name}</span>
                                            <span className="text-xs text-gray-500">In Stock: {item.totalStock}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">₹{item.pricePerUnit}</span>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={!!selectedEquipment[item._id]}
                                        onChange={() => handleEquipmentChange(item._id, item.pricePerUnit)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Coaches */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Select Coach</label>
                        <div className="relative">
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none transition-all text-gray-700"
                                value={selectedCoach}
                                onChange={(e) => setSelectedCoach(e.target.value)}
                            >
                                <option value="">No Coach Needed</option>
                                {availableCoaches.map(coach => (
                                    <option key={coach._id} value={coach._id}>
                                        {coach.name} • {coach.specialization} (₹{coach.hourlyRate}/hr)
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                {!price && (
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2
                        ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/30'}`}
                    >
                        {loading ? 'Calculating...' : 'Check Availability & Price'}
                        {!loading && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                    </button>
                )}
            </form>

            {/* Confirmation Section */}
            {price > 0 && (
                <div className="bg-emerald-50 rounded-2xl border border-emerald-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-emerald-100/50">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-gray-600 font-medium">Total Estimate</span>
                            <span className="text-4xl font-black text-emerald-700 tracking-tight">₹{price}</span>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Your Full Name"
                                required
                                className="w-full p-3 bg-white border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-400"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full p-3 bg-white border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-400"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleBooking}
                        disabled={loading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                        Confirm Booking
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default BookingForm;
