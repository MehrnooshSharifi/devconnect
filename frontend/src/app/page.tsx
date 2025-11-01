"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* بخش بالای صفحه */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            mb: 2,
            color: "#0d47a1",
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          💻 DevConnect
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 5,
            color: "#333",
            fontWeight: 400,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          پلتفرمی برای توسعه‌دهنده‌ها تا پست بنویسن، یاد بگیرن و با هم در ارتباط
          باشن.
        </Typography>
      </motion.div>

      {/* تصویر نمایشی */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Image
          src="/images/pexels-photo-3184357.jpeg"
          alt="Team of developers working"
          width={400}
          height={280}
          style={{
            borderRadius: "1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        />
      </motion.div>

      {/* دکمه‌ها */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 5,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#1976d2",
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
            onClick={() => router.push("/login")}
          >
            ورود
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              padding: "0.8rem 1.3rem",
              borderRadius: "12px",
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
            onClick={() => router.push("/register")}
          >
            ثبت‌نام
          </Button>
        </Box>
      </motion.div>

      {/* فوتر ساده */}
      <Typography
        variant="body2"
        sx={{ mt: 8, color: "text.secondary", fontSize: "0.9rem" }}
      >
        ساخته شده با ❤️ توسط مهرنوش شریفی
      </Typography>
    </Box>
  );
}
