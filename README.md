# Scrape your Workamajig tasks

## Instructions:
- clone this repo and run with `npm start` (or `pnpm start`)
navigate to: 
    
    http:localhost:3333?un={your wam username or email (-`.com`)}&pw={wam password}&name={whatever you'd like it to call you}

  - when inputting your email address, do not include the `.com` in the email (because it sometimes breaks the link)
  - the `name` parameter is optional, but a nice touch, if you ask me ;)
- Once it's running you can just press the refresh button to reload the latest tasks

If you have trouble with port conflicts just update the dev script in the package.json to say `--port {desired port}`

## Chromedriver
A chromedriver is no longer needed to run the headless browser, but if you do need it, it can be downloaded from the following link: [https://chromedriver.chromium.org/downloads](https://chromedriver.chromium.org/downloads)

This chromedriver, when downloaded and unzipped, must be placed somewhere where you $PATH environment variable can find it. The natural place is `/usr/bin/`.

tip: for easy access you can alias in your .rc file to start the server up with a command. For example:

    alias tasks=cd /Users/{username}/path/to/scraper && npm run dev

tech: Sveltekit, Puppeteer