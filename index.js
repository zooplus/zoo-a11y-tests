const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

(async () => {
	const url = process.argv[2];
	if (!url) throw new Error('Please supply endpoint you wish to test, for example: npm start https://example.com');

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	try {
		await page.setBypassCSP(true);
		await page.goto(url);
		
		const results = await new AxePuppeteer(page).options({
			rules: { 'color-contrast': { enabled: false } }
		}).analyze();
		if (results.violations) {
			console.log(results);
		} else {
			console.log('No accessibility issues found, good job!');
		}
	} catch (e) {
		throw new Error(e);
	} finally {
		await page.close();
		await browser.close();
	}
})();
