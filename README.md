# Interview Mentor

Interview Mentor is a comprehensive platform designed to help users prepare for job interviews through various tools including resume building, career guidance, aptitude testing, and AI-powered coding tests.



## Features

- **Resume Builder**: Create professional resumes with customizable templates
- **Career Guidance**: Get AI-powered career advice based on your skills and interests
- **Aptitude Test**: Practice various aptitude tests including arithmetic, vocabulary, reading comprehension, and more
- **AI Coding Test**: Solve coding challenges with real-time execution and AI code review

## Prerequisites

- Python 3.8 or higher
- Node.js (for JavaScript code execution)
- Java JDK (for Java code execution)
- G++ compiler (for C++ code execution)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interview-mentor.git
cd interview-mentor
```

2. Create and activate virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

5. Run the application:
```bash
# Windows
start_app.bat
# macOS/Linux
python app.py
```

Visit `http://localhost:5000` in your browser.

## Environment Variables

Create a `.env` file with:
```
GEMINI_API_KEY=your_gemini_api_key
FLASK_SECRET_KEY=your_secret_key
DEBUG=True
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

- Flask for the web framework 
