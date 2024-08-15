# CNV-web-app-mock-up

# Setup

CNV Web Application Setup Guide
===============================

This guide provides step-by-step instructions to clone, install, and run the CNV Web Application on your local computer.

Table of Contents
-----------------

*   [Prerequisites](#prerequisites)
*   [Cloning the Repository](#cloning-the-repository)
*   [Installing Dependencies](#installing-dependencies)
*   [Running the Application](#running-the-application)
*   [Additional Notes](#additional-notes)

Prerequisites
-------------

Before you begin, ensure that you have the following installed on your computer:

*   **Node.js**: Version 14.x or higher is recommended.
*   **Git**: For cloning the repository.

### Installing Node.js

1.  **Download Node.js**: Visit the [official Node.js website](https://nodejs.org/) and download the LTS (Long Term Support) version suitable for your operating system.
2.  **Install Node.js**: Run the installer and follow the on-screen instructions.
3.  **Verify Installation**: Open your terminal or command prompt and run:
    
        node -v
    
    This should display the installed Node.js version.

### Installing Git

1.  **Download Git**: Visit the [official Git website](https://git-scm.com/downloads) and download the version suitable for your operating system.
2.  **Install Git**: Run the installer and follow the on-screen instructions.
3.  **Verify Installation**: Open your terminal or command prompt and run:
    
        git --version
    
    This should display the installed Git version.

Cloning the Repository
----------------------

1.  **Open Terminal/Command Prompt**: Navigate to the directory where you want to clone the project.
2.  **Clone the Repository**: Run the following command to clone the repository:
    
        git clone https://github.com/philip-hub/CNV-web-app-mock-up.git
    
3.  **Navigate to the Project Directory**:
    
        cd CNV-web-app-mock-up
    

Installing Dependencies
-----------------------

The project uses **React** and **Next.js** along with other dependencies listed in the `package.json` file.

1.  **Install Dependencies**: Ensure you're in the project directory (`CNV-web-app-mock-up`) and run:
    
        npm install
    
    This command reads the `package.json` file and installs all necessary packages.
    
    _Alternatively_, if you prefer using **Yarn**, you can run:
    
        yarn
    
2.  **Verify Installation**: After the installation completes, you should see a `node_modules` directory in the project folder.

Running the Application
-----------------------

1.  **Start the Development Server**:
    
        npm run dev
    
    _Or with Yarn_:
    
        yarn dev
    
2.  **Access the Application**: Once the server starts, open your web browser and navigate to:
    
        http://localhost:3000
    
    You should see the CNV Web Application running.
3.  **Stopping the Server**: To stop the development server, go back to your terminal where the server is running and press `Ctrl + C`.

Additional Notes
----------------

*   **Environment Variables**: If the application requires any environment variables, ensure you set them up in a `.env` file in the project root. Refer to the project documentation or maintainers for specific environment variable requirements.
*   **Building for Production**: To build the application for production, run:
    
        npm run build
    
    _Or with Yarn_:
    
        yarn build
    
    After building, you can start the production server with:
    
        npm start
    
    _Or with Yarn_:
    
        yarn start
    
*   **Learn More About Next.js**: The application is built using Next.js. To familiarize yourself with its features and capabilities, visit the [Next.js Documentation](https://nextjs.org/docs).
*   **Troubleshooting**: If you encounter any issues during setup or running the application, consider the following:
    *   Ensure all prerequisites are correctly installed.
    *   Check for any error messages in the terminal and address them accordingly.
    *   Consult the project's [GitHub Issues](https://github.com/philip-hub/CNV-web-app-mock-up/issues) page for similar problems and solutions.
    *   Reach out to the project maintainers for support.

By following this guide, you should be able to set up and run the CNV Web Application on your local machine successfully. Happy coding!

# Make the app run faster

On Windows find your chrome shrotcut click.

Right click and click properties

In the properties window click shortcuts.

In the target input box, you will see:

`"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" `

Change it to:

`"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --max-old-space-size=8212`

This will allocate 8 GB of ram to Chrome.

Restart Google Chrome

## Other Speed Techniques:

Use a wired fiber optic ethernet if possible

# Credits

Extensive help from Dr. Karol SzLachta and feedback from Dr. Gang Wu

Build for Applied Bioinformatics at St Jude Childrens Research Hospital

# Other Credits
<a href="https://icon-icons.com/icon/DNA/132453" target="_blank">Favicon</a>

