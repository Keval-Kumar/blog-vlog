//code without animations and background
// import React, { useState } from "react";
// import { databases, storage, ID, Permission, Role} from "./lib/appwrite";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Stack,
//   createTheme,
//   ThemeProvider,
//   MenuItem,
//   CardMedia,
// } from "@mui/material";

// import { useNavigate } from "react-router";
// const DATABASE_ID = "68d7e4db00031ecceb59";
// const COLLECTION_ID = "blog";
// const BUCKET_ID = "68d806a40003e90025e6";

// export default function AddBlog() {
//   const [form, setForm] = useState({ Title: "", Name: "", Summary: "", Content: "", Category: "", Location: "" });
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(false);
//    const navigate = useNavigate();

//   const categories = [
//     "Technology", "Travel", "Food", "Education", "Lifestyle",
//     "Health", "Finance", "Entertainment", "Sports", "Science", "Art", "History",
//     "Nature", "Politics", "Culture", "Business", "Environment", "Fashion", "Music", "Photography"
//   ];

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0] ?? null;
//     setFile(selectedFile);
//     if (selectedFile) {
//       const imageUrl = URL.createObjectURL(selectedFile);
//       setPreview(imageUrl);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imageId = null;
//       if (file) {
//         const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file, [Permission.read(Role.any())]);
//         imageId = uploadedFile.$id;
//       }

//       const docPermissions = [Permission.read(Role.any())];
//       const doc = await databases.createDocument(
//         DATABASE_ID,
//         COLLECTION_ID,
//         ID.unique(),
//         {
//           Title: form.Title.trim(),
//           Name: form.Name.trim(),
//           Summary: form.Summary.trim(),
//           Content: form.Content.trim(),
//           Category: form.Category,
//           Location: form.Location.trim(),
//           imageId: imageId,
//         },
//         docPermissions
//       );

//       alert("Saved successfully!");
//       setForm({ Title: "", Name: "", Summary: "", Content: "", Category: "", Location: "" });
//       setFile(null);
//       setPreview("");
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
//     <Box >
//       <Typography variant="h3" sx={{ textAlign: "center" }} gutterBottom>
//         Add Blog
//       </Typography>

//       <Box component="form" onSubmit={handleSubmit}>
//         <Stack spacing={2}>
//           <TextField label="Enter The Title Of The Blog" name="Title" value={form.Title} onChange={handleChange} required fullWidth />
//           <TextField label="Enter Author Name" name="Name" value={form.Name} onChange={handleChange} required fullWidth />
//           <TextField label="Enter The Summary Of The Blog" name="Summary" value={form.Summary} onChange={handleChange} required fullWidth />
//           <TextField label="Enter the Content Of the Blog" name="Content" value={form.Content} onChange={handleChange} required multiline minRows={4} fullWidth />
//           <TextField label="Location (e.g. Bangalore, Karnataka)" name="Location" value={form.Location} onChange={handleChange} placeholder="Bangalore, Karnataka" fullWidth margin="normal" />

//           <TextField select label="Select Category" name="Category" value={form.Category} onChange={handleChange} fullWidth required>
//             {categories.map((cat) => (
//               <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//             ))}
//           </TextField>

//           {/* ✅ Live Image Preview */}
//           {preview && (
//             <CardMedia
//               component="img"
//               image={preview}
//               alt="Image Preview"
//               sx={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 2 }}
//             />
//           )}

//           <ThemeProvider theme={theme}>
//             <Button variant="contained" component="label" color="customPurple">
//               Upload Image
//               <input type="file" accept="image/*" hidden onChange={handleFileChange} />
//             </Button>
//           </ThemeProvider>

//           <Button type="submit" variant="contained" color="info" disabled={loading}>
//             {loading ? "Saving..." : "Add Blog"}
//           </Button>
//         </Stack>
//         <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
//           <Button variant="outlined" onClick={() => navigate("/app")}>
//             Home
//           </Button>
//         </Stack>
//       </Box>
//     </Box>
//   );
// }


import React, { useEffect, useState } from "react";
import { databases, storage, ID, Permission, Role } from "./lib/appwrite";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  createTheme,
  ThemeProvider,
  MenuItem,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import "./addBlog.css";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "blog";
const BUCKET_ID = "68d806a40003e90025e6";

