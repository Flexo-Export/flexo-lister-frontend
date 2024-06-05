# Flexo-Lister

## Overview

Flexo-Lister is a tool designed to automate the process of listing and organizing equipment details along with their images. The tool provides a frontend interface for users to input equipment details, upload and arrange images, and then automatically creates structured directories and generates documentation files.

## Features

- **File Upload and Rearrangement**: Upload multiple images and rearrange them to reflect the desired order.
- **Automatic Directory Creation**: Automatically creates directories based on company and stock numbers.
- **Image Renaming**: Renames images based on manufacturer, model, and stock number in the order specified.
- **Coversheet Generation**: Generates a detailed coversheet document with equipment details.
- **Duplicate Stock Number Check**: Prevents duplicate stock numbers by checking existing directories.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **File Handling**: Multer, File System (fs)
- **Document Generation**: Python, python-docx
- **Authentication and API Integration**: Google APIs (Gmail)

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- Python (v3.6 or higher)
- pip (Python package installer)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/flexo-lister.git
   cd flexo-lister
   ```
2. Install Node.js dependencies:

    ```bash
    npm install
    ```

3. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```
4. Set up enviornment variables:
Create a `.env` file in the root directory and add the following variables:

    ```.env
    GMAIL_CLIENT_ID=your_google_client_id
    GMAIL_CLIENT_SECRET=your_google_client_secret
    GMAIL_REFRESH_TOKEN=your_google_refresh_token
    DROPBOX_ACCESS_TOKEN=your_dropbox_access_token
    WORDPRESS_URL=your_wordpress_site_url
    WORDPRESS_USERNAME=your_wordpress_username
    WORDPRESS_PASSWORD=your_wordpress_password
    ```

5. Obtain Google API credentials and save them as `credentials.json` in the root directory.


## Usage

### Starting the Server

Start the server using Nodemon:

    ```bash
    npx nodemon src/server.ts
    ```

The server will start on port 3000. Open your browser and navigate to http://localhost:3000 to access the frontend interface.

### Uploading Files and Generating Listings
1. Fill out the Form: Input the equipment details in the form fields. Fields in the orange box are mandatory, while others are optional.
2. Upload Images: Upload multiple images and rearrange them by dragging and dropping to reflect the desired order.
3. Submit the Form: Click the submit button to process the files. The backend will:
        - Create directories based on company and stock numbers.
        - Rename images based on the specified order.
        - Generate a coversheet document with the provided details.
        - Check for duplicate stock numbers.
## Directory Structure
The directory structure for listings will be organized as follows:

```css
Copy code
listings/
└── [owner_company]/
    └── [stock_number]/
        ├── [manufacturer] [model] [stock_number][A-Z].jpg
        ├── ...
        └── [stock_number] Coversheet.docx
```

### Error Handling
**Duplicate Stock Number**: If a duplicate stock number is detected, an error message will be displayed, and the process will be halted.
**Invalid Email Format**: If the email format is invalid, an error message will be displayed.


## API Endpoints
#### POST /api/listing
Creates a new listing with the provided equipment details and uploaded images.

##### Request Body:
`stock_number` (required)
`manufacturer` (optional)
`model` (optional)
`owner_company` (required)
`images` (required, multipart/form-data)
Additional optional fields...
##### Environment Variables
`GMAIL_CLIENT_ID`: Google API Client ID
`GMAIL_CLIENT_SECRET`: Google API Client Secret
`GMAIL_REFRESH_TOKEN`: Google API Refresh Token
`DROPBOX_ACCESS_TOKEN`: Dropbox API Access Token
`WORDPRESS_URL`: WordPress site URL
`WORDPRESS_USERNAME`: WordPress username
`WORDPRESS_PASSWORD`: WordPress password

## Development
### File Structure
```css
Copy code
flexo-lister/
├── src/
│   ├── controllers/
│   │   └── listingController.ts
│   ├── utils/
│   │   ├── fileHandler.ts
│   │   └── generate_coversheet.py
│   ├── views/
│   │   └── form.ejs
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
├── requirements.txt
└── README.md
```
### Adding New Features
To add new features, follow these steps:

1. **Create a New Branch**:

```bash
git checkout -b feature-name
```

2. **Implement Feature**: Make necessary changes and additions in the codebase.

3. **Test**: Ensure your changes work correctly by testing the application.

4. **Commit and Push**:

```bash
git add .
git commit -m "Add feature-name"
git push origin feature-name
Create a Pull Request: Open a pull request on GitHub to merge your changes into the main branch.
```

## Contributing
We welcome contributions! Please read our Contributing Guidelines for more information.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
Special thanks to all contributors and the open-source community for their support and contributions.

