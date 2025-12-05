import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet, useParams } from "react-router";
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

export default function Blog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // init AOS once
  useEffect(() => {
    AOS.init({
      duration: 760,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
    });
  }, []);

  // fetch blogs
  const fetchBlogsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setData(res.documents || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsData();
  }, [id]);

  // refresh AOS after content renders (so dynamically added cards animate)
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

  if (loading) return <div style={{ padding: 16,textAlign: "center", mt: 4,fontSize:"50px"}}>Loading blogs...</div>;
  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;


  // show only the latest N posts on this page (keeps the rest on /bloglist)
const LATEST_COUNT = 12;
const sorted = [...data].sort(
  (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
);
const visibleData = sorted.slice(0, Math.min(LATEST_COUNT, sorted.length));



{/* <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
  Showing {visibleData.length} of {data.length} posts
</Typography> */}



  return (
    <Box className="blogpage-root">
      {/* HERO */}
      <section className="bloghero-box" role="region" aria-label="Hero">
        <div
          className="bloghero-content"
          data-aos="zoom-in"
          data-aos-duration="900"
        >
          <h1 data-aos="fade-up" data-aos-delay="120">Dive Into Thoughts, Travel Through Words</h1>
          <p data-aos="fade-up" data-aos-delay="220">
            Welcome to our creative space where stories come alive and every post inspires a new thought.
          </p>

          <div data-aos="fade-up" data-aos-delay="340">
            <button
              className="hero-cta"
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      <Grid container spacing={3} sx={{ px: 2, pb: 6 }} className="aos-blogbox" data-aos="zoom-in-up">
        {data.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ width: "100%" }}>
            No blogs found
          </Typography>
        ) : (
          visibleData.map((row, index) => (

            <Grid item xs={12} sm={6} md={4} key={row.$id} sx={{mt:6}}>
              <Card
                className="blog-card"
                sx={{ ml: 2, width: 450, height: 300, boxShadow: 3, cursor: "pointer" }}
                onClick={() => navigate(`/blog/${row.$id}`)}
                data-aos="zoom-in-up"
                data-aos-delay={index * 80}        // 80ms stagger per card
                data-aos-duration="700"
                data-aos-easing="ease-out-cubic"
                data-aos-anchor-placement="top-bottom"
              >
                <CardMedia
                  component="img"
                  image={getFileViewUrl(row.imageId)}
                  alt={row.Title ?? "Blog image"}
                  sx={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom
                  >{row.Title ?? "Untitled"}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom

                  >
                    By: {row.Name ?? "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}
                  >
                    {row.Summary ?? "No summary available."}
                  </Typography>
                </CardContent>
              </Card>

            </Grid>
          ))
        )}
        <Stack direction="row" spacing={2} sx={{ mt: 1,marginLeft: '1700px' }}  >
          <Button variant="contained" onClick={() => navigate("/bloglist")} data-aos="flip-left" sx={{ marginLeft: '50px' }}>
            Full Blog List ➜
          </Button>
        </Stack>
      </Grid>

      {/* FRONT SECTION WITH TWO FLOATING BOXES */}
      <section className="front-box-section">
        <div
          className="blogaos-box left-box"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"

        ><p>
            Write your experiences, lessons, and creative thoughts — your readers are waiting!
          </p>
          <NavLink to="/addblog" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                px: 3,
                py: 1.2,
                borderRadius: "10px",
                background: "#bf5ba1",
                "&:hover": {
                  background: "#df8080",
                  transform: "scale(1.05)",
                },
              }}
            >
              Add Blog
            </Button>
          </NavLink>
        </div>

        <div
          className="blogaos-box right-box"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <p>
            Got a vlog to share? Upload your latest creation and connect with your audience.
          </p>
          <NavLink to="/vlog" style={{ textDecoration: "none" }}>
            <Button
              color="primary"
              sx={{
                fontWeight: "bold",
                px: 3,
                py: 1.2,
                borderRadius: "10px",
                background: "#bf5ba1",
                color: "white",
                "&:hover": {
                  background: "#df8080",
                  transform: "scale(1.05)",
                },
              }}
            >
              Vlog
            </Button>
          </NavLink>
        </div>

        <div
          className="blogaos-box left-box"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"

        ><p>
            This website is a blend of blogging and vlogging — a space to share knowledge, creativity, and perspectives.
          </p>
          <NavLink to="/Home" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                px: 3,
                py: 1.2,
                borderRadius: "10px",
                background: "#bf5ba1",
                "&:hover": {
                  background: "#df8080",
                  transform: "scale(1.05)",
                },
              }}
            >
              Home
            </Button>
          </NavLink>
        </div>

      </section>


      <Outlet />
    </Box>
  );
}
