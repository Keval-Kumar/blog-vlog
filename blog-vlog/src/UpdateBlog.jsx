// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router";
// import { databases, ID, storage } from "./lib/appwrite";
// import { Box, TextField, Button, Typography, MenuItem,Stack} from "@mui/material";

// const DATABASE_ID = "68d7e4db00031ecceb59";
// const COLLECTION_ID = "blog";
// const BUCKET_ID = "68d806a40003e90025e6";
// const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
// const PROJECT_ID = "68d7e24c0033b9d1e47b";

// export default function UpdateBlog() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     Title: "",
//     Name: "",
//     Summary: "",
//     Content: "",
//     imageId: "",
//     Category: "",
//     Location: ""
//   });
//   const [newImage, setNewImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(true);

//   const categories = [
//     "Technology", "Travel", "Food", "Education", "Lifestyle",
//     "Health", "Finance", "Entertainment", "Sports", "Science", "Art", "History",
//     "Nature", "Politics", "Culture", "Business", "Environment", "Fashion", "Music", "Photography"
//   ];

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const res = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
//         setForm({
//           Title: res.Title || "",
//           Name: res.Name || "",
//           Summary: res.Summary || "",
//           Content: res.Content || "",
//           imageId: res.imageId || "",
//           Category: res.Category || "",
//           Location: res.Location || ""
//         });

//         if (res.imageId) {
//           setPreview(`${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${res.imageId}/view?project=${PROJECT_ID}`);
//         }
//       } catch (err) {
//         console.error("Error fetching blog:", err);
//         alert("Failed to fetch blog data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlog();
//   }, [id]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setNewImage(selectedFile);
//       const localPreview = URL.createObjectURL(selectedFile);
//       setPreview(localPreview); // ✅ Instantly show new image preview
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let updatedImageId = form.imageId;

//       if (newImage) {
//         if (form.imageId) {
//           try {
//             await storage.deleteFile(BUCKET_ID, form.imageId);
//           } catch (err) {
//             console.warn("⚠️ Old image delete failed:", err);
//           }
//         }
//         const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), newImage);
//         updatedImageId = uploaded.$id;
//       }

//       await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
//         Title: form.Title,
//         Name: form.Name,
//         Summary: form.Summary,
//         imageId: updatedImageId,
//         Content: form.Content,
//         Category: form.Category,
//         Location: form.Location
//       });

//       alert("✅ Blog updated successfully!");
//       navigate(`/blog/${id}`);
//     } catch (err) {
//       console.error("Error updating blog:", err);
//       alert("❌ Failed to update blog.");
//     }
//   };

//   if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;

//   return (
//     <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
//       <Typography variant="h5" sx={{ mb: 3 }}>✏️ Update Blog</Typography>

//       <form onSubmit={handleSubmit}>
//         <TextField fullWidth label="Title" name="Title" value={form.Title} onChange={handleChange} sx={{ mb: 2 }} />
//         <TextField fullWidth label="Author Name" name="Name" value={form.Name} onChange={handleChange} sx={{ mb: 2 }} />
//         <TextField fullWidth label="Summary" name="Summary" multiline rows={3} value={form.Summary} onChange={handleChange} sx={{ mb: 3 }} />
//         <TextField fullWidth label="Content" name="Content" multiline rows={4} value={form.Content} onChange={handleChange} sx={{ mb: 3 }} />

//         <TextField select fullWidth label="Category" name="Category" value={form.Category} onChange={handleChange} sx={{ mb: 3 }}>
//           {categories.map((cat) => (
//             <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//           ))}
//         </TextField>

//         <TextField fullWidth label="Location" name="Location" value={form.Location} onChange={handleChange} sx={{ mb: 3 }} />

//         {/* ✅ Live Image Preview */}
//         {preview && (
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2">Current / New Image:</Typography>
//             <img src={preview} alt="Blog Preview" style={{ width: "100%", maxHeight: "250px", objectFit: "contain", borderRadius: "8px" }} />
//           </Box>
//         )}

//         <Button variant="outlined" component="label" sx={{ mb: 3 }}>
//           Upload New Image
//           <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//         </Button>

//         {newImage && <Typography variant="body2" color="text.secondary">Selected: {newImage.name}</Typography>}

//         <Button type="submit" variant="contained" color="primary">Update Blog</Button>
//          <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
//                 <Button variant="outlined" onClick={() => navigate("/app")}>
//                   Home
//                 </Button>
//               </Stack>
//       </form>
//     </Box>
//   );
// }

