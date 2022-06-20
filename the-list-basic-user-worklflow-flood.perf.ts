import { step, TestSettings, By, beforeAll, afterAll, Until } from '@flood/element'

export const settings: TestSettings = {
	userAgent: 'seventen-load-tests-flood',
	name: 'seventen-basic-user-workflow-flood',
	loopCount: -1,
	screenshotOnFailure: true,
	disableCache: false,
	clearCache: true,
	clearCookies: true,
	actionDelay: 1.5,
	stepDelay: 2.5,
	waitUntil: 'visible',
	waitTimeout: '90s',
}

export default () => {
	const url = 'https://thelist-stage.710labs.com'
	let email: string
	let password: string
	let firstName: string
	let lastName: string
	let billingAddress: string
	let billingCity: string
	let billingPostCode: string
	var usageTypes = ['recreational', 'medical']
	var medicalCardFileTypes = ['medical-card.png']
	var driversLicenseFileTypes = [
		'drivers-license.jpg',
		'drivers-license.png',
		'drivers-license.heic',
		'drivers-license.pdf',
		'drivers-license.gif',
		'drivers-license.webp',
		'drivers-license.bmp',
		'limit-image-size.jpg',
	]
	let medicalCard: string
	let driversLicense: string
	let usageType: string
	let zipCode: string
	let zipcodes = [
		'91011',
		'91204',
		'91615',
		'91606',
		'90088',
		'90009',
		'91387',
		'91343',
		'91611',
		'91617',
	]
	function getRandomNumber(min: number, max: number) {
		return Math.random() * (max - min) + min
	}

	beforeAll(async browser => {
		await browser.wait('500ms')
		const id = Math.floor(Math.random() * 99999)
		email = `test-${id}@playwright.dev`
		password = `password${id}`
		firstName = `first${id}`
		lastName = `last${id}`
		billingAddress = '123 Front Street'
		billingCity = 'Malibu City'
		usageType = usageTypes[Math.floor(Math.random() * usageTypes.length)]
		zipCode = zipcodes[Math.floor(Math.random() * zipcodes.length)]
		billingPostCode = zipCode
		medicalCard = medicalCardFileTypes[Math.floor(Math.random() * medicalCardFileTypes.length)]
		driversLicense =
			driversLicenseFileTypes[Math.floor(Math.random() * driversLicenseFileTypes.length)]
		await browser.visit(url)
		await browser.clearBrowserCache()
		await browser.clearBrowserCookies()
	})

	afterAll(async browser => {
		await browser.wait('500ms')
	})

	step('Pass Age Gate', async browser => {
		const ageGateConfirmButton = By.attr('button', 'name', 'age_gate[confirm]')
		await browser.wait(Until.elementIsVisible(ageGateConfirmButton))
		await (await browser.findElement(ageGateConfirmButton)).click()
	})

	step('Enter List Password', async browser => {
		const passwordField = By.attr('input', 'name', 'post_password')
		await browser.type(passwordField, 'qatester')
		await browser.click(By.attr('input', 'value', 'Enter Site'))
	})

	step(`Create Account`, async browser => {
		await browser.wait(Until.elementIsVisible(By.attr('a', 'href', '/register/')))
		await browser.click(By.attr('a', 'href', '/register/'))
		await browser.type(By.id('reg_email'), email)
		await browser.type(By.id('reg_password'), password)
		await browser.type(By.id('svntn_core_registration_firstname'), firstName)
		await browser.type(By.id('svntn_core_registration_lastname'), lastName)
		await browser.selectByValue(By.css('#svntn_core_dob_month_sbmt'), '12')
		await browser.selectByValue(By.css('#svntn_core_dob_day_sbmt'), '16')
		await browser.selectByValue(By.css('#svntn_core_dob_year_sbmt'), '1988')
		await browser.type(By.id('svntn_core_registration_zip'), zipCode)
		await browser.wait(Until.elementIsVisible(By.attr('button', 'name', 'register')))
		await browser.click(By.attr('button', 'name', 'register'))
	})

	step(`Complete Account`, async browser => {
		await browser.click(By.attr('input', 'value', usageType))
		if (usageType == 'recreational') {
			const driversLicenceInput = await browser.findElement(By.id('svntn_core_personal_doc'))
			driversLicenceInput.uploadFile(driversLicense)
		} else {
			const driversLicenceInput = await browser.findElement(By.id('svntn_core_personal_doc'))
			driversLicenceInput.uploadFile(driversLicense)
			const medicalCardInput = await browser.findElement(By.id('svntn_core_medical_doc'))
			medicalCardInput.uploadFile(medicalCard)
		}
		await browser.wait('5000ms')
		await browser.wait(
			Until.elementIsVisible(By.attr('input', 'id', 'svntn_core_eligibility_post')),
		)
		await browser.click(By.attr('input', 'id', 'svntn_core_eligibility_post'))
	})

	step('Load Cart', async browser => {
		await browser.wait(Until.elementIsVisible(By.css('.add_to_cart_button')))
		let buttons = await browser.findElements(By.css('.add_to_cart_button'))
		for (let i = 0; i < getRandomNumber(5, 8); i++) {
			try {
				await browser.click(buttons[i])
			} catch {
				break
			}
		}

		await browser.wait(Until.elementIsVisible(By.css('.cart-contents')))
	})

	step('View Cart', async browser => {
		await browser.click(By.attr('span', 'class', 'count'))
	})

	step('Proceed to Checkout', async browser => {
		await browser.click(By.attr('div', 'class', 'wc-proceed-to-checkout'))
	})

	step('Add Billing/Delivery Info', async browser => {
		await browser.type(By.id('billing_first_name'), firstName)
		await browser.type(By.id('billing_last_name'), lastName)
		await browser.type(By.id('billing_address_1'), billingAddress)
		await browser.type(By.id('billing_city'), billingCity)
		await browser.type(By.id('billing_postcode'), billingPostCode)
		await browser.type(By.id('billing_phone'), '(555)555-5555')
	})

	step('Complete Order', async browser => {
		await browser.wait(Until.elementIsVisible(By.id('place_order')))
		await browser.click(By.id('place_order'))
	})
	step('Schedule Delivery', async browser => {
		let scheduleDays = await browser.findElements(By.css('#svntnAcuityDateChoices > .acuityChoice'))
		await browser.click(scheduleDays[0])
		let scheduleTimes = await browser.findElements(By.css('#svntnAcuityTimeChoices > .acuityChoice'))
		await browser.click(scheduleTimes[0])
		await browser.click(By.id('svntnAcuitySubmit'))
	})
}
