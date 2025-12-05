// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router";
// import { databases, storage, ID } from "./lib/appwrite";
// import {
//     TextField,
//     Button,
//     Box,
//     Typography,
//     CardMedia,
//     Stack,
//     CircularProgress,
// } from "@mui/material";

// const DATABASE_ID = "68d7e4db00031ecceb59";
// const COLLECTION_ID = "vlog";
// const BUCKET_ID = "68d806a40003e90025e6";
// const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
// const PROJECT_ID = "68d7e24c0033b9d1e47b";

// export default function UpdateVlog() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [vlog, setVlog] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [updating, setUpdating] = useState(false);

//     const [title, setTitle] = useState("");
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [category, setCategory] = useState("");
//     const [location, setLocation] = useState("");

//     const [videoFile, setVideoFile] = useState(null);
//     const [thumbnailFile, setThumbnailFile] = useState(null);
//     const [previewVideo, setPreviewVideo] = useState("");
//     const [previewThumbnail, setPreviewThumbnail] = useState("");

//     const getFileViewUrl = (fileId) =>
//         fileId
//             ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
//             : "";

//     // ✅ Fetch existing vlog data
//     useEffect(() => {
//         const fetchVlog = async () => {
//             try {
//                 const res = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
//                 setVlog(res);
//                 setTitle(res.Title || "");
//                 setName(res.Name || "");
//                 setDescription(res.Description || "");
//                 setCategory(res.Category || "");
//                 setLocation(res.Location || "");
//                 if (res.thumbnailId) setPreviewThumbnail(getFileViewUrl(res.thumbnailId));
//                 if (res.videoId) setPreviewVideo(getFileViewUrl(res.videoId));
//             } catch (err) {
//                 console.error("❌ Error fetching vlog:", err);
//                 alert("Vlog not found or deleted");
//                 navigate("/Vlog");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchVlog();
//     }, [id, navigate]);

//     // ✅ Instant preview for new files
//     const handleThumbnailChange = (e) => {
//         const file = e.target.files[0];
//         setThumbnailFile(file);
//         if (file) setPreviewThumbnail(URL.createObjectURL(file));
//     };

//     const handleVideoChange = (e) => {
//         const file = e.target.files[0];
//         setVideoFile(file);
//         if (file) setPreviewVideo(URL.createObjectURL(file));
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         if (!vlog) return;

//         setUpdating(true);
//         try {
//             let videoId = vlog.videoId || null;
//             let thumbnailId = vlog.thumbnailId || null;

//             // ✅ Upload new video if selected
//             if (videoFile) {
//                 const uploadedVideo = await storage.createFile(BUCKET_ID, ID.unique(), videoFile);
//                 videoId = uploadedVideo.$id;
//             }

//             // ✅ Upload new thumbnail if selected
//             if (thumbnailFile) {
//                 const uploadedThumb = await storage.createFile(BUCKET_ID, ID.unique(), thumbnailFile);
//                 thumbnailId = uploadedThumb.$id;
//             }

//             const safeVlogId = vlog.VlogId && !isNaN(parseInt(vlog.VlogId)) ? parseInt(vlog.VlogId) : 0;
//             const safeViews = String(Number(vlog.views) || 0);
//             const safeLikes = String(Number(vlog.likes) || 0);

//             const updatedData = {
//                 Title: title.trim(),
//                 Name: name.trim(),
//                 Description: description.trim(),
//                 Category: category,
//                 Location: location.trim(),
//                 VlogId: safeVlogId,
//                 views: safeViews,
//                 likes: safeLikes,
//                 videoId,
//                 thumbnailId,
//             };

//             await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, updatedData);

//             alert("✅ Vlog updated successfully!");
//             navigate(`/vlog/${id}`);
//         } catch (err) {
//             console.error("❌ Error updating vlog:", err);
//             alert("Error updating vlog: " + err.message);
//         } finally {
//             setUpdating(false);
//         }
//     };

