# High Availability Containerized Application Deployment Project - Group 4

## First time instructions:
- Ensure Docker is installed. Initialize a Docker Swarm with the command `docker swarm init`.
- Create environment variables for DB_PASSWORD and PG_PASSWORD in `/etc/environment` by adding `export DB_PASSWORD=yourpassword` and `export PG_PASSWORD=yourpassword` to the file. Restart GCP VM for variables to take effect.
- Download ZIP file and upload to GCP VM and unzip the provided files. You may need to run `chmod +x /staging/build_web.sh` and `chmod +x run_slotmachine.sh` to update the execute permissions.
- Run bash `/staging/build_web.sh`.

## Run Instructions:
- Run bash `run_slotmachine.sh` with sudoer permissions.
- To stop, run `docker stack rm myapp'.
