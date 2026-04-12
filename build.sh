#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
python3.12 -m pip install -r requirements.txt

# Create static files
echo "Collecting static files..."
python3.12 manage.py collectstatic --noinput

# Run migrations (for demo SQLite DB)
echo "Running migrations..."
python3.12 manage.py migrate --noinput

echo "Build complete."
