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

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
      mutation Register($name: String!, $email: String!, $password: String!) {
        register(name: $name, email: $email, password: $password) {
          token
          user { id name email }
        }
      }
    `,
          variables: { name, email, password },
        }),
      });

      const result = await res.json();
      const token = result?.data?.register?.token ?? null;

      if (token) {
        setToken(token);
        router.push("/dashboard");
      } else {
        alert("ثبت‌نام ناموفق بود. شاید ایمیل تکراری است.");
      }
    } catch (err) {
      alert("خطایی رخ داده است.");
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
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight="bold"
              sx={{ mb: 3, color: "#0d47a1" }}
            >
              ساخت حساب کاربری ✨
            </Typography>

            <TextField
              fullWidth
              label="نام"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="پسورد"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
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
              onClick={handleSignup}
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </Button>

            <Typography
              align="center"
              sx={{ mt: 3, color: "text.secondary", cursor: "pointer" }}
              onClick={() => router.push("/login")}
            >
              حساب داری؟ وارد شو
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