//     if (loading) return <Box sx={{ padding: 4 }}>Loading vlog...</Box>;

//     return (
//         <Box sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
//             <Typography variant="h4" gutterBottom>
//                 Update Vlog
//             </Typography>
//             <form onSubmit={handleUpdate}>
//                 <TextField label="Title" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} required />
//                 <TextField label="Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} required />
//                 <TextField label="Description" fullWidth multiline rows={4} sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} required />
//                 <TextField label="Category" fullWidth sx={{ mb: 2 }} value={category} onChange={(e) => setCategory(e.target.value)} />
//                 <TextField label="Location" fullWidth sx={{ mb: 2 }} value={location} onChange={(e) => setLocation(e.target.value)} />

//                 {/* ✅ Live Thumbnail Preview */}
//                 {previewThumbnail && (
//                     <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle2">Thumbnail Preview:</Typography>
//                         <CardMedia component="img" image={previewThumbnail} alt="Thumbnail Preview" sx={{ width: "100%", height: 200, objectFit: "cover", mb: 1 }} />
//                     </Box>
//                 )}
//                 <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ marginBottom: "16px" }} />

//                 {/* ✅ Live Video Preview */}
//                 {previewVideo && (
//                     <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle2">Video Preview:</Typography>
//                         <video src={previewVideo} controls style={{ width: "100%", height: 250, objectFit: "cover", marginBottom: "8px" }} />
//                     </Box>
//                 )}
//                 <input type="file" accept="video/*" onChange={handleVideoChange} style={{ marginBottom: "16px" }} />

//                 <Button type="submit" variant="contained" color="primary" disabled={updating}>
//                     {updating ? <CircularProgress size={24} color="inherit" /> : "Update Vlog"}
//                 </Button>
//                 <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
//                     <Button variant="outlined" onClick={() => navigate("/app")}>
//                         Home
//                     </Button>
//                 </Stack>
//             </form>
//         </Box>
//     );
// }


// UpdateVlog.jsx (AOS + external CSS)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { databases, storage, ID } from "./lib/appwrite";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./UpdateVlog.css";
import {
    TextField,
    Button,
    Box,
    Typography,
    CardMedia,
    Stack,
    CircularProgress,
} from "@mui/material";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "vlog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

