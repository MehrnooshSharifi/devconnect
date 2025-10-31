"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "graphql-request";
import { getToken, removeToken } from "../../lib/auth";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  TextField,
  Divider,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Add, Logout, Edit, Delete } from "@mui/icons-material";
import { MY_POSTS_QUERY } from "../../queries/posts";
import {
  CREATE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  DELETE_POST_MUTATION,
} from "../../mutations/posts";

const endpoint = "http://localhost:4000/graphql";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const userToken = getToken(); // cookies-next درست می‌خونه
    if (!userToken) {
      router.push("/login");
    } else {
      setToken(String(userToken));
    }
  }, [router]);

  // 📦 گرفتن پست‌ها
  const { data, isLoading, error } = useQuery({
    queryKey: ["myPosts"],
    queryFn: async () => {
      if (!token) return [];
      const res = await request(
        endpoint,
        MY_POSTS_QUERY,
        {},
        { Authorization: `Bearer ${token}` }
      );
      return res.myPosts;
    },
    enabled: !!token,
  });

  // ✍️ ایجاد پست جدید
  const createPostMutation = useMutation({
    mutationFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const variables = { title, content };
      const res = await request(
        endpoint,
        CREATE_POST_MUTATION,
        variables,
        headers
      );
      return res.createPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setTitle("");
      setContent("");
    },
  });

  // 📝 ویرایش پست
  const updatePostMutation = useMutation({
    mutationFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const variables = { id: Number(editingId), title, content };
      const res = await request(
        endpoint,
        UPDATE_POST_MUTATION,
        variables,
        headers
      );
      return res.updatePost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setTitle("");
      setContent("");
      setEditMode(false);
      setEditingId(null);
    },
  });

  // 🗑 حذف پست
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const headers = { Authorization: `Bearer ${token}` };
      const variables = { id: Number(id) };
      await request(endpoint, DELETE_POST_MUTATION, variables, headers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (confirm("آیا مطمئنی که می‌خوای حذفش کنی؟"))
      deletePostMutation.mutate(id);
  };

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* نوار بالا */}
      <AppBar position="sticky" sx={{ background: "#1976d2" }}>
        <Toolbar className="flex justify-between w-full max-w-6xl mx-auto">
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            💻 DevConnect Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            خروج
          </Button>
        </Toolbar>
      </AppBar>

      {/* محتوای اصلی */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          padding: "3rem 1rem",
        }}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              align="center"
            >
              {editMode ? "✏️ ویرایش پست" : "📝 افزودن پست جدید"}
            </Typography>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
            >
              <TextField
                label="عنوان پست"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="محتوا"
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
              />
            </Box>

            <Box
              className="flex justify-center mt-6 gap-3"
              sx={{ marginTop: 1 }}
            >
              {editMode ? (
                <>
                  <Button
                    sx={{ marginLeft: 1 }}
                    variant="contained"
                    color="primary"
                    onClick={() => updatePostMutation.mutate()}
                  >
                    ذخیره تغییرات
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setEditingId(null);
                      setTitle("");
                      setContent("");
                    }}
                  >
                    لغو
                  </Button>
                </>
              ) : (
                <Button
                  sx={{ marginTop: 2 }}
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => createPostMutation.mutate()}
                  disabled={!title || !content}
                >
                  ارسال پست جدید
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* 📚 لیست پست‌ها */}
        <Box className="space-y-4">
          <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
            📚 پست‌های من
          </Typography>

          {isLoading && (
            <Box className="flex justify-center py-10">
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Typography align="center" color="error">
              خطا در بارگذاری پست‌ها 😞
            </Typography>
          )}

          {data &&
            data.map((post: any) => (
              <Card
                key={post.id}
                sx={{
                  marginBottom: 3,
                  p: 3,
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  backgroundColor: "#fff",
                  "&:hover": { boxShadow: "0 6px 14px rgba(0,0,0,0.08)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="600">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {post.content}
                  </Typography>

                  <Box
                    className="flex justify-end gap-2 mt-4"
                    sx={{ marginTop: 2 }}
                  >
                    <Button
                      sx={{ marginLeft: 1 }}
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(post)}
                    >
                      ویرایش
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(post.id)}
                    >
                      حذف
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}

          {data?.length === 0 && !isLoading && (
            <Typography align="center" sx={{ mt: 3 }}>
              هنوز پستی ننوشتی 🌱
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
