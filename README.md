# Balancer GUI

The Balancer GUI is a powerful, user-friendly Progressive Web Application designed to streamline the configuration and management of the Balancer API. It provides a central hub for:

* **Seamless API Control:**  Effortlessly manage and configure all aspects of your Balancer API, from setting trading parameters to monitoring performance.
* **Intuitive Interface:**  Enjoy a modern and intuitive interface designed for ease of use, making configuration and management accessible to users of all experience levels.
* **Progressive Web App Features:**  Benefit from the speed and reliability of a Progressive Web App, with offline functionality and instant updates.

The Balancer GUI empowers you to take complete control of your Value Averaging Strategy, ensuring a smooth and efficient investment experience. 




<br/>

## Scripts

Serve the application in a dev server:

```bash
npm run dev
```



Build the application:

```bash
npm run build-development

# or

npm run build-production
```



Preview the build:

```bash
npm run preview
```




<br/>

## Docker Image

[jesusgraterol/balancer-gui](https://hub.docker.com/r/jesusgraterol/balancer-gui)





<br/>

## @TODO

### High Priority

When running a build action from the CLI, the images are built and pushed to the registry so that they can be pulled by new users or those who wish to keep their Balancer platform up-to-date.

This distribution strategy makes it unviable to hard-code the `apiURL` in the `environment.production.ts` file as it will be pushed inside of the image, prohibiting users from pointing their GUIs to their APIs.

Once the correct approach has been chosen, find a way to derive the API's URL based on the GUI's URL.

**Bonus**: figure out how to properly configure the `nginx.conf/connect-src` property so the GUI can only interact with the API via any domain.



### Medium Priority

- [ ] ...



### Low Priority

- [ ] Create the `browserdb` package and use it to implement the request caching system`update-password` routes
- [ ] Allow users to toggle between `light` and `dark` mode
- [ ] Make the users' list searchable
- [ ] Make the Blacklisted IP addresses searchable
- [ ] Create Bitcoin Quotes Component and place it in `sign-in` and `update-password`
- [ ] ...





<br/>

## Tests

```bash
# run the e2e tests
npm run test:e2e

# run the integration tests
npm run test:integration

# run the unit tests
npm run test:unit

# run the benchmarks
npm run test:bench
```





<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)