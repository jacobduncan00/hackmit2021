# HackMIT 2021 Hurricane Damage Detector
Hack MIT 2021 Project Repository: Hurricane Damage Detection Web App

## How to run
### Note: To reduce install time, run in conda env 
```
cd python &&  pip3 install -r requirements.txt && python3 main.py
```
then in seperate terminal
```
cd web && npm i && npm run start
```

## Team

- Jacob Duncan - Salisbury University
- Justin Ventura - Salisbury University
- Blaine Mason - Salisbury University
- Jenna Bustami - University of California Berkley

## Inspiration:
With a majority of the team being from Salisbury, Maryland we encouter many hurricanes each year.  Luckily, what makes impact near us is rarely fatal or destructive, but with a rapidly changing climate we cannot guarantee safety.  

Just earlier this August, hurricane Ida tragically made landfall in Louisiana leaving many without housing, electricity, and in some cases, their lives.  Information about hurricane evacuation and/or preparing for a hurricane is not very easily accessible, and the motivation behind this web application is to not only raise awareness, but to help those potentially in danger be prepared to take action during a hurricane before it's too late.  

## What it does:
Hurricane Damage Detection provides resources to evacuate/prepare for a hurricane, historical information about previous hurricanes, and a live feed for storms.  Currently, we are able to provide information about severity of past storms(1980s-Present), but unable to provide live danger measurements.  The only thing missing is the function to compute this measurement.  We attempted, but with each variable in a tropical cyclone it is challenging to manage the weights.  We would like to possibly investigate doing this in a research project.

## What's next for Hurricane Damage Detector
In the future we hope to add the following features:
- The ability to get evactuation routes based on current location.
- Live damage updates, for instance when the storm is 200km out allow nearby counties to know how in danger they are.
  - We were close to this, but ran out of time to test all cases.
- More information provided after the questionnaire is filled out.
- The ability to download the .csv of past storm.
- Provide tools like nearby Zipcars to assist in evacuation.

## What we learned
- How to develop a fullstack application.
- Working as a team to provide efficient code to who needs it.
- Sleep is required for the best work to be done.
- Communication helps avoid unnecessary confusion.

## Technicals:
- Tech Stack: JavaScript, React, TailwindCSS, Formik, Python, Flask
- API: Google Maps API
- Data: National Hurricane Center Dataset
