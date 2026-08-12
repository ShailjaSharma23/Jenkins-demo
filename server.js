const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {

    // Handle student registration
    if (req.method === "POST" && req.url === "/register") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {
                const student = JSON.parse(body);

                const data = {
                    student: student
                };

                fs.writeFileSync(
                    "test.json",
                    JSON.stringify(data, null, 4)
                );

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "Student registered successfully!"
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: false,
                    message: "Invalid data"
                }));
            }
        });

        return;
    }

    // Serve files
    let filePath = req.url === "/"
        ? "index.html"
        : "." + req.url;

    const ext = path.extname(filePath);

    const contentTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json"
    };

    fs.readFile(filePath, (err, content) => {

        if (err) {
            res.writeHead(404);
            res.end("File not found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentTypes[ext] || "text/plain"
        });

        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});