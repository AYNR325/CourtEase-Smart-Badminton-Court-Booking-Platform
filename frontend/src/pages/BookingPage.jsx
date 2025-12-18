import { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import BookingForm from "../components/BookingForm";

function BookingPage() {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCourt, setSelectedCourt] = useState(null);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const response = await API.get('/courts');
                setCourts(response.data.courts);
            } catch (error) {
                console.error("Error fetching courts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Book a Court</h2>
                    <p className="text-gray-500 font-medium max-w-md">Select your preferred court and time. Premium facilities awaiting your game.</p>
                </div>

                {/* Date Picker Card */}
                <div className="bg-white p-2 pr-4 rounded-xl shadow-lg shadow-indigo-100 border border-indigo-50 flex items-center gap-3">
                    <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Date</label>
                        <input
                            type="date"
                            className="text-gray-900 font-bold outline-none bg-transparent cursor-pointer"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 mb-4"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Finding available courts...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courts.map((court) => (
                        <div key={court._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border border-gray-100 hover:-translate-y-2">
                            {/* Image Placeholder area */}
                            <div className={`h-48 w-full relative overflow-hidden ${court.type === 'Indoor' ? 'bg-indigo-900' : 'bg-emerald-800'}`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <span className={`inline-block px-3 py-1 mb-2 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md ${court.type === 'Indoor' ? 'bg-indigo-500/30 border border-indigo-400/30' : 'bg-emerald-500/30 border border-emerald-400/30'}`}>
                                        {court.type}
                                    </span>
                                    <h3 className="text-2xl font-bold">{court.name}</h3>
                                </div>
                                {/* Pattern overlay */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Hourly Rate</p>
                                        <p className="text-2xl font-black text-gray-900">₹{court.basePricePerHour}<span className="text-sm font-medium text-gray-400">/hr</span></p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedCourt(court)}
                                    className="w-full py-4 rounded-xl font-bold bg-gray-50 text-gray-900 hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
                                >
                                    Book Now
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedCourt && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 p-6 flex justify-between items-center text-white shrink-0">
                            <div>
                                <h3 className="text-2xl font-bold">{selectedCourt.name}</h3>
                                <p className="text-indigo-200 text-sm">Booking for <span className="text-white font-semibold">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
                            </div>
                            <button
                                onClick={() => setSelectedCourt(null)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-8 overflow-y-auto">
                            <BookingForm court={selectedCourt} selectedDate={selectedDate} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookingPage;