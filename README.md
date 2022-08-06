# Home Library Service

## Downloading

```
git clone https://github.com/oakov/nodejs2022Q2-service
```

## Installing NPM modules

```
cd nodejs2022Q2-service
git checkout dev-logging
npm i
```

## Running application

```
docker compose up --build
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

App restarts after making changes to src folder.

To scan the application image

```
npm run scan:app
```

To scan the database image

```
npm run scan:db
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

<!-- To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging -->
