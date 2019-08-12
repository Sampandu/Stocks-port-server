# Stock Portfolio App (server)

## Overview

The app runs on a Node/Express server and is powered by React on the front end. It allows the user to buy a stock, view a list of transactions he/she has made and review the performance of a list of stocks whose prices continuously rise and fall throughout the day. It is deployed at https://stocks-port.herokuapp.com/.

## Funtionalities/Features

1. Allow the user to create a account with an email that can only register once.
2. Allow the user access his/her account via email and password.
3. Allow the user to buy shares of stock at its current price.
4. Allow the user to view a list of all transactions he/she has made to date.
5. Allow the user to view a list of stocks along with their current values.
   1. Red color of stock symbols indicates the current price is less than the day's open price.
   2. Grey color of stock symbols indicates the current price is less than the day's open price.
   3. Green color of stock symbols indicates the current price is less than the day's open price.
6. Proper error handling: form validations and data cleanup have been done in order to successfully save data, fetch data and render components.
7. DRY code:
   1. Utility functions for data manipulation, data fetching.
   2. Use modularized structure: create "Stocklist" component to render a list of stocks and indicate performance dynamically, create "Loading" screen when fetching a list of stocks and transactions.
8. Readability: write documentation and comments to increase code readability and maintainability.

## To run this locally:

1. clone this repo (Stocks-port-server)
2. go to https://iexcloud.io/, apply for a test token and set up in the repo
3. npm install
4. npm run createdb
5. npm run start
6. Go to https://github.com/Sampandu/Stocks-port and follow the instructions in the readme to run the client-side locally
