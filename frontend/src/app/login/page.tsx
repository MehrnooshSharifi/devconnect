"use client";
import { setToken } from "../../lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              token
              user { id email name }
            }
          }
        `,
          variables: { email, password },
        }),
      });

      const result = await res.json();
      if (result?.errors && result.errors.length) {
        alert(result.errors[0].message || "خطا در ورود");
        return;
      }

      const token = result?.data?.login?.token ?? null;
      if (token) {
        setToken(token); // ← اینجا
        router.push("/dashboard"); // سپس هدایت
      } else {
        alert("ایمیل یا رمز اشتباه است.");
      }
    } catch (err) {
      console.error(err);
      alert("خطایی در ارتباط با سرور رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            direction: "rtl",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight="bold"
              sx={{ mb: 3, color: "#0d47a1" }}
            >
              ورود به حساب کاربری 💻
            </Typography>

            <TextField
              fullWidth
              label="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ style: { textAlign: "right" } }}
            />
            <TextField
              fullWidth
              label="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              inputProps={{ style: { textAlign: "right" } }}
            />

            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.2,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#0d47a1" },
              }}
              onClick={handleLogin}
            >
              {loading ? "در حال ورود..." : "ورود"}
            </Button>

            <Typography
              align="center"
              sx={{ mt: 3, color: "text.secondary", cursor: "pointer" }}
              onClick={() => router.push("/register")}
            >
              حساب نداری؟ ثبت‌ نام کن
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