// UpdateBlog.jsx (AOS + external CSS — dark cool theme)
// UpdateBlog.jsx (AOS + external CSS — refined dark cool theme)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { databases, ID, storage } from "./lib/appwrite";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './UpdateBlog.css';
import { Box, TextField, Button, Typography, MenuItem, Stack } from "@mui/material";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "blog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Title: "",
    Name: "",
    Summary: "",
    Content: "",
    imageId: "",
    Category: "",
    Location: ""
  });
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "Technology", "Travel", "Food", "Education", "Lifestyle",
    "Health", "Finance", "Entertainment", "Sports", "Science", "Art", "History",
    "Nature", "Politics", "Culture", "Business", "Environment", "Fashion", "Music", "Photography"
  ];

  useEffect(() => {
    // init AOS with subtle easing
    AOS.init({ duration: 640, easing: 'ease-out-cubic', once: true, offset: 120 });
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        setForm({
          Title: res.Title || "",
          Name: res.Name || "",
          Summary: res.Summary || "",
          Content: res.Content || "",
          imageId: res.imageId || "",
          Category: res.Category || "",
          Location: res.Location || ""
        });

        if (res.imageId) {
          setPreview(`${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${res.imageId}/view?project=${PROJECT_ID}`);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Failed to fetch blog data.");
      } finally {
        setLoading(false);
        setTimeout(() => AOS.refresh(), 60);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setNewImage(selectedFile);
      const localPreview = URL.createObjectURL(selectedFile);
      setPreview(localPreview); // ✅ Instantly show new image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedImageId = form.imageId;

      if (newImage) {
        if (form.imageId) {
          try {
            await storage.deleteFile(BUCKET_ID, form.imageId);
          } catch (err) {
            console.warn("⚠️ Old image delete failed:", err);
          }
        }
        const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), newImage);
        updatedImageId = uploaded.$id;
      }

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
        Title: form.Title,
        Name: form.Name,
        Summary: form.Summary,
        imageId: updatedImageId,
        Content: form.Content,
        Category: form.Category,
        Location: form.Location
      });

      alert("✅ Blog updated successfully!");
      setTimeout(() => AOS.refresh(), 80);
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("❌ Failed to update blog.");
    }
  };

  if (loading) return <Typography sx={{ p: 3,textAlign: "center", mt: 4,fontSize:"40px" }}>Loading...</Typography>;

  return (
    <Box className="updateblog-shell" sx={{ p: 4, maxWidth: 920, mx: "auto",mt:4,mb:3 }} data-aos="fade-up">
      <Box className="updateblog-container" data-aos="fade-down" data-aos-duration="800">
        <Typography variant="h5" sx={{ mb: 3 }} className="page-title">✏️ Update Blog</Typography>

        <form onSubmit={handleSubmit} className="update-form">
          <TextField fullWidth label="Title" name="Title" value={form.Title} onChange={handleChange} className="field" />
          <TextField fullWidth label="Author Name" name="Name" value={form.Name} onChange={handleChange} className="field" />
          <TextField fullWidth label="Summary" name="Summary" multiline rows={3} value={form.Summary} onChange={handleChange} className="field" />
          <TextField fullWidth label="Content" name="Content" multiline rows={6} value={form.Content} onChange={handleChange} className="field" />

          <TextField select fullWidth label="Category" name="Category" value={form.Category} onChange={handleChange} className="field">
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Location" name="Location" value={form.Location} onChange={handleChange} className="field" />

          {/* ✅ Live Image Preview */}
          {preview && (
            <Box className="preview-card" data-aos="zoom-in">
              <Typography variant="subtitle2" className="preview-label">Current / New Image:</Typography>
              <img src={preview} alt="Blog Preview" className="preview-image" />
            </Box>
          )}

          <Button variant="contained" component="label" className="upload-btn">
            Upload New Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>

          {newImage && <Typography variant="body2" className="selected-file">Selected: {newImage.name}</Typography>}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center">
            <Button type="submit" variant="contained" className="primary-btn">Update Blog</Button>
            <Button variant="contained" color="info" onClick={() => navigate('/app')} className="ghost-btn">Home</Button>
          </Stack>
          <Button variant="contained" onClick={() => navigate(-1)} sx={{ mr: 3}}>
                                                  ← Back
                                                </Button>
        </form>
      </Box>
    </Box>
  );
}

/*
UpdateBlog.css (place in same folder as UpdateBlog.jsx)
Refined dark-cool theme: stronger but elegant gradient for page, frosted glass form with accent borders + AOS-friendly micro-animations
*/

/* File: UpdateBlog.css */

