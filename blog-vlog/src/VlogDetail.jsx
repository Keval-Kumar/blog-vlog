// // VlogDetail.jsx (patched) correct
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router";
// import { databases, storage } from "./lib/appwrite";
// import { ID } from "appwrite";
// import {
//   Box,
//   Typography,
//   CardMedia,
//   Button,
//   TextField,
//   Stack,
//   Divider,
//   Card,
//   CardContent,
// } from "@mui/material";

// const DATABASE_ID = "68d7e4db00031ecceb59";
// const COLLECTION_ID = "vlog";
// const BUCKET_ID = "68d806a40003e90025e6";
// const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
// const PROJECT_ID = "68d7e24c0033b9d1e47b";

// function getSessionId() {
//   let sid = localStorage.getItem("SessionId");
//   if (!sid) {
//     sid = ID.unique();
//     localStorage.setItem("SessionId", sid);
//   }
//   return sid;
// }

// /* parseCommentsField and safeUpdateCommentsOnServer unchanged (copy from your version) */
// function parseCommentsField(raw) {
//   if (!raw) return [];
//   if (Array.isArray(raw)) {
//     return raw.map((c) => (typeof c === "object" ? c : { $id: ID.unique(), text: String(c), $createdAt: new Date().toISOString() }));
//   }
//   if (typeof raw === "string") {
//     try {
//       const p = JSON.parse(raw);
//       return parseCommentsField(p);
//     } catch {
//       if (raw.includes("|~|")) {
//         return raw.split("|~|").map((t, i) => ({ $id: `fallback-${i}`, text: t, $createdAt: new Date().toISOString() }));
//       }
//       return [{ $id: "legacy-0", text: raw, $createdAt: new Date().toISOString() }];
//     }
//   }
//   if (typeof raw === "object") {
//     return Object.values(raw).flatMap((v) => parseCommentsField(v));
//   }
//   return [{ $id: ID.unique(), text: String(raw), $createdAt: new Date().toISOString() }];
// }

// function prepareNumericForServer(currentValue, newNumber) {
//   if (typeof currentValue === "string") return String(newNumber);
//   return Number(newNumber);
// }

// async function safeUpdateCommentsOnServer(doc, updatedComments) {
//   const commentsCurrent = doc?.comments;
//   const willSendString = typeof commentsCurrent === "string" || commentsCurrent === undefined;
//   const payload = {};

//   if (willSendString) {
//     try {
//       payload.comments = JSON.stringify(updatedComments);
//       if (doc?.Category) payload.Category = doc.Category;
//       await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
//       return { ok: true, storedAs: "json-string" };
//     } catch (err) {
//       try {
//         const latest = updatedComments[0]?.text ?? "";
//         const compact = `${latest}`.slice(0, 90);
//         payload.comments = compact;
//         if (doc?.Category) payload.Category = doc.Category;
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
//         return { ok: true, storedAs: "compact-string" };
//       } catch (err2) {
//         return { ok: false, error: err2 };
//       }
//     }
//   } else {
//     try {
//       payload.comments = updatedComments;
//       if (doc?.Category) payload.Category = doc.Category;
//       await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
//       return { ok: true, storedAs: "array" };
//     } catch (err) {
//       try {
//         payload.comments = JSON.stringify(updatedComments);
//         if (doc?.Category) payload.Category = doc.Category;
//         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
//         return { ok: true, storedAs: "json-string" };
//       } catch (err2) {
//         try {
//           const compact = (updatedComments[0]?.text ?? "").slice(0, 90);
//           payload.comments = compact;
//           if (doc?.Category) payload.Category = doc.Category;
//           await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
//           return { ok: true, storedAs: "compact-string" };
//         } catch (err3) {
//           return { ok: false, error: err3 };
//         }
//       }
//     }
//   }
// }

// export default function VlogDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [vlog, setVlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [likesCount, setLikesCount] = useState(0);
//   const [comments, setComments] = useState([]);
//   const [viewsCount, setViewsCount] = useState(0);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [commentText, setCommentText] = useState("");

//   const sessionId = getSessionId();
//   const mountedRef = useRef(false);

//   useEffect(() => {
//     if (!id) return;

//     async function load() {
//       setLoading(true);
//       try {
//         const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
//         setVlog(doc);

