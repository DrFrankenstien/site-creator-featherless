import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { execSync } from 'child_process';
import fs from 'fs';
const popularUrls = ["instagram.com", "facebook.com", "tiktok.com"];
export async function runGoogleScraper(buissnessName) {
    const returnData = [];
    const liveProfile = '/Users/david/Library/Application Support/Google/Chrome';
    const automationProfile = '/Users/david/Library/Application Support/Google/Chrome_Automation';
    console.log("Preparing automation profile directory...");
    if (!fs.existsSync(automationProfile)) {
        console.log("Cloning live Chrome profile for automation use...");
        execSync(`mkdir -p "${automationProfile}"`);
        execSync(`rsync -a --exclude='Cache*' --exclude='Media Cache*' "${liveProfile}/" "${automationProfile}/"`);
    }
    try {
        execSync(`rm -f "${automationProfile}/SingletonLock"`);
        execSync(`rm -f "${automationProfile}/SingletonSocket"`);
        execSync(`rm -f "${automationProfile}/Default/SingletonLock"`);
        execSync(`rm -f "${automationProfile}/Default/SingletonSocket"`);
        execSync(`find "${automationProfile}" -name "*lock*" -delete 2>/dev/null || true`);
    }
    catch (e) { }
    const options = new chrome.Options();
    options.addArguments(`--user-data-dir=${automationProfile}`);
    options.addArguments('--profile-directory=Default');
    options.addArguments('--remote-debugging-port=9222');
    options.addArguments('--remote-allow-origins=*');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.excludeSwitches('enable-automation');
    console.log("Launching clean automated instance...");
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    try {
        // --- FIXED URL STRING HERE ---
        const encodedQuery = encodeURIComponent(buissnessName);
        const url = `https://google.com/search?q=${encodedQuery}&udm=1`;
        console.log(`Navigating to: ${url}`);
        await driver.get(url);
        const firstHeading = await driver.wait(until.elementLocated(By.css('html > body > div:nth-of-type(3) > div > div:nth-of-type(13) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div:first-of-type > div > div:nth-of-type(4)')), 15000);
        const elementsLocated = await firstHeading.findElements(By.css("div[jscontroller]"));
        console.log(`Found ${elementsLocated.length} elements matching div[jscontroller]`);
        for (const div of elementsLocated) {
            // Using findElements is safe because it returns an empty array if no 'a' matches,
            // whereas findElement throws a 'NoSuchElementError' and crashes the process.
            const anchors = await div.findElements(By.css("a"));
            if (anchors.length > 0) {
                const anchor = anchors[0];
                const href = await anchor?.getAttribute("href");
                const text = await anchor?.getText();
                if (text !== "" && !href?.includes("instagram.com") && !href?.includes("facebook.com")) {
                    console.log(`Found anchor: "${text}" -> ${href}`);
                }
                else {
                    console.log("No anchor found inside this div[jscontroller]. Clicking to open details...");
                    // 1. Await the click command so it actually happens in sequence
                    await div.click();
                    let phoneNumber = null;
                    // 2. Instead of a fixed setTimeout/sleep, wait for the phone element to load (up to 5 seconds)
                    // We try a robust CSS selector first (looking for an 'a' tag with 'data-phone-number')
                    try {
                        const phone = await driver.wait(until.elementLocated(By.css("a[data-phone-number]")), 2000);
                        // Await getAttribute() to resolve the promise to a string
                        phoneNumber = await phone.getAttribute("data-phone-number");
                        console.log(`Found phone number: ${phoneNumber}`);
                    }
                    catch (e) {
                    }
                    finally {
                        try {
                            const title = await driver.wait(until.elementLocated(By.css("h2")), 5000);
                            const name = await title.getText();
                            const item = { name };
                            if (phoneNumber) {
                                item.phone = phoneNumber;
                            }
                            returnData.push(item);
                        }
                        catch {
                            console.log("could not find title skipping");
                        }
                    }
                    // 3. Properly await the driver.sleep to pause before the next iteration
                }
            }
        }
    }
    catch (error) {
        console.error("Scraping task stalled or failed:", error);
    }
    finally {
        console.log("Exiting worker.");
        driver.quit();
    }
    const nameMap = new Map();
    const phoneMap = new Map();
    for (const item of returnData) {
        const name = item.name;
        const phone = item.phone;
        if (nameMap.has(name)) {
            const existing = nameMap.get(name);
            // If the new item has a phone number but the existing one doesn't, keep the new one
            if (phone && !existing.phone) {
                nameMap.set(name, item);
            }
            continue;
        }
        nameMap.set(name, item);
    }
    const uniqueByName = Array.from(nameMap.values());
    const finalResults = [];
    for (const item of uniqueByName) {
        const phone = item.phone;
        if (!phone) {
            finalResults.push(item);
            continue;
        }
        // If another item already used this phone number, skip this one
        if (phoneMap.has(phone)) {
            continue;
        }
        phoneMap.set(phone, item);
        finalResults.push(item);
    }
    return finalResults;
}
//# sourceMappingURL=scraper.js.map