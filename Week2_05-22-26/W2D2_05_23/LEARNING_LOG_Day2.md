# Learning Log: Day 2 - Docker, Caching, OAuth, CORS, and TypeScript
*September 9, 2026*

Today I studied Docker containerization, JavaScript caching, OAuth 2.0 authentication, CORS, and the fundamentals of TypeScript. The Docker and caching topics were practiced in the supplied files. OAuth, CORS, and TypeScript were reviewed as task requirements and still need a dedicated implementation example.

## What I Aimed to Learn

- Explain how Docker packages an application and its dependencies into a portable container.
- Build and run a small Node.js application in Docker.
- Understand in-memory caching, persistent browser storage, memoization, expiration, and invalidation.
- Explain the OAuth 2.0 authorization flow and the roles of access and refresh tokens.
- Understand why browsers enforce CORS and when a CORS error occurs.
- Write basic TypeScript using types, interfaces, functions, and generics.

## What I Practiced

### Docker

Docker packages an application and its dependencies into an isolated, portable environment. Containers share the host operating system kernel, so they generally use fewer resources than virtual machines, which include a complete guest operating system.

The main Docker mental model is:

```text
Dockerfile -> Image -> Container -> Running application
```

- A `Dockerfile` contains the instructions for building an image.
- An image is a read-only template used to create containers.
- A container is a running instance of an image.
- A volume stores data outside the container lifecycle.
- Port mapping connects a container port to a host port.

The practice project contains a Node 22 Express server that listens on port 3000 and responds with `Hello from Docker!`. Its Dockerfile sets `/app` as the working directory, installs dependencies, copies the source code, exposes port 3000, and starts the server with `npm start`.

Useful commands from the practice:

```bash
npm install
npm start
docker build -t docker-demo .
docker run -p 3000:3000 docker-demo
docker ps
docker logs <container>
docker stop <container>
```

The application can then be opened at `http://localhost:3000`.

### JavaScript Caching

Caching stores previously obtained data or calculated results so the application does not repeat the same work unnecessarily. It can improve response time, reduce network requests, and lower server load.

An in-memory `Map` can cache values while the JavaScript process is running:

```javascript
const cache = new Map();

function calculateSquare(number) {
  if (cache.has(number)) {
    return cache.get(number);
  }

  const result = number * number;
  cache.set(number, result);
  return result;
}
```

The first call calculates and stores the result. Later calls with the same input return the cached value. This is a form of memoization. In-memory cache is temporary and disappears when the process ends.

`localStorage` survives page refreshes and browser restarts, but it stores strings, has limited capacity, and can contain stale data. Cached data therefore needs an expiration or invalidation strategy.

The main cache strategies reviewed were:

- **Cache-aside:** the application checks the cache first and loads missing data from the backend.
- **Write-through:** the application updates the cache and backend together.
- **Write-back:** the application updates the cache first and writes to the backend later.


## Findings and Corrections for Follow-up

- Docker containers are isolated processes, not full virtual machines.
- Data stored only in a container can be lost when that container is removed; persistent data should use volumes or an external store.
- The Docker demo should include a `.dockerignore` file in a fuller project to avoid copying unnecessary files into the build context.
- In-memory and `localStorage` caches need invalidation or expiration to avoid stale data.

## Verification Checklist

- [x] Explained the difference between containers and virtual machines.
- [x] Practiced the Dockerfile-to-container workflow with the Express demo.
- [x] Practiced in-memory caching with `Map` and memoization.
- [x] Reviewed persistent browser caching with `localStorage`.
- [x] Reviewed cache-aside, write-through, and write-back strategies.
- [ ] Commit this learning log and raise the required pull request.

## Next Steps

The next study session should add executable examples for OAuth and CORS, create a small TypeScript module with a compiler configuration, and test the Docker demo locally. After those checks, this log can be updated with command output and links to the pull request.