//         // likes: robust parse
//         const rawLikes = doc.likes;
//         const likes = Number(rawLikes) || 0;
//         setLikesCount(likes);

//         // views: parse base value but don't increment twice
//         const rawViews = doc.views;
//         const baseViews = Number(rawViews) || 0;
//         setViewsCount(baseViews);

//         // comments
//         const parsed = parseCommentsField(doc.comments);
//         setComments(parsed);

//         // liked state from localStorage or stored likedBy array on doc
//         const localLikeKey = `liked_blog_${id}_${sessionId}`;
//         const likedLocally = !!localStorage.getItem(localLikeKey);
//         const likedBy = Array.isArray(doc.likedBy) ? doc.likedBy : [];
//         setHasLiked(likedLocally || likedBy.includes(sessionId));

//         // record view once per session (update DB with same type as stored)
//         const viewedKey = `viewed_blog_${id}_${sessionId}`;
//         if (!localStorage.getItem(viewedKey)) {
//           const newViews = baseViews + 1;
//           const payload = { views: prepareNumericForServer(rawViews, newViews) };
//           if (doc?.Category) payload.Category = doc.Category;
//           try {
//             await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, payload);
//             setViewsCount(newViews);
//             localStorage.setItem(viewedKey, "1");
//           } catch (err) {
//             console.warn("View increment failed; continuing locally:", err);
//             setViewsCount(newViews);
//             localStorage.setItem(viewedKey, "1");
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load vlog:", err);
//       } finally {
//         setLoading(false);
//         mountedRef.current = true;
//       }
//     }

//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   async function toggleLike() {
//     if (!vlog) return;
//     const localLikeKey = `liked_blog_${id}_${sessionId}`;

//     try {
//       const likedNow = hasLiked;
//       const newNumber = likedNow ? Math.max(likesCount - 1, 0) : likesCount + 1;

//       // Always include Category (use existing or fallback)
//       const categoryValue = vlog.Category ?? vlog.category ?? "General";

//       // Always send likes as a string (Appwrite expects string <= 500 chars)
//       const payload = {
//         likes: String(newNumber),
//         Category: categoryValue,
//       };

//       await databases.updateDocument(DATABASE_ID, COLLECTION_ID, vlog.$id, payload);

//       // update UI/state/localStorage
//       setLikesCount(newNumber);
//       setHasLiked(!likedNow);
//       if (!likedNow) localStorage.setItem(localLikeKey, "1");
//       else localStorage.removeItem(localLikeKey);

//       setVlog((prev) => ({ ...(prev || {}), likes: payload.likes, Category: categoryValue }));
//     } catch (err) {
//       console.error("toggleLike failed:", err);
//       alert("Could not toggle like. See console for details.");
//     }
//   }

//   async function postComment() {
//     const text = commentText.trim();
//     if (!text) return;
//     if (!vlog) return;

//     const newComment = {
//       $id: ID.unique(),
//       text,
//       sessionId,
//       $createdAt: new Date().toISOString(),
//     };

//     const currentParsed = parseCommentsField(vlog.comments);
//     const updatedComments = [newComment, ...currentParsed];

//     const res = await safeUpdateCommentsOnServer(vlog, updatedComments);

//     if (res.ok) {
//       setComments(parseCommentsField(updatedComments));
//       setCommentText("");
//       // update local vlog so future updates know current type
//       setVlog((prev) => {
//         const next = { ...(prev || {}) };
//         if (res.storedAs === "array") next.comments = updatedComments;
//         else next.comments = JSON.stringify(updatedComments);
//         return next;
//       });
//       alert("Comment posted");
//     } else {
//       console.error("Failed to save comment:", res.error);
//       alert("Could not save comment. See console for details.");
//     }
//   }

//   const handleDelete = async () => {
//     if (!vlog) return;
//     if (!window.confirm("Are you sure you want to delete this vlog?")) return;
//     try {
//       if (vlog.videoId) await storage.deleteFile(BUCKET_ID, vlog.videoId);
//       if (vlog.thumbnailId) await storage.deleteFile(BUCKET_ID, vlog.thumbnailId);
//       await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, vlog.$id);
//       alert("Deleted");
//       navigate("/vlogs");
//     } catch (err) {
//       console.error("delete failed:", err);
//       alert("Delete failed");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!vlog) return <div>Vlog not found</div>;

