# @now

![Team Photo](Insert a Team Photo URL here)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

A simple browser extension to encourage Dartmouth students to block out time in advance for their assignments. Once signed up, users will recieve notifications of new assignments posted on Canvas, and will be prompted to select times at which to complete them. Suggested time allotments will be generated based on aggregated data from past assignments and other users.

## Architecture

The code is divided into two primary repos: The frontend chrome extension (here) and the backend api used to communicate with our database [linked here](https://github.com/dartmouth-cs52-20X/project-api-at-now).

The frontend uses react and redux to create an application window, then is packaged and deployed into google chrome using the developer mode for extensions.

A manifest file in the src code indicates to chrome that the application is an extension to be deployed. We worked to make this program compatible with te cs52 starterpack, which uses eslint, webpack, and yarn for a dev environment. The front end will allow the user to set their calendar, view notifications, and will be used for scraping canvas for new assignments.

The backend uses a combination of node.js, express, and mongo db in order to create an api that is served from heroku. The api will be used to manage user data. Specifically, to track how long a given assignment takes a user, and that information can be served back to inform future recommendations.


## AT-Now Extension Install steps
1. clone the code repo onto a local folder
2. run `yarn install` to get all needed dependencies ect  
3. run `yarn winbuild` to create a dist folder for final production 
4. on google chrome go to chrome://extensions  
5. switch to developer mode in the top right corneer by hitting the little switch  
6. click the "load unpacked" option  
7. navigate to the root folder of the project and select the dist sub directory  
8. go to the extensions and click the little a icon  
9. boom
## At-Now Extension Update steps  
- run `yarn clean`  
- repeat steps 2 - 9
## At-Now Extension Deployment
Will be through the Chrome Web Store, more later

## AT-Now Backend Install steps
1. run `yarn install` to get all needed dependencies ect  
2. run `yarn start` to run the server
3. boom

## At-Now Extension Deployment steps  
 - All changes to master will trigger a rebuild and deploy for Heroku
 - See changes at at [this URL](https://at-now-api.herokuapp.com)

## Authors

Thomas Clark
Garret Andreine
Jai Smith
Nathan Schneider
Vincent Liu
Carter Person

## Acknowledgments

### Professor

Tim Tregubov

### TAs

Ian Hou
Ziray Hao
