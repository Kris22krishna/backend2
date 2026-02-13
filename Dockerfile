# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/backend2

# Set work directory
WORKDIR /app/backend2

# Install dependencies based on requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy project files
COPY . .

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Run the application
# Assumes app/main.py is the entry point and reachable as app.main:app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
