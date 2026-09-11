<!-- For Backend -->
npm install
npm start

docker build -t docker-demo .
<!-- Built  -->
docker run -p 3000:3000 docker-demo

visit: 
http://localhost:3000


<!-- For Frontend -->
docker build -t todo-frontend .

docker images

docker run -p 8080:80 todo-frontend

visit : http://localhost:8080