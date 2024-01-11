const { Builder, By, Key, until } = require('selenium-webdriver');

// Set the path to the location where you have your ChromeDriver executable
const chromeDriverPath = '/path/to/chromedriver';

// Create a Chrome WebDriver instance
const driver = new Builder().forBrowser('chrome').setChromeOptions(/* Optionally add Chrome options here */).build();

// Open the specified URL
const url = 'http://127.0.0.1:5173';
driver.get(url);

// Optionally, you can perform other actions on the page or interact with elements here

// Close the browser window after a delay (for demonstration purposes)
driver.sleep(5000).then(() => driver.quit());
