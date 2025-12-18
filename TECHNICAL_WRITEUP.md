# My Technical Approach: Database & Pricing Logic

Here is a quick breakdown of how I designed the backend for the CourtEase platform. I wanted to keep things clean but flexible enough to handle real-world scenarios like peak-hour pricing.

## 1. Database Design 🗄️

For the database, I choose **MongoDB** because its document structure works really well for this kind of data. I didn't want to overcomplicate things with rigid tables, especially since a "Booking" can have different types of data attached to it (like rented equipment or coaches).

I organized my data into a few key collections:

*   **Courts**: This is the foundation. It holds the static details like the Court Name (e.g., "Court A"), type (Indoor/Outdoor), and the base hourly rate.
*   **Bookings**: This is the main piece of the puzzle. When a user books a slot, I create a new document here.
    *   I used **Referencing** to link the Booking to a specific Court. This way, I'm not duplicating court details every time.
    *   However, for things like price, I **saved the calculated value** directly in the booking. This is crucial because if I change the court price next month, I don't want old booking records to suddenly show the wrong amount.
*   **Pricing Rules**: Instead of hardcoding logic like "evenings are expensive" inside the Javascript code, I stored these rules in the database. This allows me (or an admin) to tweak prices without touching the code.

## 2. The Pricing Engine 💸

The most interesting part of this project was the dynamic pricing logic. I didn't want a simple "₹500 flat rate" system because real badminton courts charge differently based on time and demand.

Here is how my logic calculates the final bill, step-by-step:

1.  **Start with the Base**: First, the system looks at which court you picked and grabs its `basePricePerHour` (e.g., ₹500).
2.  **Check the Time (The Logic)**:
    *   The system looks at the **Pricing Rules** collection.
    *   It asks: *"Does the requested time match any rule?"*
    *   For example, I have a rule that says "Between 6 PM and 9 PM, increase price by 20%."
    *   If you book at 7 PM, the system automatically does the math: `500 + 20% = ₹600`.
3.  **Add the Extras**: Finally, if you rented a racket (₹50) or hired a coach (₹200), those are added on top.

**Total Cost = (Base Price + Time Surges) + Equipment + Coaching**

This modular approach means I can easily add a "Weekend Special" or "Morning Discount" later just by adding a new rule to the database, making the system super adaptable.
