import puppeteer from "puppeteer";

const url = "https://www.cpf.gov.sg/employer/tools-and-services/calculators/cpf-contribution-calculator";


let results = [];

const sc = async (page, employee, cmy) => {
    // select checkbox element and click it
    await page.click('#coverCheckbox');

    // select submit button element and click
    await page.click('#coverStartBtn');

    // Choose SC -> Default

    // Enter DOB
    await page.type('#guideContainer-rootPanel-progresspanel-panel-guidemonthpicker___widget', formatDate(employee.dateOfBirth));
    await page.keyboard.press('Enter');
    

    // Enter ordinary wage
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidenumericbox___widget', (String(Number(employee.basicPay) + Number(employee.allowance))));

    // Enter additional wage
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidenumericbox_6500___widget', (String(Number(employee.additionalPay) + Number(employee.otPay))));

    // Enter Contribution Month and Year
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidemonthpicker___widget', cmy);
    await page.keyboard.press('Enter');

    // Calculate
    await page.click('#guideContainer-rootPanel-progresspanel-toolbar-submit___widget');

    // Wait for the result element to appear
    await page.waitForSelector('.summary-amount-card__groupedAmount');


    // Get all the result elements
    const resultElements = await page.$$('.summary-amount-card__groupedAmount');
    
    // Store the inner HTML of each element in an array

    let i = 0;

    for (const element of resultElements) {
        const result = await page.evaluate(elem => elem.innerHTML, element);
        results[i] = result;
        i++;
    }
}

const first = async (page, employee, cmy) => {
    // select checkbox element and click it
    await page.click('#coverCheckbox');

    // select submit button element and click
    await page.click('#coverStartBtn');

    // Choose 1st PR
    await page.click('.guideRadio.guideRadioButtonItem.afRadioButtonItem.citizenshipTypeCode[data-id="2"]');

    // Enter DOB
    await page.type('#guideContainer-rootPanel-progresspanel-panel-guidemonthpicker___widget', formatDate(employee.dateOfBirth));
    await page.keyboard.press('Enter');
    

    // Type of Contribution Rate
    if (employee.typeOfContributionRate === "F/G") {
        await page.click('.guideRadio.guideRadioButtonItem.afRadioButtonItem.contributionrates[data-id="2"]');
    }

    if (employee.typeOfContributionRate === "F/F") {
        await page.click('.guideRadio.guideRadioButtonItem.afRadioButtonItem.contributionrates[data-id="3"]');
    }
    

    // Enter ordinary wage
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidenumericbox___widget', (String(Number(employee.basicPay) + Number(employee.allowance))));

    // Enter additional wage
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidenumericbox_6500___widget', (String(Number(employee.additionalPay) + Number(employee.otPay))));

    // Enter Contribution Month and Year
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidemonthpicker___widget', cmy);
    await page.keyboard.press('Enter');

    

    // Calculate
    await page.click('#guideContainer-rootPanel-progresspanel-toolbar-submit___widget');

    // Wait for the result element to appear
    await page.waitForSelector('.summary-amount-card__groupedAmount');


    // Get all the result elements
    const resultElements = await page.$$('.summary-amount-card__groupedAmount');

    // Store the inner HTML of each element in an array

    let i = 0;

    for (const element of resultElements) {
        const result = await page.evaluate(elem => elem.innerHTML, element);
        results[i] = result;
        i++;
    }

}

const second = async (page, employee, cmy) => {
    // select checkbox element and click it
    await page.click('#coverCheckbox');

    // select submit button element and click
    await page.click('#coverStartBtn');

    // Choose 2nd PR
    await page.click('.guideRadio.guideRadioButtonItem.afRadioButtonItem.citizenshipTypeCode[data-id="3"]');

    // Enter DOB
    await page.type('#guideContainer-rootPanel-progresspanel-panel-guidemonthpicker___widget', formatDate(employee.dateOfBirth));
    await page.keyboard.press('Enter');

    // Type of Contribution Rate
    if (employee.typeOfContributionRate === "F/G") {
        await page.click('.guideRadio.guideRadioButtonItem.afRadioButtonItem.contributionrates[data-id="2"]');
    }

    if (employee.typeOfContributionRate === "F/F") {
        await page.click('.guideRadio.guideRadioButtonItem.afRadioButtonItem.contributionrates[data-id="3"]');
    }

    // Enter ordinary wage
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidenumericbox___widget', (String(Number(employee.basicPay) + Number(employee.allowance))));

    // Enter additional wage
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidenumericbox_6500___widget', (String(Number(employee.additionalPay) + Number(employee.otPay))));

    // Enter Contribution Month and Year
    await page.type('#guideContainer-rootPanel-progresspanel-panel-panel-guidemonthpicker___widget', cmy);
    await page.keyboard.press('Enter');

    // Calculate
    await page.click('#guideContainer-rootPanel-progresspanel-toolbar-submit___widget');

    // Wait for the result element to appear
    await page.waitForSelector('.summary-amount-card__groupedAmount');


    // Get all the result elements
    const resultElements = await page.$$('.summary-amount-card__groupedAmount');

    // Store the inner HTML of each element in an array

    let i = 0;

    for (const element of resultElements) {
        const result = await page.evaluate(elem => elem.innerHTML, element);
        results[i] = result;
        i++;
    }

}

const extractData = async (employee, contributionMonthYear) => {
    const cmy = formatDate(contributionMonthYear);
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);


    if (employee.citizenshipStatus === "SC/3rdPR") {
        await sc(page, employee, cmy);
    }

    if (employee.citizenshipStatus === "1stPR") {
        await first(page, employee, cmy);
    }

    if (employee.citizenshipStatus === "2ndPR") {
        await second(page, employee, cmy);
    }

    // Take screenshot after clicking
    await browser.close();
    return results;
    
}

function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Extract month and year components from the date
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
    const year = date.getFullYear().toString();
    
    // Concatenate the month and year in "MMYYYY" format
    const convertedDate = month + year;

    return convertedDate;
}

module.exports = extractData;