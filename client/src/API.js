const API_URL = "http://localhost:1337";

export async function listLogEntries() {
  try {
    const response = await fetch(`${API_URL}/api/logs`);
    return response.json();
  } catch (err) {
    console.log(err);
  }
}
export async function createLogEntry(entry) {
  try {
    const response = await fetch(`${API_URL}/api/logs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(entry),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
}
