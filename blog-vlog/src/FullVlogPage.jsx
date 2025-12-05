import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { databases } from "./lib/appwrite";
import { Card, CardContent, CardMedia, Typography, Grid, Button, Box, Stack } from "@mui/material";

import AOS from "aos";
import "aos/dist/aos.css";
import "./Vlog.css";

const DATABASE_ID = "68d7e4db00031ecceb59";
const COLLECTION_ID = "vlog";
const BUCKET_ID = "68d806a40003e90025e6";
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io";
const PROJECT_ID = "68d7e24c0033b9d1e47b";

export default function FullVlogList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 760,
            easing: "ease-out-cubic",
            once: true,
            offset: 120,
        });
    }, []);

    // ensure AOS and layout are refreshed after images and cards render
    useEffect(() => {
        if (!loading) {
            // small delay to let images finish rendering, then refresh AOS and reflow layout
            const t = setTimeout(() => {
                AOS.refresh(); // make sure AOS knows about the buttons and cards
                // ensure the buttons are in normal flow (uncomment if you want the page to scroll to them automatically)
                // document.getElementById('vlog-buttons')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 160);
            return () => clearTimeout(t);
        }
    }, [loading, data]);


    const fetchVlogsData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
            setData(res.documents || []);
        } catch (err) {
            console.error("Fetch error (FullVlogList):", err);
            setError("Failed to fetch vlogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVlogsData();
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
            : "";

    if (loading) return <div style={{ padding: 16,textAlign: "center", mt: 4,fontSize:"40px" }}>Loading vlogs...</div>;
    if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;

    return (
        <Box className="vlogpage-root" sx={{ pb: 8 }}>
            <Typography variant="h3" align="center" gutterBottom >
                All Vlogs
            </Typography>


            <Grid container spacing={3}>
                {data.length === 0 ? (
                    <Typography variant="body1" align="center" sx={{ width: "100%" }}>
                        No Vlogs Found
                    </Typography>
                ) : (
                    // NOTE: this maps ALL fetched vlogs (no slice) so the full list is shown
                    data.map((row, index) => (
                        <Grid item xs={12} sm={6} md={4} key={row.$id} >
                            <Card
                                className="blog-card"
                                sx={{
                                    ml: 2,
                                    width: 450,
                                    height: 600,
                                    boxShadow: 3,
                                    cursor: "pointer",
                                    marginBottom: "70px",
                                    marginLeft: "150px",
                                    marginTop: "90px"

                                }}
                                onClick={() => navigate(`/vlog/${row.$id}`)} // single click navigates to detail
                                data-aos="zoom-in-up"
                                data-aos-delay={index * 80}
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
                                            maxHeight: 380,
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
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {row.Summary ?? ""}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                    ))
                )}


            </Grid>

            <Box
                id="vlog-buttons"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 6,
                    width: "100%",
                    clear: "both",
                    // ensure the buttons are visible above other elements
                    position: "relative",
                    zIndex: 9999,
                    // add some padding and a visible background for debugging
                    pb: 4,
                    // optionally: a temporary visible background to debug overlap
                    // backgroundColor: "rgba(255,255,255,0.6)",
                }}
            >
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(-1)}
                        data-aos="fade-up"
                        sx={{ minWidth: 120, px: 2 }}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/vlog")}
                        data-aos="fade-up"
                        sx={{ minWidth: 120, px: 2 }}
                    >
                        Vlog
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/")}
                        disabled={loading}
                        data-aos="fade-up"
                        sx={{ minWidth: 120, px: 2 }}
                    >
                        Home
                    </Button>
                </Stack>
            </Box>

        </Box>
    );
}