//   const getFileViewUrl = (fileId) =>
//     fileId ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}` : "";

//   const createdAt = vlog["$createdAt"] || vlog.createdAt;
//   const createdAtText = createdAt ? new Date(createdAt).toLocaleString() : "—";

//   return (
//     <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         {vlog.Title}
//       </Typography>

//       {vlog.videoId && (
//         <Card sx={{ mb: 2 }}>
//           <CardMedia component="video" height="480" src={getFileViewUrl(vlog.videoId)} controls />
//           {vlog.thumbnailId && (
//             <CardContent>
//               <Typography variant="caption">Thumbnail available</Typography>
//             </CardContent>
//           )}
//         </Card>
//       )}

//       <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//         By: {vlog.Name}
//       </Typography>

//       <Typography sx={{ mt: 2 }}>{vlog.Summary}</Typography>
//       <Typography variant="body1" sx={{ mt: 2 }}>
//         {vlog.Content}
//       </Typography>

//       <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1 }} alignItems="center">
//         <Typography variant="subtitle2">
//           Category: <strong>{vlog.Category ?? "Uncategorized"}</strong>
//         </Typography>
//         <Typography variant="subtitle2">Published: {createdAtText}</Typography>
//         <Typography variant="subtitle2">Location: {vlog.Location ?? "Not specified"}</Typography>
//       </Stack>

//       <Divider sx={{ my: 2 }} />

//       <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
//         <Button variant="outlined" onClick={() => navigate("/vlogs")}>
//           ← Back
//         </Button>
//         <Button variant="outlined" color="error" onClick={handleDelete}>
//           Delete Vlog
//         </Button>
//         <Button variant="contained" color="primary" onClick={() => navigate(`/update/vlog/${vlog.$id}`)}>
//           Update Vlog
//         </Button>

//         <Button variant={hasLiked ? "contained" : "outlined"} onClick={toggleLike}>
//           {hasLiked ? "Liked" : "Like"} ({likesCount})
//         </Button>

//         <Typography variant="body2" color="text.secondary">
//           Views: {viewsCount}
//         </Typography>
//       </Stack>

//       <Divider sx={{ my: 2 }} />

//       <Typography variant="h6">Comments ({comments.length})</Typography>

//       <Stack spacing={1} sx={{ my: 2 }}>
//         <TextField
//           label="Write a comment"
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           multiline
//           minRows={2}
//           fullWidth
//         />
//         <Button variant="contained" onClick={postComment}>
//           Post Comment
//         </Button>
//       </Stack>

//       <Stack spacing={2} sx={{ mt: 2 }}>
//         {comments.length === 0 && <Typography color="text.secondary">No comments yet — be first!</Typography>}
//         {comments.map((c) => (
//           <Box key={c.$id} sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }}>
//             <Typography variant="body2">{c.text}</Typography>
//             <Typography variant="caption" color="text.secondary">
//               {new Date(c.$createdAt || c.createdAt).toLocaleString()}
//             </Typography>
//           </Box>
//         ))}
//         <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
//           <Button variant="outlined" onClick={() => navigate("/app")}>
//             Home
//           </Button>
//         </Stack>
//       </Stack>
//     </Box>
//   );
// }




// VlogDetail.jsx (AOS + external CSS)
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { databases, storage } from "./lib/appwrite";
import { ID } from "appwrite";
import AOS from 'aos';
import 'aos/dist/aos.css';
import './VlogDetail.css';
import {
  Box,
  Typography,
  CardMedia,
  Button,
  TextField,
  Stack,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "vlog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

function getSessionId() {
  let sid = localStorage.getItem("SessionId");
  if (!sid) {
    sid = ID.unique();
    localStorage.setItem("SessionId", sid);
  }
  return sid;
}

/* parseCommentsField and safeUpdateCommentsOnServer unchanged (copy from your version) */
function parseCommentsField(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((c) => (typeof c === "object" ? c : { $id: ID.unique(), text: String(c), $createdAt: new Date().toISOString() }));
  }
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      return parseCommentsField(p);
    } catch {
      if (raw.includes("|~|")) {
        return raw.split("|~|").map((t, i) => ({ $id: `fallback-${i}`, text: t, $createdAt: new Date().toISOString() }));
      }
      return [{ $id: "legacy-0", text: raw, $createdAt: new Date().toISOString() }];
    }
  }
  if (typeof raw === "object") {
    return Object.values(raw).flatMap((v) => parseCommentsField(v));
  }
  return [{ $id: ID.unique(), text: String(raw), $createdAt: new Date().toISOString() }];
}

