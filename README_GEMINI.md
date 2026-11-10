# Setting Up Gemini API for AI Code Review

## Issue: AI Code Review Not Working

If you're experiencing issues with the AI code review feature not providing responses, it's likely due to a missing or invalid Gemini API key.

## How to Fix

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://ai.google.dev/) or [MakerSuite](https://makersuite.google.com/)
   - Sign in with your Google account
   - Create a new API key

2. **Add the API Key to Your Project**:
   - Open the `.env` file in the root directory of your project
   - Find the line that says `GEMINI_API_KEY=your_gemini_api_key_here`
   - Replace `your_gemini_api_key_here` with your actual API key
   - Save the file

3. **Verify the API Key**:
   - Run the test script to verify your API key is working:
     ```
     python test_gemini_api.py
     ```
   - If successful, you should see confirmation that the API key is valid and working

4. **Restart Your Application**:
   - Restart your Flask application to apply the changes

## Troubleshooting

If you're still experiencing issues after adding your API key:

1. **Check API Key Format**:
   - Ensure there are no extra spaces or characters in your API key
   - The key should start with "AI" followed by alphanumeric characters

2. **Check API Quota**:
   - Google may limit the number of requests you can make with a free API key
   - Check your usage in the Google AI Studio dashboard

3. **Network Issues**:
   - Ensure your server has internet access to reach Google's API servers

4. **Fallback Mode**:
   - If you cannot get a Gemini API key, the application will use fallback mode
   - In fallback mode, predefined reviews will be shown instead of AI-generated ones

## Need More Help?

If you continue to experience issues, please check the Google Generative AI documentation or contact support. 