export default function AddBlog() {
  const [form, setForm] = useState({ Title: "", Name: "", Summary: "", Content: "", Category: "", Location: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  const categories = [
    "Technology",
    "Travel",
    "Food",
    "Education",
    "Lifestyle",
    "Health",
    "Finance",
    "Entertainment",
    "Sports",
    "Science",
    "Art",
    "History",
    "Nature",
    "Politics",
    "Culture",
    "Business",
    "Environment",
    "Fashion",
    "Music",
    "Photography",
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageId = null;
      if (file) {
        const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file, [Permission.read(Role.any())]);
        imageId = uploadedFile.$id;
      }

      const docPermissions = [Permission.read(Role.any())];
      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          Title: form.Title.trim(),
          Name: form.Name.trim(),
          Summary: form.Summary.trim(),
          Content: form.Content.trim(),
          Category: form.Category,
          Location: form.Location.trim(),
          imageId: imageId,
        },
        docPermissions
      );

      alert("Saved successfully!");
      setForm({ Title: "", Name: "", Summary: "", Content: "", Category: "", Location: "" });
      setFile(null);
      setPreview("");
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Error: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#647585ff" },
      secondary: { main: "#f50057" },
      customPurple: { main: "#ced699ff" },
    },
  });

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Background layers */}
      <div className="addblogpage-bg" aria-hidden="true">
        <div className="addblogbg-gradient" />
        <div className="addblogblob blob-1" />
        <div className="addblogblob blob-2" />
        <div className="addblogblob blob-3" />
        <div className="addblogglass-pattern" />
      </div>

      {/* Main content container */}
      <Box sx={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", p: { xs: 3, md: 6 } }}>
        <Typography variant="h3" sx={{ textAlign: "center", color: "#fff", textShadow: "0 6px 20px rgba(0,0,0,0.45)" }} gutterBottom data-aos="fade-down">
          Add Blog
        </Typography>

        <Box component="form" onSubmit={handleSubmit} data-aos="fade-up" sx={{ backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.06)", borderRadius: 3, p: 3, boxShadow: "0 10px 30px rgba(2,6,23,0.45)" }}>
          <Stack spacing={2}>
            <TextField label="Enter The Title Of The Blog" name="Title" value={form.Title} onChange={handleChange} required fullWidth InputLabelProps={{ style: { color: '#e8eefc' } }} sx={{ input: { color: '#fff' } }} />

            <TextField label="Enter Author Name" name="Name" value={form.Name} onChange={handleChange} required fullWidth InputLabelProps={{ style: { color: '#e8eefc' } }} sx={{ input: { color: '#fff' } }} />

            <TextField label="Enter The Summary Of The Blog" name="Summary" value={form.Summary} onChange={handleChange} required fullWidth InputLabelProps={{ style: { color: '#e8eefc' } }} sx={{ input: { color: '#fff' } }} />

            <TextField label="Enter the Content Of the Blog" name="Content" value={form.Content} onChange={handleChange} required multiline minRows={4} fullWidth InputLabelProps={{ style: { color: '#e8eefc' } }} sx={{ textarea: { color: '#fff' } }} />

            <TextField label="Location (e.g. Bangalore, Karnataka)" name="Location" value={form.Location} onChange={handleChange} placeholder="Bangalore, Karnataka" fullWidth margin="normal" InputLabelProps={{ style: { color: '#e8eefc' } }} sx={{ input: { color: '#fff' } }} />

            <TextField select label="Select Category" name="Category" value={form.Category} onChange={handleChange} fullWidth required InputLabelProps={{ style: { color: '#e8eefc' } }} sx={{ select: { color: '#fff' } }}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            {/* Live Image Preview */}
            {preview && (
              <CardMedia
                component="img"
                image={preview}
                alt="Image Preview"
                sx={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 2, transition: 'transform 0.6s cubic-bezier(.2,.9,.2,1)', '&:hover': { transform: 'scale(1.02)' } }}
                data-aos="zoom-in"
              />
            )}

            <ThemeProvider theme={theme}>
              <Button variant="contained" component="label" color="customPurple" sx={{ alignSelf: 'flex-start', transition: 'transform .18s' }} data-aos="fade-right" onMouseEnter={(e)=> e.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={(e)=> e.currentTarget.style.transform='translateY(0)'}>
                Upload Image
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
              </Button>
            </ThemeProvider>

            <Button type="submit" variant="contained" color="success" disabled={loading} data-aos="fade-left"  alignItems="center" justifyContent="center"  sx={{width: { xs: "70px", sm: "100px", md: "150px" }  ,marginLeft:"50px"}}>
              {loading ? "Saving..." : "Add Blog"}
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 1}} alignItems="end" justifyContent="end" >
            <Button variant="contained" onClick={() => navigate("/Blog")} data-aos="flip-left" sx={{ marginLeft :'50px'}}>
              Blog
            </Button>
          </Stack>
          <Button variant="contained" onClick={() => navigate(-1)} sx={{ mr: 3}}>
                                        ← Back
                                      </Button>

            <Button type="submit" onClick={() => navigate("/")}  variant="contained" color="success" disabled={loading} data-aos="fade-left" sx={{ alignSelf: 'flex-end' }}>
              Home
            </Button>
        </Box>
      </Box>
    </Box>
  );
}
