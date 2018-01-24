# overrank
Check individual directories for their READMEs.

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