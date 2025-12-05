/*import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet, useParams } from "react-router";
import { databases } from "./lib/appwrite";
import { Card, CardContent, CardMedia, Typography, Grid, Button, Box, createTheme, ThemeProvider } from "@mui/material";
const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "vlog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

export default function Vlog() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // ✅ Step 1: Move fetch logic into a named async function
    const fetchVlogsData = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
            setData(res.documents || []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch vlogs");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Step 2: Call it once when component mounts
    useEffect(() => {
        fetchVlogsData(); // 👈 only function call here
    }, [id]); // empty array means run once on mount

    // ✅ Helper: Build file view URL
    const getFileViewUrl = (fileId) =>
        fileId
            ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
            : "";

    // ✅ Loading and error states
    if (loading) return <div style={{ padding: 16 }}>Loading blogs...</div>;
    if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;


    const theme = createTheme({
        palette: {
            primary: { main: "#647585ff" },
            secondary: { main: "#f50057" },
            customPurple: { main: "#cd99d6ff" }, // custom color
        },
    });

    // ✅ Render UI
    return (
        <Box sx={{ padding: 4 }}>
  <Typography variant="h3" align="center" gutterBottom>
    🎬 Vlogs
  </Typography>

  <Grid container spacing={3}>
    {data.length === 0 ? (
      <Typography variant="body1" align="center" sx={{ width: "100%" }}>
        No VLogs Found
      </Typography>
    ) : (
      data.map((row) => (
        <Grid item xs={12} sm={6} md={4} key={row.$id}>
          <Card
            sx={{ ml: 2, width: 450, boxShadow: 3, cursor: "pointer" }}
            onClick={() => navigate(`/blog/${row.$id}`)}
          >
            {/* Display thumbnail image 
            {row.thumbnailId ? (
              <CardMedia
                component="img"
                image={getFileViewUrl(row.thumbnailId)}
                alt={row.Title ?? "Vlog Thumbnail"}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                  color: "#999",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              >
                No thumbnail available
              </Box>
            )}

            <CardContent>
              <Typography variant="h5">{row.Title ?? "Untitled"}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                By: {row.Name ?? "Unknown"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))
    )}
  </Grid>

  <Box sx={{ textAlign: "center", mb: 3, mt: 4 }}>
    <NavLink to="/addVlog" style={{ textDecoration: "none" }}>
      <Button variant="contained" color="primary">
        Add Vlog
      </Button>
    </NavLink>
  </Box>
  <Outlet />
</Box>

    );
}*/

//vlog page without animation
// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate, Outlet, useParams } from "react-router";
// import { databases } from "./lib/appwrite";
// import { Card, CardContent, CardMedia, Typography, Grid, Button, Box, createTheme,Stack } from "@mui/material";


// const DATABASE_ID = "68d7e4db00031ecceb59";
// const COLLECTION_ID = "vlog";
// const BUCKET_ID = "68d806a40003e90025e6";
// const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
// const PROJECT_ID = "68d7e24c0033b9d1e47b";

// export default function Vlog() {

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [playingVideoId, setPlayingVideoId] = useState(null); // ✅ track which video is playing
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const fetchVlogsData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
//       setData(res.documents || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to fetch vlogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVlogsData();
//   }, [id]);

//   const getFileViewUrl = (fileId) =>
//     fileId
//       ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
//       : "";

//   if (loading) return <div style={{ padding: 16 }}>Loading blogs...</div>;
//   if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;

//   const handleClick = (row) => {
//     let clickTimeout = null;

//     return () => {
//       if (clickTimeout !== null) {
//         clearTimeout(clickTimeout);
//         clickTimeout = null;
//         setPlayingVideoId(null);
//         // Double click → navigate to detail
//         navigate(`/Vlog/${row.$id}`);
//       } else {
//         clickTimeout = setTimeout(() => {
//           // Single click → play video
//           setPlayingVideoId(row.$id === playingVideoId ? null : row.$id);
//           clickTimeout = null;
//         }, 250); // 250ms threshold for double click
//       }
//     };
//   };

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Typography variant="h3" align="center" gutterBottom>
//         🎬 Vlogs
//       </Typography>
//       <Grid container spacing={3}>
//         {data.length === 0 ? (
//           <Typography variant="body1" align="center" sx={{ width: "100%" }}>
//             No Vlogs Found
//           </Typography>
//         ) : (
//           data.map((row) => (
//             <Grid item xs={12} sm={6} md={4} key={row.$id}>
//               <Card
//                 sx={{ ml: 2, width: 450, height: 500, boxShadow: 3, cursor: "pointer" }}
//                 onDoubleClick={() => navigate(`/vlog/${row.$id}`)} // ✅ double click → detail page
//               >
//                 {row.thumbnailId ? (
//                   <CardMedia
//                     component="img"
//                     image={getFileViewUrl(row.thumbnailId)}
//                     alt={row.Title ?? "Vlog Thumbnail"}
//                     sx={{
//                       width: "100%",
//                       height: 400,
//                       objectFit: "contain",
//                       maxHeight: 380,   // <-- key: cover fills area and centers crop
//                       display: "block",
//                       backgroundColor: "#f5f5f5",
//                     }}
//                   />
//                 ) : (
//                   <Box
//                     sx={{
//                       width: "100%",
//                       height: 250,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       backgroundColor: "#f0f0f0",
//                       color: "#999",
//                       borderTopLeftRadius: "12px",
//                       borderTopRightRadius: "12px",
//                     }}
//                   >
//                     No thumbnail available
//                   </Box>
//                 )}

