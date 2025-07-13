import { useState } from "react";
import api from "../utils/axios";
import { jsPDF } from "jspdf";

interface PlanRequest {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    preferences: string;
}

interface Activity {
    time: string;
    description: string;
}

interface Day {
    date: string;
    activities: Activity[];
}

interface PlanResponse {
    title: string;
    budget: number;
    days: Day[];
    notes: string[];
}

const Planner = () => {
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [preferences, setPreferences] = useState("");
    const [plan, setPlan] = useState<PlanResponse | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedDays, setExpandedDays] = useState<boolean[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setPlan(null);
        setExpandedDays([]);

        try {
            // Basic validation
            if (!destination || !startDate || !endDate || !budget || !preferences) {
                setError("All fields are required");
                return;
            }
            if (isNaN(Number(budget))) {
                setError("Budget must be a number");
                return;
            }
            if (new Date(startDate) >= new Date(endDate)) {
                setError("End date must be after start date");
                return;
            }

            const data: PlanRequest = {
                destination,
                startDate,
                endDate,
                budget,
                preferences,
            };

            const res = await api.post<PlanResponse>("/generate_plan", data, { withCredentials: true });
            // console.log("Plan response:", res.data);
            // console.log("Plan type:", typeof res.data);
            // console.log("Plan content:", res.data);

            if (res.status === 200) {
                const parsedPlan = res.data;
                // Validate structure
                if (
                    typeof parsedPlan.title !== "string" ||
                    typeof parsedPlan.budget !== "number" ||
                    !Array.isArray(parsedPlan.days) ||
                    !parsedPlan.days.every(
                        (day) =>
                            typeof day.date === "string" &&
                            Array.isArray(day.activities) &&
                            day.activities.every(
                                (act) => typeof act.time === "string" && typeof act.description === "string"
                            )
                    ) ||
                    !Array.isArray(parsedPlan.notes) ||
                    !parsedPlan.notes.every((note) => typeof note === "string")
                ) {
                    console.error("Invalid plan structure:", parsedPlan);
                    setError("Invalid plan structure: Missing or incorrect fields");
                    return;
                }

                setPlan(parsedPlan);
                setExpandedDays(new Array(parsedPlan.days.length).fill(false));
            }
        } catch (err: any) {
            console.error("Plan error:", err);
            console.error("Full response on error:", err.response?.data);
            setError(err.response?.data?.detail || err.message || "Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (index: number) => {
        setExpandedDays((prev) =>
            prev.map((expanded, i) => (i === index ? !expanded : expanded))
        );
    };

    const handleDownload = () => {
        if (!plan) return;

        // Create PDF
        const doc = new jsPDF();
        let yOffset = 10;

        // Title
        doc.setFontSize(18);
        doc.text(plan.title, 10, yOffset);
        yOffset += 10;

        // Budget
        doc.setFontSize(12);
        doc.text(`Budget: ₹${plan.budget}`, 10, yOffset);
        yOffset += 10;

        // Days
        plan.days.forEach((day) => {
            if (yOffset > 270) {
                doc.addPage();
                yOffset = 10;
            }
            doc.setFontSize(14);
            doc.text(day.date, 10, yOffset);
            yOffset += 8;

            day.activities.forEach((activity) => {
                if (yOffset > 270) {
                    doc.addPage();
                    yOffset = 10;
                }
                doc.setFontSize(10);
                doc.text(`- ${activity.time}: ${activity.description}`, 15, yOffset, { maxWidth: 180 });
                yOffset += doc.getTextDimensions(activity.description, { maxWidth: 180 }).h + 5;
            });
            yOffset += 5;
        });

        // Notes
        if (yOffset > 250) {
            doc.addPage();
            yOffset = 10;
        }
        doc.setFontSize(14);
        doc.text("Notes", 10, yOffset);
        yOffset += 8;

        plan.notes.forEach((note) => {
            if (yOffset > 270) {
                doc.addPage();
                yOffset = 10;
            }
            doc.setFontSize(10);
            doc.text(`- ${note}`, 15, yOffset, { maxWidth: 180 });
            yOffset += doc.getTextDimensions(note, { maxWidth: 180 }).h + 5;
        });

        // Create filename
        const safeTitle = plan.title.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_");
        const safeDate = startDate.replace(/[^0-9-]/g, "");
        const filename = `${safeTitle}_${safeDate}.pdf`;

        // Trigger download
        doc.save(filename);
    };

    return (
        <div className="min-h-screen w-screen flex flex-col items-center bg-gray-100 py-8">
            <div className="flex flex-col items-center gap-5 w-full max-w-2xl shadow-black shadow-lg rounded-xl bg-transparent backdrop-blur-sm px-10 py-8">
                <h1 className="font-bold text-4xl text-blue-600">Travel Planner</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Destination (e.g., Goa)"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="border-b border-gray-300 p-1 w-full px-4"
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border-b border-gray-300 p-1 w-full px-4"
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border-b border-gray-300 p-1 w-full px-4"
                    />
                    <input
                        type="text"
                        placeholder="Budget (e.g., 25000)"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="border-b border-gray-300 p-1 w-full px-4"
                    />
                    <input
                        type="text"
                        placeholder="Preferences (e.g., beaches, nightlife, relaxation)"
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="border-b border-gray-300 p-1 w-full px-4"
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 w-40 mx-auto disabled:bg-blue-300"
                    >
                        {loading ? "Generating..." : "Generate Plan"}
                    </button>
                </form>
            </div>

            {plan && (
                <div className="mt-6 w-full max-w-2xl bg-white shadow-md rounded-xl p-6 max-h-[60vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-blue-600">{plan.title}</h2>
                        <button
                            onClick={handleDownload}
                            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Download PDF
                        </button>
                    </div>
                    <p className="text-gray-700">Budget: ₹{plan.budget}</p>
                    <div className="mt-4">
                        {plan.days && Array.isArray(plan.days) ? (
                            plan.days.map((day, index) => (
                                <div key={index} className="mb-4">
                                    <button
                                        onClick={() => toggleDay(index)}
                                        className="w-full text-left text-lg font-semibold text-blue-600 hover:text-blue-800 flex justify-between items-center"
                                    >
                                        <span>{day.date}</span>
                                        <span>{expandedDays[index] ? "▲" : "▼"}</span>
                                    </button>
                                    {expandedDays[index] && (
                                        <ul className="mt-2 pl-5 list-disc text-gray-700">
                                            {day.activities.map((activity, actIndex) => (
                                                <li key={actIndex}>
                                                    <span className="font-semibold">{activity.time}:</span>{" "}
                                                    {activity.description}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-red-500">No valid itinerary available</div>
                        )}
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-blue-600">Notes</h3>
                        {plan.notes && Array.isArray(plan.notes) ? (
                            <ul className="mt-2 pl-5 list-disc text-gray-700">
                                {plan.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-red-500">No notes available</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default Planner;