// export default function FullBlogPage() {
//     return (
//         <div>
//             <h1>Full Blog List Page</h1>
//         </div>
//     );
// }


/*
  FullBlogPage.jsx

  - Ready-to-drop React component that matches the Blog page's style and structure
  - Fetches ALL blog documents from Appwrite and displays them with the same Card layout and AOS animations
  - Clicking any card navigates to `/blog/:id` (same as your Blog page)
  - Uses the same CSS file: ./Blog.css (so visuals remain consistent)
  - Make sure AOS and @mui/material are installed in your project.

  Usage:
    Place this file in the same folder as Blog.jsx and import it in App.jsx (you already have a route for /bloglist -> <FullBlogPage />).

  Note:
    This file intentionally duplicates the DB constants and helper used in Blog.jsx to keep it standalone. If you'd like DRY refactor, I can provide a shared helper file.
*/

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { databases } from "./lib/appwrite";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Blog.css";
import {
  Card, CardContent, CardMedia, Typography,
  Grid, Button, Box, Stack
} from "@mui/material";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "blog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

export default function FullBlogPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 760, easing: "ease-out-cubic", once: true, offset: 120 });
  }, []);

  const fetchBlogsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setData(res.documents || []);
    } catch (err) {
      console.error("Fetch error (FullBlogPage):", err);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => AOS.refresh(), 80);
      return () => clearTimeout(t);
    }
  }, [data, loading]);

  const getFileViewUrl = (fileId) =>
    fileId
      ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
      : "https://via.placeholder.com/600x360";

  if (loading) return <div style={{ padding: 16,textAlign: "center", mt: 4,fontSize:"40px" }}>Loading blogs...</div>;
  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;

  return (
    <Box className="blogpage-root" >
      {/* <Typography variant="h3" align="center" gutterBottom sx={{ mt: 4 }}>
        All Blogs
      </Typography>

      <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
        Showing {data.length} blogs
      </Typography> */}

      <Grid container spacing={3} sx={{ px: 2, pb: 6 }} className="aos-blogbox" data-aos="zoom-in-up">
        {data.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ width: "100%" }}>
            No blogs found
          </Typography>
        ) : (
          data.map((row, index) => (
            <Grid item xs={12} sm={6} md={4} key={row.$id}>
              <Card
                className="blog-card"
                sx={{ ml: 2, width: 450, height: 300, boxShadow: 3, cursor: "pointer",marginTop:"100px" }}
                onClick={() => navigate(`/blog/${row.$id}`)}
                data-aos="zoom-in-up"
                data-aos-delay={index * 80}
                data-aos-duration="700"
                data-aos-easing="ease-out-cubic"
                data-aos-anchor-placement="top-bottom"
              >
                <CardMedia
                  component="img"
                  image={getFileViewUrl(row.imageId)}
                  alt={row.Title ?? "Blog image"}
                  sx={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>{row.Title ?? "Untitled"}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    By: {row.Name ?? "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{row.Summary ?? "No summary available."}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 1, width: "100%" }}>
          <Button variant="contained" onClick={() => navigate(-1)} data-aos="flip-left">
            Back
          </Button>

          <Button variant="contained" onClick={() => navigate("/Blog")} data-aos="flip-left">
            Blog
          </Button>
        </Stack>

        <Button type="submit" onClick={() => navigate("/")}  variant="contained" color="success" disabled={loading} data-aos="fade-left" sx={{ alignSelf: 'flex-end' }}>
                      Home
        </Button>

      </Grid>

    </Box>
  );
}
