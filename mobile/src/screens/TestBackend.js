import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { request } from "../config/api"; // if exported in your api.js

// Dev utility screen to verify the FastAPI server is reachable.

export default function TestBackend() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    request("/health")
      .then(res => setMsg(JSON.stringify(res)))
      .catch(err => setMsg(err.message));
  }, []);

  return (
    <View style={{ padding: 20, marginTop: 80 }}>
      <Text style={{ fontSize: 20 }}>{msg}</Text>
    </View>
  );
}
