import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { databases } from "./lib/appwrite";
import { Box, Typography, CardMedia, Button, Stack, Divider, Dialog } from "@mui/material";
import { deleteBlog } from "./DeleteBlog";
import AOS from "aos";
import "aos/dist/aos.css";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "blog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState(false);
  const navigate = useNavigate();

  const getFileViewUrl = (fileId) =>
    fileId
      ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
      : "https://via.placeholder.com/150";

  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: "ease-in-out" });

    async function fetchBlog() {
      try {
        const res = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        setBlog(res);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading)
    return <Typography sx={{ textAlign: "center", mt: 4,fontSize:"50px" }}>Loading...</Typography>;

  if (!blog)
    return <Typography sx={{ textAlign: "center", mt: 4,fontSize:"40px" }}>Blog not found</Typography>;

  const createdAt = blog["$createdAt"] || blog.createdAt;
  const createdAtText = createdAt ? new Date(createdAt).toLocaleString() : "—";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #93428bea, #e5f18dff)",
        backgroundAttachment: "fixed",
        color: "#1b0808d0",
        p: { xs: 2, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "rgba(59, 177, 142, 0.78)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
        data-aos="fade-up"
      >
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 700 }}>
          {blog.Title}
        </Typography>

        {blog.imageId && (
          <>
            <CardMedia
              component="img"
              image={getFileViewUrl(blog.imageId)}
              alt={blog.Title}
              sx={{
                width: "100%",
                maxHeight: 500,
                objectFit: "cover",
                borderRadius: 3,
                cursor: "pointer",
                transition: "transform 0.4s ease",
                "&:hover": { transform: "scale(1.03)" },
                my: 3,
              }}
              onClick={() => setOpenImage(true)}
              data-aos="zoom-in"
            />

            <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="lg">
              <img
                src={getFileViewUrl(blog.imageId)}
                alt="Full View"
                style={{ width: "100%", height: "auto" }}
              />
            </Dialog>
          </>
        )}

        <Typography variant="subtitle1" color="#1a1616ff" gutterBottom data-aos="fade-right">
          ✍️ By: {blog.Name}
        </Typography>

        <Typography sx={{ mt: 2 }} data-aos="fade-up">
          {blog.Summary}
        </Typography>

        <Typography variant="body1" sx={{ mt: 3, lineHeight: 1.8 }} data-aos="fade-up">
          {blog.Content}
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mt: 3 }} alignItems="center" data-aos="fade-up">
          <Typography variant="subtitle2" color="#272424ff">
            📂 Category: <strong>{blog.Category ?? "Uncategorized"}</strong>
          </Typography>
          <Typography variant="subtitle2" color="#131313ff">
            🕒 Published: {createdAtText}
          </Typography>
          <Typography variant="subtitle2" color="rgba(7, 7, 7, 0.8)">
            📍 Location: {blog.Location ?? "Not specified"}
          </Typography>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        <Stack direction="row" spacing={2} justifyContent="center" data-aos="fade-up">
          <Button
            variant="outlined"
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
            onClick={() => navigate(`/Blog`)}
          >
            ← Back
          </Button>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #6a11cb, #2575fc)",
              "&:hover": { background: "linear-gradient(45deg, #2575fc, #6a11cb)" },
            }}
            onClick={() => navigate(`/update/blog/${id}`)}
          >
            Update Blog
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderColor: "#ff6b6b",
              color: "#fdf9f9ff",
              "&:hover": { backgroundColor: "rgba(107, 188, 255, 0.43)" },
            }}
            onClick={async () => {
              const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
              if (!confirmDelete) return;
              await deleteBlog(blog.$id, blog.imageId);
              alert("Blog deleted successfully!");
              navigate("/blog");
            }}
          >
            Delete Blog
          </Button>
          <Button
            variant="contained"
            sx={{
              borderColor: "white",
              color: "white",
              "&:hover": { backgroundColor: "rgba(129, 21, 34, 0.84)" },
            }}
            onClick={() => navigate("/app")}
          >
            🏠 Home
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}


