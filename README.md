**Release Notes Shaking Salt Version 1.0 **

*Software Features *

* Searching for a food item via text

* Previously searched items are available on the first page

* Details of a chosen food item given a list of items that match the keyword

    * Details emphasize sodium level and calories

    * Details also show other nutritional information such as minerals and vitamins

    * Details automatically updated based on a serving size specified by the user

* Food item can be logged

* Logged items are displayed on the main screen

* Suggested lower sodium alternative food items are available for each food item that is selected

*Bug Fixes and New Features Since Last Demo (Demo 3, Sprint 4) *

* *New Feature:* Sodium level is displayed next to the items on the search result list

    * Color has been added (red for not recommended, green for within sodium level)

* *New Feature*: Logged items broken down by days instead of being a single list

* *Bug Fix:* Text input area for specifying now work for both iOS and Android environments

*Known Bugs and Defects *

<table>
  <tr>
    <td>Bug</td>
    <td>Details</td>
    <td>Solution </td>
  </tr>
  <tr>
    <td>Food items can result in errors when attempting to view their details</td>
    <td>This is due to the fact that the food items on the USDA database have been stored with no standardized variable conventions. That is, given a food item, the sodium level could be under "foodLabel > nutrition > sodium > name", “nutritionalInformation > sodium > value”, “foodIdentification > nutrition > sodium > value”, or any combination of structures. </td>
    <td>We highly recommend that a different, more well maintained database is used to replace the USDA database. The code has been modularized so that it is easy to replace the database without affecting any other functionality of the application.  </td>
  </tr>
  <tr>
    <td>Deployment to App store (iOS) / Play store (Android)</td>
    <td>This is not a bug but in order for the application to be accessible to the public, the team who will receive this code should publish it on the app and play store</td>
    <td>N/A</td>
  </tr>
</table>


*Missing Functionality *

* All functions that were in scope and a part of the Minimum Viable Product have been implemented in the latest version of this application

**Install Guide - Shaking Salt 1.0**

**_Important Note 1: _***Since this app is not in the production stage yet (currently not available on the iOS App Store or Google Play Store), The following instructions are made specifically for developers who will take over the project and are responsible for signing the app before release.*

**_Important Note 2: _***Since USDA is the main Database used in this application, developers assigned by CDC (our client) who take over this project need to get an API Key from **[https://fdc.nal.usda.gov/api-guide.htm*l](https://fdc.nal.usda.gov/api-guide.html)*. After getting a new API key, refer to the DOWNLOAD section for the usage of this API Key. *

**PRE-REQUISITES**

* You must have NodeJS (version 10 or higher) and npm (version 6 or higher; comes with recent versions of NodeJS) installed on your computer. NodeJS and npm can be downloaded from: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

    * *Note:  This application was written using NodeJS version +12 and npm version of +6*

**DEPENDENCIES**

* Download and install yarn (dependency manager) from: [https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install)

* **Download and install the expo client **by following the instructions on: [https://docs.expo.io/versions/v35.0.0/get-started/installation/](https://docs.expo.io/versions/v35.0.0/get-started/installation/) . This step can be simply achieved by making sure that ‘npm’ is added to your system environmental variables after installing NodeJS/npm and running the following from a terminal:

npm install -g expo-cli

**DOWNLOAD**

* Download a zip version of the entire Shaking Salt GitHub repository (or clone) from: [https://github.com/messinarnd/ShakingSalt](https://github.com/messinarnd/ShakingSalt)

* *Refer to Important Note 2 above: *after getting a new registered API key, create a file called Keys.js under the ‘values’ folder under the ‘src’ directory and put this one line in that file:

export const USDA_API_KEY = 'YOUR_API_KEY_HERE';

**Adding the API Key just as mentioned above is required before building and running the application.**

**BUILD**

*Since no .apk (Android) or .ipa (iOS) files are available yet, this step is necessary (***_only once)_*** for running Shaking Salt 1.0:*

* Open up a terminal (console), change directory (cd) into the directory where you have the ShakingSalt files downloaded (and extracted if zip) from the DOWNLOAD step, and run:

npm install

This will install all the required packages/dependencies used in this app.

*Note: at the end of this step, you might receive a warning regarding low severity vulnerabilities, although this might not change anything as far as the app goes, however, we recommend running *npm audit fix*.*

**INSTALLATION & RUNNING APPLICATION**

* Once the necessary npm packages are installed (once), in a terminal in the directory where all the Shaking Salt files reside, run the following to start the application:

expo start

*Note: you should be able to also perform this step (or the build) using yarn.*

This will automatically start the expo client within a new tab on the default set browser (all information is also visible from the terminal as well). Once you see the message "Tunnel Ready" you should be able to run the app on either an Android emulator/device or an iOS emulator/device (requires a machine running macOS).

*Important Note: For testing on a real device, we highly recommend downloading the expo app *and launching our app by scanning the QR code within the expo app.

**For more information regarding testing, please refer to:** [https://docs.expo.io/versions/latest/guides/testing-on-devices/](https://docs.expo.io/versions/latest/guides/testing-on-devices/)

**TROUBLESHOOTING**

Most likely problems typically happen after running expo start from a terminal successfully. Some common issues are regarding testing on emulators (and devices):

* Make sure Keys.js is added correctly with your API Key (see section on DOWNLOAD )

* if your emulator just keeps saying "building javascript bundles" over and over, open the dev tools in your browser and uncheck "pause on exception"

* For problems with the Android emulator, try steps mentioned here: [https://docs.expo.io/versions/latest/workflow/android-studio-emulator/](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/)

* Watchman can sometimes cause issues with starting the app (leading to SHA not computed errors), there’s not a common known fix to this problem on Windows computers. Some possible fixes include: https://github.com/expo/expo/issues/2743