function prepareNumericForServer(currentValue, newNumber) {
  if (typeof currentValue === "string") return String(newNumber);
  return Number(newNumber);
}

async function safeUpdateCommentsOnServer(doc, updatedComments) {
  const commentsCurrent = doc?.comments;
  const willSendString = typeof commentsCurrent === "string" || commentsCurrent === undefined;
  const payload = {};

  if (willSendString) {
    try {
      payload.comments = JSON.stringify(updatedComments);
      if (doc?.Category) payload.Category = doc.Category;
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
      return { ok: true, storedAs: "json-string" };
    } catch (err) {
      try {
        const latest = updatedComments[0]?.text ?? "";
        const compact = `${latest}`.slice(0, 90);
        payload.comments = compact;
        if (doc?.Category) payload.Category = doc.Category;
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
        return { ok: true, storedAs: "compact-string" };
      } catch (err2) {
        return { ok: false, error: err2 };
      }
    }
  } else {
    try {
      payload.comments = updatedComments;
      if (doc?.Category) payload.Category = doc.Category;
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
      return { ok: true, storedAs: "array" };
    } catch (err) {
      try {
        payload.comments = JSON.stringify(updatedComments);
        if (doc?.Category) payload.Category = doc.Category;
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
        return { ok: true, storedAs: "json-string" };
      } catch (err2) {
        try {
          const compact = (updatedComments[0]?.text ?? "").slice(0, 90);
          payload.comments = compact;
          if (doc?.Category) payload.Category = doc.Category;
          await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, payload);
          return { ok: true, storedAs: "compact-string" };
        } catch (err3) {
          return { ok: false, error: err3 };
        }
      }
    }
  }
}

