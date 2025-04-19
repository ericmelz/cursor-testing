# Simple Todo App with Streamlit

A simple, customizable todo application built with Streamlit and Dockerized for easy deployment.

## Features

- Add, view, and delete todos
- Mark todos as complete/incomplete
- Customize the Add button color through settings
- Persistent storage using JSON
- Dockerized for easy deployment
- Kubernetes deployment support
- GitHub Container Registry integration
- GitHub Actions CI/CD pipeline

## Prerequisites

- Docker installed on your system
- Git (optional, for cloning the repository)
- k3d installed (for Kubernetes deployment)
- GitHub account (for GitHub Container Registry)

## Building and Running with Docker

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone git@github.com:ericmelz/cursor-testing.git
   cd cursor-testing/test1
   ```

2. **Build the Docker image**:
   ```bash
   docker build -t todo-app .
   ```

3. **Run the container**:
   ```bash
   docker run -p 9999:9999 todo-app
   ```

4. **Access the application**:
   Open your web browser and navigate to:
   ```
   http://localhost:9999
   ```

## Using Docker Compose

For local development with data persistence, you can use Docker Compose:

1. **Start the application**:
   ```bash
   docker-compose up -d
   ```

2. **Access the application**:
   ```
   http://localhost:9999
   ```

3. **Stop the application**:
   ```bash
   docker-compose down
   ```

## Pushing to GitHub Container Registry

### Manual Push

1. **Log in to GitHub Container Registry**:
   ```bash
   echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
   ```
   > Note: Replace `$CR_PAT` with your GitHub Personal Access Token and `USERNAME` with your GitHub username.

2. **Tag your image**:
   ```bash
   docker tag todo-app ghcr.io/USERNAME/todo-app:latest
   ```
   > Note: Replace `USERNAME` with your GitHub username.

3. **Push the image**:
   ```bash
   docker push ghcr.io/USERNAME/todo-app:latest
   ```
   > Note: Replace `USERNAME` with your GitHub username.

4. **Make the package public** (optional):
   Go to your GitHub profile, click on "Packages", find the `todo-app` package, and set its visibility to "Public" in the package settings.

### Automated Push with GitHub Actions

This repository includes a GitHub Actions workflow that automatically builds and pushes the Docker image to GHCR whenever:
- Changes are pushed to the main branch
- A new tag is created (v*.*.*)
- A pull request is created against the main branch

To use this feature:
1. Fork or clone this repository
2. Ensure your repository has the `GITHUB_TOKEN` secret with package write permissions
3. Push changes to the main branch or create a new tag

## Deploying to k3d from GitHub Container Registry

1. **Create a k3d cluster**:
   ```bash
   k3d cluster create todo-cluster -p "7777:80@loadbalancer"
   ```

2. **Update deployment image** (if necessary):
   Edit `k8s/deployment.yaml` to use your GHCR image:
   ```yaml
   image: ghcr.io/USERNAME/todo-app:latest
   ```
   > Note: Replace `USERNAME` with your GitHub username.

3. **Apply the Kubernetes manifests**:
   ```bash
   kubectl apply -f k8s/
   ```

4. **Access the application**:
   Open your web browser and navigate to:
   ```
   http://localhost:7777/todo
   ```

## Docker Commands

- **View running containers**:
  ```bash
  docker ps
  ```

- **Stop the container**:
  ```bash
  docker stop $(docker ps -q --filter ancestor=todo-app)
  ```

- **Remove the container**:
  ```bash
  docker rm $(docker ps -a -q --filter ancestor=todo-app)
  ```

- **Remove the image**:
  ```bash
  docker rmi todo-app
  ```

## Development

If you want to run the app locally without Docker:

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the app**:
   ```bash
   streamlit run app.py
   ```

## Notes

- The app stores todos in a `todos.json` file
- Settings are stored in the session state and reset when the app is restarted
- The default port is 9999, but you can modify it in the Dockerfile if needed
- When deployed to k3d, the app is accessible on port 7777 through the ingress controller at the /todo path
- For persistent storage in Kubernetes, consider using a PersistentVolume for the todos.json file

## Troubleshooting

If you encounter any issues:

1. **Port already in use**:
   - Make sure no other service is using port 7777
   - You can change the port in the k3d cluster creation command

2. **Container won't start**:
   - Check if the image built successfully
   - Verify that all required files are present
   - Check Docker logs for errors

3. **App not accessible**:
   - Ensure the container is running
   - Verify the port mapping is correct
   - Check your firewall settings

4. **k3d deployment issues**:
   - Verify the cluster is running: `k3d cluster list`
   - Check pod status: `kubectl get pods`
   - Check ingress status: `kubectl get ingress`
   - View pod logs: `kubectl logs -l app=todo-app`
   - Check Traefik dashboard: `kubectl port-forward -n kube-system svc/traefik 9000:9000` and visit http://localhost:9000/dashboard/

5. **GHCR authentication issues**:
   - Make sure your GitHub PAT has the right scopes (`read:packages`, `write:packages`, `delete:packages`)
   - Verify you're correctly logged in: `docker login ghcr.io`
   - Check image permissions on GitHub 