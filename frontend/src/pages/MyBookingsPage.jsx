import { useState } from "react";
import API from "../utils/axiosInstance";
import { toast } from 'react-toastify';

function MyBookingsPage() {
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setHasSearched(true);
        try {
            const response = await API.get(`/bookings/my-bookings?email=${email}`);
            setBookings(response.data.bookings);
        } catch (error) {
            console.error(error);
            setBookings([]);
            if (error.response?.status !== 404) {
                toast.error("Error fetching bookings");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Bookings</h2>
                <p className="text-gray-500 font-medium">Track your games and history.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 mb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-5 items-end relative z-10">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter your registered email..."
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-gray-700 font-medium transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Find History
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 mb-4"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {hasSearched && bookings.length === 0 && (
                        <div className="text-center py-16 px-4 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            <p className="font-medium">No bookings found for this email.</p>
                        </div>
                    )}

                    {bookings.map((booking) => (
                        <div key={booking._id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-5">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${booking.status === 'Confirmed' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                                        booking.status === 'Cancelled' ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                                    }`}>
                                    {booking.status === 'Confirmed' ? '✓' : booking.status === 'Cancelled' ? '✕' : '?'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{booking.courtId?.name || "Unknown Court"}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span>{new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end min-w-[80px]">
                                <span className="text-2xl font-black text-indigo-900 tracking-tight">₹{booking.totalPrice}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Paid</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookingsPage;
