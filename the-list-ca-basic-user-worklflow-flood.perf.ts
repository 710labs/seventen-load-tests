import { step, TestSettings, By, Until, Key } from '@flood/element'
import assert from 'assert'

export const settings: TestSettings = {
	userAgent: 'seventen-load-tests-flood-fl',
	name: 'seventen-basic-user-workflow-flood-fl',
	loopCount: -1,
	screenshotOnFailure: false,
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
	let billingPhone: string
	let billingAddress: string
	let billingCity: string
	let billingPostCode: string
	var fulfillmentTypes = ['pickup', 'delivery']
	let fulfillmentType: string
	var usageTypes = ['recreational', 'medical']
	var medicalCardFileTypes = ['medical-card.png']
	var driversLicenseFileTypes = [
		'drivers-license.jpg',
		'drivers-license.png',
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
	let billingAddreses = ['123 Rodeo Drive, Beverley Hills']
	function getRandomNumber(min: number, max: number) {
		return Math.random() * (max - min) + min
	}

	step('Go to https://thelist.710labs.com', async browser => {
		await browser.wait('500ms')
		const id = Math.floor(Math.random() * 99999)
		email = `test-${id}+710Labs@playwright.dev`
		password = `password${id}`
		firstName = `first${id}`
		lastName = `last${id}`
		billingPhone = '(310)456-8978'
		billingAddress = billingAddreses[Math.floor(Math.random() * billingAddreses.length)]
		billingCity = 'Malibu City'
		usageType = usageTypes[Math.floor(Math.random() * usageTypes.length)]
		zipCode = zipcodes[Math.floor(Math.random() * zipcodes.length)]
		billingPostCode = zipCode
		medicalCard = medicalCardFileTypes[Math.floor(Math.random() * medicalCardFileTypes.length)]
		fulfillmentType = fulfillmentTypes[Math.floor(Math.random() * fulfillmentTypes.length)]
		driversLicense =
			driversLicenseFileTypes[Math.floor(Math.random() * driversLicenseFileTypes.length)]
		await browser.visit(url)
		await browser.clearBrowserCache()
		await browser.clearBrowserCookies()
	})

	step('Pass Age Gate', async browser => {
		const ageGateConfirmButton = By.attr('button', 'name', 'age_gate[confirm]')
		await browser.wait(Until.elementIsVisible(ageGateConfirmButton))
		assert.ok(ageGateConfirmButton != null, 'Age Confirmation Button Not Found')
		await (await browser.findElement(ageGateConfirmButton)).click()
	})

	step('Enter List Password', async browser => {
		const passwordField = By.attr('input', 'name', 'post_password')
		await browser.type(passwordField, 'qatester')
		assert.ok(passwordField != null, 'Drop Password Field Not Found')
		await browser.click(By.attr('input', 'value', 'Enter Site'))
	})

	step(`Create Account`, async browser => {
		const registerLink = By.attr('a', 'href', '/register/')
		await browser.wait(Until.elementIsVisible(By.attr('a', 'href', '/register/')))
		assert.ok(registerLink != null, 'Register Link Not Found/Visible')
		await browser.click(registerLink)
		await browser.type(By.id('reg_email'), email)
		await browser.type(By.id('reg_password'), password)
		await browser.type(By.id('svntn_core_registration_firstname'), firstName)
		await browser.type(By.id('svntn_core_registration_lastname'), lastName)
		await browser.selectByValue(By.css('#svntn_core_dob_month'), '12')
		await browser.selectByValue(By.css('#svntn_core_dob_day'), '16')
		await browser.selectByValue(By.css('#svntn_core_dob_year'), '1988')
		await browser.type(By.id('billing_address_1'), billingAddress)
		await browser.wait('500ms')
		await browser.sendKeys(Key.ARROW_DOWN)
		await browser.wait('500ms')
		await browser.sendKeys(Key.ENTER)
		await browser.click(By.id('billing_phone'))
		await browser.sendKeys(billingPhone)
		await browser.wait(Until.elementIsVisible(By.attr('button', 'name', 'register')))
		await browser.click(By.attr('button', 'name', 'register'))
	})

	step(`Complete Account`, async browser => {
		const completeAccountLink = By.attr('input', 'id', 'svntn_core_eligibility_post')
		const usageTypeSelector = By.attr('input', 'value', usageType)
		assert.ok(usageTypeSelector != null, 'usageTypeSelector Not Found/Visible')
		await browser.click(usageTypeSelector)
		if (usageType == 'recreational') {
			const driversLicenceInput = await browser.findElement(By.id('svntn_core_personal_doc'))
			driversLicenceInput.uploadFile(driversLicense)
		} else {
			const driversLicenceInput = await browser.findElement(By.id('svntn_core_personal_doc'))
			driversLicenceInput.uploadFile(driversLicense)
			const medicalCardInput = await browser.findElement(By.id('svntn_core_medical_doc'))
			medicalCardInput.uploadFile(medicalCard)
			await browser.selectByValue(By.css('#svntn_core_mxp_month'), '12')
			await browser.selectByValue(By.css('#svntn_core_mxp_day'), '12')
			await browser.selectByValue(By.css('#svntn_core_mxp_year'), '2023')
		}
		await browser.wait('5000ms')
		await browser.wait(
			Until.elementIsVisible(By.attr('input', 'id', 'svntn_core_eligibility_post')),
		)

		assert.ok(completeAccountLink != null, 'Complete Account Button Not Found/Visible')
		await browser.click(completeAccountLink)
	})

	step(`Setup Fulfillment`, async browser => {
		await browser.wait('1000ms')
		let fulfillmentButtons = await browser.findElements(By.css('.wcse-toggle-choice'))
		if (fulfillmentType == 'pickup') {
			await browser.click(fulfillmentButtons[0])
		} else {
			await browser.click(fulfillmentButtons[1])
		}
		await browser.wait('1000ms')

		await browser.click(By.id('fulfillerSubmit'))
		await browser.visit(url)
	})

	step('Load Cart', async browser => {
		await browser.wait(Until.elementIsVisible(By.css('.add_to_cart_button')))
		let buttons = await browser.findElements(By.css('.add_to_cart_button'))
		assert.ok(buttons != null, 'Add to Cart Buttons Not Found/Visible')
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
		let proceedToCheckoutButton = By.css('.checkout-button')
		assert.ok(proceedToCheckoutButton != null, 'Proceed To Checkout Button Not Found/Visible')

		await browser.click(proceedToCheckoutButton)
	})

	step('Select Acuity Slot', async browser => {
		try {
			await browser.click(By.css('#svntnAcuityTimeChoices > label:nth-child(1)'))
		} catch {
			console.log('Unable to select acuity slot.')
		}
	})

	step('Complete Order', async browser => {
		let completeOrderButton = By.id('place_order')
		await browser.wait(Until.elementIsVisible(By.id('place_order')))
		try {
			await browser.click(completeOrderButton)
		} catch {
			console.log('Unable to complete order.')
		}

		assert.ok(completeOrderButton != null, 'Complete Order Button Not Found/Visible')
	})
}
