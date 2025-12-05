//code without animation and new color theme
// import React, { useState } from "react";
// import { databases, storage, ID, Permission, Role } from "./lib/appwrite";
// import { Box, TextField, Button, Typography, Stack, createTheme, ThemeProvider, MenuItem} from "@mui/material";
// import { Description } from "@mui/icons-material";

// const DATABASE_ID = "68d7e4db00031ecceb59";
// const COLLECTION_ID = "vlog"; // vlog collection
// const BUCKET_ID = "68d806a40003e90025e6";

// export default function AddVlog() {
//   const [form, setForm] = useState({ Title: "", Name: "", Description: "", Category: "", Location: "" });
//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [thumbPreview, setThumbPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const categories = [
//     "Technology", "Travel", "Food", "Education", "Lifestyle", 
//     "Health", "Finance", "Entertainment", "Sports", "Science", "Art", "History", 
//     "Nature", "Politics", "Culture", "Business", "Environment", "Fashion", "Music", "Photography",
//   ];

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleVideoChange = (e) => {
//     const file = e.target.files?.[0] ?? null;
//     setVideoFile(file);
//     if (file) setVideoPreview(URL.createObjectURL(file));
//   };

//   const handleThumbChange = (e) => {
//     const file = e.target.files?.[0] ?? null;
//     setThumbnailFile(file);
//     if (file) setThumbPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let videoId = null;
//       let thumbnailId = null;

//       const filePermissions = [Permission.read(Role.any())];

//       if (videoFile) {
//         const uploadedVideo = await storage.createFile(BUCKET_ID, ID.unique(), videoFile, filePermissions);
//         videoId = uploadedVideo.$id;
//         console.log("🎥 Video uploaded:", videoId);
//       }

//       if (thumbnailFile) {
//         const uploadedThumb = await storage.createFile(BUCKET_ID, ID.unique(), thumbnailFile, filePermissions);
//         thumbnailId = uploadedThumb.$id;
//         console.log("🖼️ Thumbnail uploaded:", thumbnailId);
//       }

//       const docPermissions = [Permission.read(Role.any())];
//       const doc = await databases.createDocument(
//         DATABASE_ID,
//         COLLECTION_ID,
//         ID.unique(),
//         {
//           Title: form.Title.trim(),
//           Name: form.Name.trim(),
//           Description: form.Description.trim(),
//           Category: form.Category,
//           Location: form.Location.trim(),
//           videoId,
//           thumbnailId,
//         },
//         docPermissions
//       );

//       console.log("✅ Vlog created:", doc);
//       alert("Vlog saved successfully!");
//       setForm({ Title: "", Name: "", Description: "", Category: "", Location: "" });
//       setVideoFile(null);
//       setThumbnailFile(null);
//       setVideoPreview(null);
//       setThumbPreview(null);
//     } catch (err) {
//       console.error("❌ Save error:", err);
//       alert("Error: " + (err.message || JSON.stringify(err)));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const theme = createTheme({
//     palette: {
//       primary: { main: "#647585ff" },
//       secondary: { main: "#f50057" },
//       customPurple: { main: "#ced699ff" },
//     },
//   });

//   return (
//     <Box sx={{ padding: 4, maxWidth: 600, mx: "auto" }}>
//       <Typography variant="h3" sx={{ textAlign: "center" }} gutterBottom>
//         Add Vlog
//       </Typography>

//       <Box component="form" onSubmit={handleSubmit}>
//         <Stack spacing={2}>
//           <TextField label="Enter The Title Of The Vlog" name="Title" value={form.Title} onChange={handleChange} required fullWidth />
//           <TextField label="Enter Author Name" name="Name" value={form.Name} onChange={handleChange} required fullWidth />
//           <TextField label="Enter the Description Of the Vlog" name="Description" value={form.Description} onChange={handleChange} required multiline minRows={4} fullWidth />
//           <TextField label="Location (e.g. Bangalore, Karnataka)" name="Location" value={form.Location} onChange={handleChange} placeholder="Bangalore, Karnataka" fullWidth margin="normal" />
//           <TextField select label="Select Category" name="Category" value={form.Category} onChange={handleChange} fullWidth required sx={{ mb: 2 }}>
//             {categories.map((cat) => (
//               <MenuItem key={cat} value={cat}>
//                 {cat}
//               </MenuItem>
//             ))}
//           </TextField>

//           <ThemeProvider theme={theme}>
//             <Button variant="contained" component="label" color="customPurple">
//               Upload Video
//               <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
//             </Button>
//             {videoPreview && (
//               <video width="100%" height="auto" controls src={videoPreview} style={{ borderRadius: 8, marginTop: 8 }} />
//             )}

//             <Button variant="contained" component="label" color="customPurple">
//               Upload Thumbnail
//               <input type="file" accept="image/*" hidden onChange={handleThumbChange} />
//             </Button>
//             {thumbPreview && (
//               <img src={thumbPreview} alt="Thumbnail Preview" style={{ width: "100%", borderRadius: 8, marginTop: 8 }} />
//             )}
//           </ThemeProvider>

//           <Button type="submit" variant="contained" color="info" disabled={loading}>
//             {loading ? "Saving..." : "Add Vlog"}
//           </Button>
//         </Stack>
//       </Box>
//     </Box>
//   );
// }


import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./AddVlog.css";
import { useNavigate } from "react-router";
import { databases, storage, ID, Permission, Role } from "./lib/appwrite";
import { Box, TextField, Button, Typography, Stack, createTheme, ThemeProvider, MenuItem } from "@mui/material";
import { red } from "@mui/material/colors";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "vlog";
const BUCKET_ID = "68d806a40003e90025e6";

export default function AddVlog() {
  const [form, setForm] = useState({ Title: "", Name: "", Description: "", Category: "", Location: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const categories = [
    "Technology", "Travel", "Food", "Education", "Lifestyle", "Health", "Finance", "Entertainment", "Sports", "Science", "Art", "History", "Nature", "Politics", "Culture", "Business", "Environment", "Fashion", "Music", "Photography",
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setVideoFile(file);
    if (file) setVideoPreview(URL.createObjectURL(file));
  };
  const handleThumbChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let videoId = null;
      let thumbnailId = null;
      const filePermissions = [Permission.read(Role.any())];

      if (videoFile) {
        const uploadedVideo = await storage.createFile(BUCKET_ID, ID.unique(), videoFile, filePermissions);
        videoId = uploadedVideo.$id;
      }
      if (thumbnailFile) {
        const uploadedThumb = await storage.createFile(BUCKET_ID, ID.unique(), thumbnailFile, filePermissions);
        thumbnailId = uploadedThumb.$id;
      }

      const docPermissions = [Permission.read(Role.any())];
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        Title: form.Title.trim(),
        Name: form.Name.trim(),
        Description: form.Description.trim(),
        Category: form.Category,
        Location: form.Location.trim(),
        videoId,
        thumbnailId,
      }, docPermissions);

      alert("Vlog saved successfully!");
      setForm({ Title: "", Name: "", Description: "", Category: "", Location: "" });
      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreview(null);
      setThumbPreview(null);
    } catch (err) {
      alert("Error: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#00f2fe" },
      secondary: { main: "#fe4fafff" },
    },
  });

  return (
    <Box className="addvlog-root">
      <div className="addvlog-bg">
        <div className="addvloggradient-orb orb-1" />
        <div className="addvloggradient-orb orb-2" />
        <div className="addvloggradient-orb orb-3" />
      </div>

      <Box className="addvlogform-card" data-aos="fade-up">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600, letterSpacing: 1 }} data-aos="zoom-in">
          Add Vlog 🎬
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <p style={{ color: "red" }}>
            Note: Only videos up to 15 seconds can be uploaded.
          </p>

          <Stack spacing={2}>
            <TextField label="Vlog Title" name="Title" value={form.Title} onChange={handleChange} required fullWidth InputLabelProps={{ style: { color: '#d1d5db' } }} sx={{ input: { color: '#fff' } }} />
            <TextField label="Author Name" name="Name" value={form.Name} onChange={handleChange} required fullWidth InputLabelProps={{ style: { color: '#d1d5db' } }} sx={{ input: { color: '#fff' } }} />
            <TextField label="Description" name="Description" value={form.Description} onChange={handleChange} required multiline minRows={4} fullWidth InputLabelProps={{ style: { color: '#d1d5db' } }} sx={{ textarea: { color: '#fff' } }} />
            <TextField label="Location" name="Location" value={form.Location} onChange={handleChange} placeholder="e.g. Bangalore, Karnataka" fullWidth InputLabelProps={{ style: { color: '#d1d5db' } }} sx={{ input: { color: '#fff' } }} />
            <TextField select label="Select Category" name="Category" value={form.Category} onChange={handleChange} required InputLabelProps={{ style: { color: '#d1d5db' } }} sx={{ select: { color: '#fff' } }}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            <ThemeProvider theme={theme}>
              <Button variant="contained" component="label" color="secondary" sx={{ fontWeight: 600, letterSpacing: 1 }} data-aos="fade-right">
                Upload Video
                <input type="file" accept="video/*" hidden onChange={handleVideoChange} />
              </Button>
              {videoPreview && (
                <video data-aos="zoom-in" width="100%" controls src={videoPreview} style={{ borderRadius: 10, marginTop: 10 }} />
              )}

              <Button variant="contained" component="label" color="warning" sx={{ fontWeight: 600, letterSpacing: 1 }} data-aos="fade-left">
                Upload Thumbnail
                <input type="file" accept="image/*" hidden onChange={handleThumbChange} />
              </Button>
              {thumbPreview && (
                <img data-aos="flip-up" src={thumbPreview} alt="Thumbnail Preview" style={{ width: "100%", borderRadius: 10, marginTop: 10 }} />
              )}
            </ThemeProvider>

            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ fontWeight: 700, letterSpacing: 1 }} data-aos="zoom-in-up">
              {loading ? "Saving..." : "Publish Vlog"}
            </Button>


          </Stack>

        </Box>
        <Button type="submit" onClick={() => navigate("/Vlog")} variant="contained" color="warning" disabled={loading} sx={{ fontWeight: 700, letterSpacing: 1, marginTop: "15px", marginLeft: "150px" }} data-aos="zoom-in-up">
          Vlog
        </Button>
        <Button type="submit" onClick={() => navigate("/")} variant="contained" color="success" disabled={loading} sx={{ fontWeight: 700, letterSpacing: 1, marginTop: "15px", marginLeft: "250px" }} data-aos="zoom-in-up">
          Home
        </Button>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ ml: 5, mt: 1.3 }}>
          ← Back
        </Button>
      </Box>
    </Box>
  );
}
