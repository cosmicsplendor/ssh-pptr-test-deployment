const puppeteer = require("puppeteer")

const selectors = {
  locationInput: "form [name=ss]",
  locationDropdownOption: `[data-testid='autocomplete-results']>li`,
  submitBtn: "form [type=submit]",
  dismissSigninBtn: `[aria-label="Dismiss sign-in info."]`,
  flexibleDateBtn: `[aria-controls="flexible-searchboxdatepicker"]`,
  firstFlexDate: ".d5fc932504.ebb6d69bfc",
  weekendOption: ".db29ecfbe2.f0d4d6a2f5",
  calendarSubmit: ".fc63351294.a822bdf511.d4b6b7a9e7.f7db01295e.c334e6f658.f4605622ad.ab3d1e30c6",
  propertyName: ".a1b3f50dcd.be36d14cea.f7c6687c3d.f996d8c258 h3"
}

const startScraping = async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()

  // go to booking.com and wait for content to load
  await page.goto("https://www.booking.com", {
    waitUntil: "networkidle0"
  })

  console.log("Waiting for signin popup")
  try {
    await page.waitForSelector(selectors.dismissSigninBtn, { timeout: 15000 })
    await page.click(selectors.dismissSigninBtn)
    console.log("Sign in popup dismissed")
  } catch {
    console.log("Sign in popup couldn't be dismissed")
  }

  console.log("Filling location input")
  await page.focus(selectors.locationInput)
  await page.type(selectors.locationInput, "salem", { delay: 250 })

  console.log("Waiting 3 seconds")
  await page.waitForTimeout(3000)

  console.log("Selecting first location from the suggestion dropdown")
  await page.waitForSelector(selectors.locationDropdownOption)
  await page.click(selectors.locationDropdownOption)

  console.log("Selecting date")
  await page.waitForSelector(selectors.flexibleDateBtn)
  await page.click(selectors.flexibleDateBtn)
  await page.click(selectors.weekendOption)
  await page.click(selectors.firstFlexDate)
  await page.click(selectors.calendarSubmit)

  console.log("Submitting the form and wait for results to load")
  await page.click(selectors.submitBtn)

  await page.waitForSelector(selectors.propertyName)
  const propertyNames = await page.$$eval(selectors.propertyName, nameTags => {
    return nameTags.map(tag => tag.innerText.split("\n")[0])
  })
  propertyNames.forEach((name, index) => {
    console.log(`[${index + 1}] ${name}`)
  })
}

startScraping()