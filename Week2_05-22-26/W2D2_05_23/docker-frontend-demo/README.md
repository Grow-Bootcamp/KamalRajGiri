docker build -t docker-frontend-demo .

 docker images

 docker run -d -p 8080:80 --name todo-frontend-container docker-frontend-demo

  docker ps

  visit : http://localhost:8080 


  <!-- for yml -->
  <!-- docker compose up -->
  <!-- docker compose up -d -->

  <!-- Visit : http://localhost:8080 -->