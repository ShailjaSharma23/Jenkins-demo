const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "test.json");

function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

function readStoredStudent() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")).student;
    } catch (error) {
        return null;
    }
}

const server = http.createServer((req, res) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    const reqUrl = req.url ? req.url.split("?")[0] : "/";

    // Handle student registration
    if (req.method === "POST" && reqUrl === "/register") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            try {
                const student = JSON.parse(body);

                if (!student.password || student.password.length < 6) {
                    throw new Error("Password must contain at least 6 characters");
                }

                student.passwordHash = hashPassword(student.password);
                delete student.password;

                const data = {
                    student: student
                };

                fs.writeFileSync(
                    DATA_FILE,
                    JSON.stringify(data, null, 4)
                );

                res.writeHead(200, {
                    "Content-Type": "application/json",
                    ...corsHeaders
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "Student registered successfully!"
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json",
                    ...corsHeaders
                });

                res.end(JSON.stringify({
                    success: false,
                    message: error.message || "Invalid data"
                }));
            }
        });

        return;
    }

    if (req.method === "POST" && reqUrl === "/login") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const credentials = JSON.parse(body);
                const student = readStoredStudent();
                const isValid = student && student.email === credentials.email &&
                    student.passwordHash === hashPassword(credentials.password || "");

                res.writeHead(isValid ? 200 : 401, {
                    "Content-Type": "application/json",
                    ...corsHeaders
                });
                res.end(JSON.stringify({
                    success: isValid,
                    message: isValid ? "Login successful!" : "Invalid email or password."
                }));
            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json",
                    ...corsHeaders
                });
                res.end(JSON.stringify({ success: false, message: "Invalid login data." }));
            }
        });

        return;
    }

    // Serve files
    let relativePath = reqUrl === "/" ? "index.html" : "." + reqUrl;
    const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, "");
    const filePath = path.join(__dirname, safePath);

    const ext = path.extname(filePath);

    const contentTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json"
    };

    fs.readFile(filePath, (err, content) => {

        if (err) {
            res.writeHead(404, corsHeaders);
            res.end("File not found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentTypes[ext] || "text/plain",
            ...corsHeaders
        });

        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});