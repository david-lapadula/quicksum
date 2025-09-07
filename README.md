# QuickSum

A Chrome extension that instantly summarizes highlighted text on any webpage using AI.

## Description

QuickSum is a browser extension designed to help users quickly generate concise summaries of selected text using OpenAI's GPT models. With just a click, you can choose the tone and response type for your summary, making it easy to digest articles, emails, or any online content. 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Configuration](#configuration)

## Installation

1. **Clone or Download the Repository**
   ```sh
   git clone https://github.com/davidlapadula/quicksum.git
   cd quicksum
   ```

2. **Open Chrome and Navigate to Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right).

3. **Load the Unpacked Extension**
   - Click "Load unpacked".
   - Select the `quicksum` project folder.

4. **Dependencies**
   - No build step or external dependencies required.
   - Requires a valid OpenAI API key (see [Configuration](#configuration)).

## Usage

1. **Select Text**  
   Highlight any text on a webpage.

2. **Open QuickSum**
   - Click the QuickSum extension icon in your browser toolbar.

3. **Choose Options**
   - Select your preferred tone and response type from the dropdown menus.

4. **Summarize**
   - Click the "Summarize" button.
   - The summary will appear in the popup.

## Features

- Summarizes any highlighted text on a webpage.
- Choose between neutral, formal, or friendly tone.
- Select summary format: concise summary, bullet points, or single sentence.
- Simple, clean popup UI.
- Uses OpenAI's GPT models for high-quality summaries.

## Configuration

### Setting Your OpenAI API Key

1. **Open `popup.js`**  
   Edit the following line to insert your own OpenAI API key:
   ````javascript
   // ...existing...
   "Authorization": "Bearer YOUR_OPENAI_API_KEY"
   // ...existing code...
````