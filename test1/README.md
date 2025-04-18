# Simple Todo App with Streamlit

A simple, customizable todo application built with Streamlit and Dockerized for easy deployment.

## Features

- Add, view, and delete todos
- Mark todos as complete/incomplete
- Customize the Add button color through settings
- Persistent storage using JSON
- Dockerized for easy deployment
- Kubernetes deployment support

## Prerequisites

- Docker installed on your system
- Git (optional, for cloning the repository)
- k3d installed (for Kubernetes deployment)

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

## Deploying to k3d

1. **Create a k3d cluster**:
   ```bash
   k3d cluster create todo-cluster -p "9999:80@loadbalancer"
   ```

2. **Load the Docker image into k3d**:
   ```bash
   k3d image import todo-app:latest -c todo-cluster
   ```

3. **Apply the Kubernetes manifests**:
   ```bash
   kubectl apply -f k8s/
   ```

4. **Access the application**:
   Open your web browser and navigate to:
   ```
   http://localhost:9999
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
- When deployed to k3d, the app is accessible on port 9999 through the ingress controller

## Troubleshooting

If you encounter any issues:

1. **Port already in use**:
   - Make sure no other service is using port 9999
   - You can change the port in the Dockerfile and update the run command accordingly

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