export default function VlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vlog, setVlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [viewsCount, setViewsCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  const sessionId = getSessionId();
  const mountedRef = useRef(false);

  useEffect(() => {
    // init AOS (visual only)
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, mirror: false });
  }, []);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      try {
        const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        setVlog(doc);

        // likes: robust parse
        const rawLikes = doc.likes;
        const likes = Number(rawLikes) || 0;
        setLikesCount(likes);

        // views: parse base value but don't increment twice
        const rawViews = doc.views;
        const baseViews = Number(rawViews) || 0;
        setViewsCount(baseViews);

        // comments
        const parsed = parseCommentsField(doc.comments);
        setComments(parsed);

        // liked state from localStorage or stored likedBy array on doc
        const localLikeKey = `liked_blog_${id}_${sessionId}`;
        const likedLocally = !!localStorage.getItem(localLikeKey);
        const likedBy = Array.isArray(doc.likedBy) ? doc.likedBy : [];
        setHasLiked(likedLocally || likedBy.includes(sessionId));

        // record view once per session (update DB with same type as stored)
        const viewedKey = `viewed_blog_${id}_${sessionId}`;
        if (!localStorage.getItem(viewedKey)) {
          const newViews = baseViews + 1;
          const payload = { views: prepareNumericForServer(rawViews, newViews) };
          if (doc?.Category) payload.Category = doc.Category;
          try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, payload);
            setViewsCount(newViews);
            localStorage.setItem(viewedKey, "1");
          } catch (err) {
            console.warn("View increment failed; continuing locally:", err);
            setViewsCount(newViews);
            localStorage.setItem(viewedKey, "1");
          }
        }
      } catch (err) {
        console.error("Failed to load vlog:", err);
      } finally {
        setLoading(false);
        mountedRef.current = true;
        // refresh AOS to pick up new elements
        setTimeout(() => AOS.refresh(), 50);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function toggleLike() {
    if (!vlog) return;
    const localLikeKey = `liked_blog_${id}_${sessionId}`;

    try {
      const likedNow = hasLiked;
      const newNumber = likedNow ? Math.max(likesCount - 1, 0) : likesCount + 1;

      // Always include Category (use existing or fallback)
      const categoryValue = vlog.Category ?? vlog.category ?? "General";

      // Always send likes as a string (Appwrite expects string <= 500 chars)
      const payload = {
        likes: String(newNumber),
        Category: categoryValue,
      };

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, vlog.$id, payload);

      // update UI/state/localStorage
      setLikesCount(newNumber);
      setHasLiked(!likedNow);
      if (!likedNow) localStorage.setItem(localLikeKey, "1");
      else localStorage.removeItem(localLikeKey);

      setVlog((prev) => ({ ...(prev || {}), likes: payload.likes, Category: categoryValue }));
    } catch (err) {
      console.error("toggleLike failed:", err);
      alert("Could not toggle like. See console for details.");
    }
  }

  async function postComment() {
    const text = commentText.trim();
    if (!text) return;
    if (!vlog) return;

    const newComment = {
      $id: ID.unique(),
      text,
      sessionId,
      $createdAt: new Date().toISOString(),
    };

    const currentParsed = parseCommentsField(vlog.comments);
    const updatedComments = [newComment, ...currentParsed];

    const res = await safeUpdateCommentsOnServer(vlog, updatedComments);

    if (res.ok) {
      setComments(parseCommentsField(updatedComments));
      setCommentText("");
      // update local vlog so future updates know current type
      setVlog((prev) => {
        const next = { ...(prev || {}) };
        if (res.storedAs === "array") next.comments = updatedComments;
        else next.comments = JSON.stringify(updatedComments);
        return next;
      });
      alert("Comment posted");
      setTimeout(() => AOS.refresh(), 60);
    } else {
      console.error("Failed to save comment:", res.error);
      alert("Could not save comment. See console for details.");
    }
  }

  const handleDelete = async () => {
    if (!vlog) return;
    if (!window.confirm("Are you sure you want to delete this vlog?")) return;
    try {
      if (vlog.videoId) await storage.deleteFile(BUCKET_ID, vlog.videoId);
      if (vlog.thumbnailId) await storage.deleteFile(BUCKET_ID, vlog.thumbnailId);
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, vlog.$id);
      alert("Deleted");
      navigate("/vlogs");
    } catch (err) {
      console.error("delete failed:", err);
      alert("Delete failed");
    }
  };

  if (loading) return <div style={ {textAlign : "center",fontSize:"40px",mt:4}}>Loading Vlog...</div>;
  if (!vlog) return <div>Vlog not found</div>;

  const getFileViewUrl = (fileId) =>
    fileId ? `${APPWRITE_ENDPOINT}/v1/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}` : "";

  const createdAt = vlog["$createdAt"] || vlog.createdAt;
  const createdAtText = createdAt ? new Date(createdAt).toLocaleString() : "—";

  return (
    <Box className="vlog-background" sx={{ maxWidth: 900, mx: "auto", p: 4,mt:3,mb:2 }} data-aos="fade-up">
      <Typography variant="h4" gutterBottom data-aos="fade-right" data-aos-delay="50">
        {vlog.Title}
      </Typography>

      {vlog.videoId && (
        <Card sx={{ mb: 2 }} data-aos="zoom-in">
          <CardMedia component="video" height="480" src={getFileViewUrl(vlog.videoId)} controls />
          {vlog.thumbnailId && (
            <CardContent>
              {/* <Typography variant="caption">Thumbnail available</Typography> */}
            </CardContent>
          )}
        </Card>
      )}

      <Typography variant="subtitle1" color="text.secondary" gutterBottom data-aos="fade-left" data-aos-delay="80">
        By: {vlog.Name}
      </Typography>

      <Typography sx={{ mt: 2 }} data-aos="fade-left" data-aos-delay="100">{vlog.Summary}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }} data-aos="fade-left" data-aos-delay="120">
        {vlog.Content}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1 }} alignItems="center" data-aos="fade-up" data-aos-delay="140">
        <Typography variant="subtitle2">
          Category: <strong>{vlog.Category ?? "Uncategorized"}</strong>
        </Typography>
        <Typography variant="subtitle2">Published: {createdAtText}</Typography>
        <Typography variant="subtitle2">Location: {vlog.Location ?? "Not specified"}</Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" data-aos="fade-up" data-aos-delay="160">
        <Button variant="outlined" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete Vlog
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate(`/update/vlog/${vlog.$id}`)}>
          Update Vlog
        </Button>

        <Button variant={hasLiked ? "contained" : "outlined"} onClick={toggleLike}>
          {hasLiked ? "Liked" : "Like"} ({likesCount})
        </Button>

        <Typography variant="body2" color="text.secondary">
          Views: {viewsCount}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" data-aos="fade-up" data-aos-delay="180">Comments ({comments.length})</Typography>

      <Stack spacing={1} sx={{ my: 2 }} data-aos="fade-up" data-aos-delay="200">
        <TextField
          label="Write a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          multiline
          minRows={2}
          fullWidth
        />
        <Button variant="contained" onClick={postComment}>
          Post Comment
        </Button>
      </Stack>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {comments.length === 0 && <Typography color="text.secondary">No comments yet — be first!</Typography>}
        {comments.map((c, idx) => (
          <Box key={c.$id} sx={{ p: 2, border: "1px solid #eee", borderRadius: 1 }} className="comment-box" data-aos="fade-up" data-aos-delay={220 + idx * 30}>
            <Typography variant="body2">{c.text}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(c.$createdAt || c.createdAt).toLocaleString()}
            </Typography>
          </Box>
        ))}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
          <Button variant="contained" onClick={() => navigate("/app")}>
            Home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

