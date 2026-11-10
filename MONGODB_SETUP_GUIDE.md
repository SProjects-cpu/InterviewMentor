# MongoDB Setup Guide for Phase 1 Migration

This guide will help you set up MongoDB for the Phase 1 migration from SQLite to MongoDB.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows Installation

1. **Download MongoDB Community Server**
   ```
   https://www.mongodb.com/try/download/community
   ```
   - Select Windows x64
   - Download the MSI installer

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB Service**
   ```bash
   # Option A: Start via Services (Windows)
   # Press Win + R, type "services.msc"
   # Find "MongoDB" service and start it

   # Option B: Start via Command Line
   net start MongoDB
   ```

4. **Verify Installation**
   ```bash
   # Open Command Prompt and run:
   mongosh
   # You should see MongoDB shell prompt
   ```

### Alternative: MongoDB with Docker

If you prefer Docker:

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Verify it's running
docker ps
```

## Option 2: MongoDB Atlas (Cloud Database)

If you prefer a cloud solution:

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create a Cluster**
   - Choose "Build a Database"
   - Select "M0 Sandbox" (Free tier)
   - Choose your preferred region

3. **Configure Access**
   - Add your IP address to whitelist
   - Create database user with password

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update Environment Variables**
   Create `.env` file in project root:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
   MONGODB_DATABASE=interview_mentor
   ```

## Environment Configuration

Create or update your `.env` file:

```env
# For Local MongoDB
MONGODB_URL=mongodb://localhost:27017/
MONGODB_DATABASE=interview_mentor

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
# MONGODB_DATABASE=interview_mentor

# Other existing variables
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret_key
```

## Testing Your Setup

After setting up MongoDB, run the test script:

```bash
python test_mongodb_setup.py
```

You should see:
```
✅ MongoDB connection successful!
✅ MongoDB initialization successful!
✅ MongoDB operations successful!
✅ Migration readiness successful!
```

## Troubleshooting

### Common Issues

1. **Connection Refused (Local MongoDB)**
   - Ensure MongoDB service is running
   - Check if port 27017 is available
   - Verify MongoDB is installed correctly

2. **Authentication Failed (Atlas)**
   - Check username/password in connection string
   - Verify IP address is whitelisted
   - Ensure database user has proper permissions

3. **Network Issues**
   - Check firewall settings
   - Verify internet connection (for Atlas)
   - Try different network if behind corporate firewall

### MongoDB Compass (GUI Tool)

MongoDB Compass provides a visual interface:
- Connection string: `mongodb://localhost:27017` (local)
- Browse collections and documents
- Run queries and view indexes

## Next Steps

Once MongoDB is set up and tests pass:

1. **Run Migration**
   ```bash
   python database/migration_scripts.py
   ```

2. **Update Flask Application**
   - The migration will automatically update `api_app.py`
   - Test all API endpoints
   - Verify data integrity

3. **Performance Testing**
   - Compare response times
   - Test concurrent users
   - Monitor memory usage

## Quick Start Commands

```bash
# 1. Install MongoDB Community Server (Windows)
# Download from: https://www.mongodb.com/try/download/community
# Run the MSI installer with "Complete" installation
# Install as Windows Service
# Install MongoDB Compass (GUI tool)

# 2. Start MongoDB Service
net start MongoDB
# OR use Services (Win + R, type "services.msc", find MongoDB service)

# 3. Verify MongoDB is running
mongosh
# Should connect to MongoDB shell

# 4. Install Python dependencies (already done)
pip install pymongo motor dnspython

# 5. Test MongoDB connection
python test_mongodb_setup.py

# 6. Initialize MongoDB database
python database/mongodb_init.py

# 7. Run migration
python database/migration_scripts.py

# 8. Test updated application
python api_app.py
```

## Support

If you encounter issues:
1. Check the logs for detailed error messages
2. Verify MongoDB is running: `mongosh` or check services
3. Test connection with MongoDB Compass
4. Review environment variables in `.env` file

The migration is designed to be safe with backup strategies, so your SQLite data will remain intact during the process.
