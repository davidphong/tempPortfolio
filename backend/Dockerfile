FROM python:3.9-slim

WORKDIR /app

# Install system dependencies required for mysqlclient and MySQL client
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    default-mysql-client \
    gcc \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create uploads directory
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Add wait script for MySQL
COPY wait-for-mysql.sh /app/wait-for-mysql.sh
RUN chmod 777 /app/wait-for-mysql.sh

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create non-root user for security but run as root for file permissions
RUN useradd -m appuser && chown -R appuser:appuser /app
# USER appuser  # Commented out to run as root for file upload permissions

EXPOSE 7331

# Start application with entrypoint
CMD ["sh", "./wait-for-mysql.sh", "db", "3370", "python", "app.py"]
