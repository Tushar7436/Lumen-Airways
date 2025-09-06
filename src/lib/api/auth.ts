import axios from "axios";

const API_BASE = process.env.BACKEND_URL;

export async function login(email: string, password: string): Promise<{ token: string; user: { email: string } }> {
  console.log("auth.ts: login API called", { email, password });
  try {
    const res = await axios.post(`${API_BASE}api/v1/user/signin`, { email, password });
    console.log("auth.ts: POST request to /api/v1/user/signin sent successfully");
    console.log("auth.ts: login API success", res.data);
    return {
      token: res.data.token,
      user: { email: res.data.user?.email || email },
    };
  } catch (err: unknown) {
    let message = "Invalid email or password";
    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
      console.error("auth.ts: login API error", err.response?.data || err);
    } else {
      console.error("auth.ts: login API error", err);
    }
    throw new Error(message);
  }
}

export async function signup(email: string, password: string): Promise<{ token: string; user: { email: string } }> {
  console.log("auth.ts: signup API called", { email, password });
  try {
    const res = await axios.post(`${API_BASE}api/v1/user/signup`, { email, password });
    console.log("auth.ts: POST request to /api/v1/user/signup sent successfully");
    console.log("auth.ts: signup API success", res.data);
    return {
      token: res.data.token,
      user: { email: res.data.user?.email || email },
    };
  } catch (err: unknown) {
    let message = "Signup failed";
    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message || message;
      console.error("auth.ts: signup API error", err.response?.data || err);
    } else {
      console.error("auth.ts: signup API error", err);
    }
    throw new Error(message);
  }
}
