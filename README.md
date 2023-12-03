# Web App

This document provides instructions to set up and run the web app locally and how to run tests.

## Setting Up and Running Locally

1. **Clone the Repository**  
   Use the following command to clone the repository and navidate to repo:
    git clone "clone url"
    cd webapp

2. **Install Dependencies**  
Navigate to the cloned directory and install the necessary dependencies:
npm install 

3. **Run the App**  
Once the dependencies are installed, you can run the app using:
make sure you have users.csv file in /opt path of your device

npm start
test the postman

## Running Tests

To run the tests for the web app:
npm test

# Comment to import certificate

aws acm import-certificate --certificate fileb:///Users/gokuljayavel/Downloads/demo_gokul.cloud/demo_gokul_cloud.crt --private-key fileb:///Users/gokuljayavel/Downloads/demo_gokul.cloud/privatekey.pem --certificate-chain fileb:///Users/gokuljayavel/Downloads/demo_gokul.cloud/demo_gokul_cloud.ca-bundle
