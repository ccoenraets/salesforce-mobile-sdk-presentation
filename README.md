## Salesforce Mobile SDK Presentation

This presentation is meant to run as a hybrid app built with the Mobile SDK on a mobile device. You can run it in the browser, but certain features will not be available. For example, taking a picture of the audience and share it on chatter ("You" slide). If you run this presentation in a browser, make sure you enable the Salesforce OAuth popup. Once you authorize the application, you'll be able to run the samples built directly into this presentation (list of contacts, etc).

To run the presentation in your browser, access the following URL:

[https://ccoenraets.github.io/salesforce-mobile-sdk-presentation](https://ccoenraets.github.io/salesforce-mobile-sdk-presentation)

To run this presentation on your iPad:

1. Clone this repo
2. Adjust config.xml. If you plan to run the app on device, modify *widget id* and specify an id corresponding to a provisioning profile provisioned for your device.
3. Build the project:
  ```
  cordova build ios
  ```
4. Open MobileSDKPreso.xcodeproj in Xcode
5. Run the project on your device or in an emulator
