import express from "express";

const app = express();



app.get("/", (req, res) => {
    res.status(200).send("Hello, World!");
});

app.get("/readyz", (req, res) => {
    res.status(200).send("OK");
});

app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});



export default app;
