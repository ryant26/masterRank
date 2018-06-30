# Fireteam.gg (Not Maintained)
Check individual directories for their READMEs.

## Summary
This was a web-app deployed on AWS to facilitate the process of group creation for Overwatch.
Blizzard has now added this functionality in-game so we have taken the application down.
This repo has been made public to serve as example code for anyone who may find it useful.

FYI, documentation is a little light as the team size was small.

## QuickStart
### Prerequisites
Download/Install Redis and MongoDB

### Download landing page dependencies
```
cd landingPage/
npm install
```

### Download hero API server dependencies
```
cd heroApiServer/
npm install
```

### Download socket server dependencies
```
cd socketServer/
npm install
```

### Download runAll dependencies
```
cd runAll/
npm install
```

### Start all services
cd runAll/
node runAll.js

### Start all services with mock data injected
cd runAll/
node runAll.js --mock-data