/*
VlogDetail.css (place in same folder as VlogDetail.jsx)
*/

/* File: VlogDetail.css */
/* Cool gradient background with subtle animated blobs and glassy panels */

// .vlog-background {
//   background: linear-gradient(180deg, rgba(12,18,36,1) 0%, rgba(25,40,80,1) 60%);
//   color: #f7f9fc;
//   min-height: 100vh;
//   position: relative;
//   overflow: hidden;
//   border-radius: 12px;
// }

// /* floating decorative blobs */
// .vlog-background::before,
// .vlog-background::after {
//   content: "";
//   position: absolute;
//   width: 40vmax;
//   height: 40vmax;
//   border-radius: 50%;
//   filter: blur(80px);
//   opacity: 0.12;
//   z-index: 0;
//   transform: translate(-20%, -10%);
//   animation: float 8s ease-in-out infinite;
// }
// .vlog-background::before {
//   left: -10vmax;
//   top: -20vmax;
//   background: radial-gradient(circle at 30% 30%, rgba(255,120,90,0.8), rgba(255,120,90,0.2));
// }
// .vlog-background::after {
//   right: -10vmax;
//   bottom: -20vmax;
//   background: radial-gradient(circle at 70% 70%, rgba(80,160,255,0.9), rgba(80,160,255,0.2));
//   animation-duration: 12s;
// }

// @keyframes float {
//   0% { transform: translateY(0) scale(1); }
//   50% { transform: translateY(-6%) scale(1.03); }
//   100% { transform: translateY(0) scale(1); }
// }

// /* ensure content is above the blobs */
// .vlog-background > * {
//   position: relative;
//   z-index: 1;
// }

// /* Card/video tweaks */
// .MuiCard-root {
//   background: rgba(255,255,255,0.04) !important;
//   box-shadow: 0 8px 30px rgba(2,6,23,0.45) !important;
//   border-radius: 12px !important;
// }

// .MuiCardMedia-root {
//   border-radius: 8px;
//   overflow: hidden;
//   background: #000;
// }

// /* glass-like comment boxes */
// .comment-box {
//   background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
//   backdrop-filter: blur(6px) saturate(120%);
//   border: 1px solid rgba(255,255,255,0.06);
//   transition: transform 220ms ease, box-shadow 220ms ease;
// }
// .comment-box:hover {
//   transform: translateY(-6px);
//   box-shadow: 0 12px 30px rgba(2,6,23,0.5);
// }

// /* nice spacing for Typography */
// .vlog-background .MuiTypography-root {
//   color: rgba(250,250,255,0.95);
// }

// /* responsive video */
// .MuiCardMedia-root video {
//   width: 100%;
//   height: auto;
//   display: block;
// }

// /* small screens adjustments */
// @media (max-width: 720px) {
//   .vlog-background { padding: 18px !important; border-radius: 0; }
//   .MuiCardMedia-root { height: auto !important; }
// }
