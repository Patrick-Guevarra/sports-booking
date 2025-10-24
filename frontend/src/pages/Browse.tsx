import { useEffect, useState } from "react";
import api from "../api";

type Facility = { id: number; name: string; sport: string; location: string };
type Slot = { id: number; facility_id: number; start: string; end: string; is_booked: boolean };

export default function Browse() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [facilityId, setFacilityId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.get("/facilities").then((r) => setFacilities(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = facilityId ? { facility_id: facilityId } : {};
    api
      .get("/timeslots", { params })
      .then((r) => setSlots(r.data))
      .finally(() => setLoading(false));
  }, [facilityId]);

  const book = async (slotId: number) => {
    setMessage(null);
    try {
      await api.post("/bookings", { timeslot_id: slotId });
      setMessage("✅ Booked! Refreshing…");
      const params = facilityId ? { facility_id: facilityId } : {};
      const r = await api.get("/timeslots", { params });
      setSlots(r.data);
    } catch (e: any) {
      setMessage(e?.response?.data?.detail || "Booking failed");
    }
  };

  return (
    <div>
      <h2>Browse & Book</h2>
      <label>
        Facility:&nbsp;
        <select value={facilityId} onChange={(e) => setFacilityId(Number(e.target.value) || "")}>
          <option value="">All</option>
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} — {f.sport}
            </option>
          ))}
        </select>
      </label>

      {message && <p>{message}</p>}
      {loading && <p>Loading…</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {slots.map((s) => (
          <li key={s.id} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <div style={{ flex: 1 }}>
              <strong>{new Date(s.start).toLocaleString()}</strong> →{" "}
              {new Date(s.end).toLocaleString()}
              <div style={{ fontSize: 12, color: "#666" }}>Facility #{s.facility_id}</div>
            </div>
            {s.is_booked ? (
              <span>Booked</span>
            ) : (
              <button onClick={() => book(s.id)}>Book</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
