const http = require("http");
const {users , products} = require('./arr');

const server = http.createServer((req, res)=>{
    res.setHeader("Content-Type", "application/json");

    if(req.url ==='/' && req.method === 'GET'){
        res.statusCode = 200;
        res.end(JSON.stringify({
            message:"Welcome to home page!"
    }));
}

    else if (req.url === '/users' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify(users));
    } 
    else if (req.url === '/products' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify(products));
    } 
    else if(req.url === '/users' && req.method === 'POST'){
        let content = '';
        req.on('data', (chunk) => {
            content += chunk;
        });

        req.on('end' , () => {
            const newUser = JSON.parse(content);
            users.push(newUser);

            res.statusCode = 201;
            res.end(JSON.stringify({
                message:"user added successfully!",
                user: newUser
            }));
        });
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({
            message: "Route not found"
        }));
    }
});

const PORT = 3000;
server.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});