export default function UpdateVlog() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vlog, setVlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");

    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [previewVideo, setPreviewVideo] = useState("");
    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const getFileViewUrl = (fileId) =>
        fileId
            ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`
            : "";

    // init AOS
    useEffect(() => {
        AOS.init({ duration: 640, easing: 'ease-out-cubic', once: true, offset: 120 });
    }, []);

    // ✅ Fetch existing vlog data
    useEffect(() => {
        const fetchVlog = async () => {
            try {
                const res = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
                setVlog(res);
                setTitle(res.Title || "");
                setName(res.Name || "");
                setDescription(res.Description || "");
                setCategory(res.Category || "");
                setLocation(res.Location || "");
                if (res.thumbnailId) setPreviewThumbnail(getFileViewUrl(res.thumbnailId));
                if (res.videoId) setPreviewVideo(getFileViewUrl(res.videoId));
            } catch (err) {
                console.error("❌ Error fetching vlog:", err);
                alert("Vlog not found or deleted");
                navigate("/Vlog");
            } finally {
                setLoading(false);
                setTimeout(() => AOS.refresh(), 60);
            }
        };
        fetchVlog();
    }, [id, navigate]);

    // ✅ Instant preview for new files
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnailFile(file);
        if (file) setPreviewThumbnail(URL.createObjectURL(file));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);
        if (file) setPreviewVideo(URL.createObjectURL(file));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!vlog) return;

        setUpdating(true);
        try {
            let videoId = vlog.videoId || null;
            let thumbnailId = vlog.thumbnailId || null;

            // ✅ Upload new video if selected
            if (videoFile) {
                const uploadedVideo = await storage.createFile(BUCKET_ID, ID.unique(), videoFile);
                videoId = uploadedVideo.$id;
            }

            // ✅ Upload new thumbnail if selected
            if (thumbnailFile) {
                const uploadedThumb = await storage.createFile(BUCKET_ID, ID.unique(), thumbnailFile);
                thumbnailId = uploadedThumb.$id;
            }

            const safeVlogId = vlog.VlogId && !isNaN(parseInt(vlog.VlogId)) ? parseInt(vlog.VlogId) : 0;
            const safeViews = String(Number(vlog.views) || 0);
            const safeLikes = String(Number(vlog.likes) || 0);

            const updatedData = {
                Title: title.trim(),
                Name: name.trim(),
                Description: description.trim(),
                Category: category,
                Location: location.trim(),
                VlogId: safeVlogId,
                views: safeViews,
                likes: safeLikes,
                videoId,
                thumbnailId,
            };

            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, updatedData);

            alert("✅ Vlog updated successfully!");
            navigate(`/vlog/${id}`);
        } catch (err) {
            console.error("❌ Error updating vlog:", err);
            alert("Error updating vlog: " + err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <Box sx={{ padding: 4, textAlign: "center", fontSize: "40px" }}>Loading vlog...</Box>;

    return (
        <Box className="updatevlog-shell" data-aos="fade-up">
            <Box className="updatevlog-container" data-aos="fade-down">
                <Typography variant="h4" gutterBottom data-aos="fade-right">Update Vlog</Typography>

                <form onSubmit={handleUpdate} className="updatevlog-form">
                    <p style={{ color: "red" }}>
                        Note: Only videos up to 15 seconds can be uploaded.
                    </p>

                    <TextField label="Title" fullWidth sx={{ mb: 2 }} value={title} onChange={(e) => setTitle(e.target.value)} required data-aos="fade-left" />
                    <TextField label="Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} required data-aos="fade-left" />
                    <TextField label="Description" fullWidth multiline rows={4} sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} required data-aos="fade-up" />
                    <TextField label="Category" fullWidth sx={{ mb: 2 }} value={category} onChange={(e) => setCategory(e.target.value)} data-aos="fade-up" />
                    <TextField label="Location" fullWidth sx={{ mb: 2 }} value={location} onChange={(e) => setLocation(e.target.value)} data-aos="fade-up" />

                    {/* ✅ Live Thumbnail Preview */}
                    {previewThumbnail && (
                        <Box sx={{ mb: 2 }} data-aos="zoom-in">
                            <Typography variant="subtitle2">Thumbnail Preview:</Typography>
                            <CardMedia component="img" image={previewThumbnail} alt="Thumbnail Preview" sx={{ width: "100%", height: 200, objectFit: "cover", mb: 1 }} />
                        </Box>
                    )}
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ marginBottom: "16px" }} />

                    {/* ✅ Live Video Preview */}
                    {previewVideo && (
                        <Box sx={{ mb: 2 }} data-aos="zoom-in">
                            <Typography variant="subtitle2">Video Preview:</Typography>
                            <video src={previewVideo} controls style={{ width: "100%", height: 250, objectFit: "cover", marginBottom: "8px" }} />
                        </Box>
                    )}
                    <input type="file" accept="video/*" onChange={handleVideoChange} style={{ marginBottom: "16px" }} />

                    <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" data-aos="fade-up">
                        <Button type="submit" variant="contained" color="primary" disabled={updating}>
                            {updating ? <CircularProgress size={24} color="inherit" /> : "Update Vlog"}
                        </Button>
                        <Button variant="contained" onClick={() => navigate("/app")}>Home</Button>
                        <Button variant="contained" onClick={() => navigate(-1)}>
                            ← Back
                        </Button>
                    </Stack>

                </form>
            </Box>
        </Box>
    );
}

/*
UpdateVlog.css (place in same folder as UpdateVlog.jsx)
Cool dark-gradient background with frosted form card and AOS-friendly touch
*/

/* File: UpdateVlog.css */