//                 <CardContent>
//                   <Typography variant="h5">{row.Title ?? "Untitled"}</Typography>
//                   <Typography variant="subtitle2" color="text.secondary">
//                     By: {row.Name ?? "Unknown"}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))
//         )}
//       </Grid>
//       <Box sx={{ textAlign: "center", mb: 3, mt: 4 }}>
//         <NavLink to="/addVlog" style={{ textDecoration: "none" }}>
//           <Button variant="contained" color="primary">
//             Add Vlog
//           </Button>
//         </NavLink>

//         <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
//           <Button variant="outlined" onClick={() => navigate("/app")}>
//             Home
//           </Button>
//         </Stack>
//       </Box>
//       <Outlet />
//     </Box>
//   );
// }



import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet, useParams } from "react-router";
import { databases } from "./lib/appwrite";
import { Card, CardContent, CardMedia, Typography, Grid, Button, Box, createTheme, Stack } from "@mui/material";

import AOS from "aos";
import "aos/dist/aos.css";
import "./Vlog.css";
const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "vlog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

export default function Vlog() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null); // ✅ track which video is playing
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchVlogsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setData(res.documents || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch vlogs");
    } finally {
      setLoading(false);
    }
  };

  // init AOS once
  useEffect(() => {
    AOS.init({
      duration: 760,
      easing: "ease-out-cubic",
      once: true,
      offset: 120,
    });
  }, []);

  useEffect(() => {
    fetchVlogsData();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => AOS.refresh(), 80);
      return () => clearTimeout(t);
    }
  }, [data, loading]);

  const getFileViewUrl = (fileId) =>
    fileId
      ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
      : "";

  if (loading) return <div style={{ padding: 16, fontSize: "50px", textAlign: "center", mt: 4, }}>Loading Vlogs...</div>;
  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;

  const handleClick = (row) => {
    let clickTimeout = null;

    return () => {
      if (clickTimeout !== null) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        setPlayingVideoId(null);
        // Double click → navigate to detail
        navigate(`/Vlog/${row.$id}`);
      } else {
        clickTimeout = setTimeout(() => {
          // Single click → play video
          setPlayingVideoId(row.$id === playingVideoId ? null : row.$id);
          clickTimeout = null;
        }, 250); // 250ms threshold for double click
      }
    };
  };

  const LATEST_COUNT = 6;
  const sorted = [...data].sort(
    (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
  );
  const visibleData = sorted.slice(0, Math.min(LATEST_COUNT, sorted.length));

  return (
    <Box className="vlogpage-root">
      {/* HERO */}
      <section className="vloghero-box" role="region" aria-label="Hero">
        <div
          className="vloghero-content"
          data-aos="zoom-in"
          data-aos-duration="900"
        >
          <h1 data-aos="fade-up" data-aos-delay="120">Lights. Camera. Learn.
          </h1>
          <p data-aos="fade-up" data-aos-delay="220">
            Welcome to the world where moments turn into stories.
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

      <Grid container spacing={3} sx={{ mt: 6 }}>
        {data.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ width: "100%", mt: 4 }}>
            No Vlogs Found
          </Typography>
        ) : (
          visibleData.map((row, index) => (
            <Grid item xs={12} sm={6} md={4} key={row.$id}>
              <Card
                className="blog-card"
                sx={{ ml: 2, width: 450, height: 600, boxShadow: 3, cursor: "pointer", marginBottom: "70px", marginLeft: "150px" }}
                onDoubleClick={() => navigate(`/vlog/${row.$id}`)} // ✅ double click → detail page
                data-aos="zoom-in-up"
                data-aos-delay={index * 80}        // 80ms stagger per card
                data-aos-duration="700"
                data-aos-easing="ease-out-cubic"
                data-aos-anchor-placement="top-bottom"
              >
                {row.thumbnailId ? (
                  <CardMedia
                    component="img"
                    image={getFileViewUrl(row.thumbnailId)}
                    alt={row.Title ?? "Vlog Thumbnail"}
                    sx={{
                      width: "100%",
                      height: 400,
                      objectFit: "contain",
                      maxHeight: 380,   // <-- key: cover fills area and centers crop
                      display: "block",
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 250,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f0f0f0",
                      color: "#999",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  >
                    No thumbnail available
                  </Box>
                )}

                <CardContent>
                  <Typography variant="h5">{row.Title ?? "Untitled"}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    By: {row.Name ?? "Unknown"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          ))
        )}
        <Stack direction="row" spacing={2} sx={{ mt: 1, marginLeft: '1700px', marginBottom: '50px' }}  >
          <Button variant="contained" onClick={() => navigate("/vloglist")} data-aos="flip-left" sx={{ marginLeft: '50px' }}>
            Full Vlog List ➜
          </Button>
        </Stack>
      </Grid>
      <section className="front-box-sectionvlog">
        <div
          className="vlogaos-box left-box"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"

        ><p>
            Experience stories that move — where every frame reflects passion and creativity.
          </p>
          <NavLink to="/addvlog" style={{ textDecoration: "none" }}>
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
              Add Vlog
            </Button>
          </NavLink>
        </div>

        <div
          className="vlogaos-box right-box"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <p>
            Every frame tells a story — of curiosity, creativity, and the adventures that shape us.
          </p>
          <NavLink to="/blog" style={{ textDecoration: "none" }}>
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
              Blog
            </Button>
          </NavLink>
        </div>

        <div
          className="vlogaos-box left-box"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"

        ><p>
            Step into a world of stories, visuals, and real experiences — created with purpose and passion.
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
