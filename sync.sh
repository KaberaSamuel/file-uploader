#!/bin/bash

# Sync latest code
git fetch origin
git reset --hard origin/main
git clean -fd -e .env

# Update node modules for frontend
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Update node modules for backend
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Sync complete and dependencies installed."
 