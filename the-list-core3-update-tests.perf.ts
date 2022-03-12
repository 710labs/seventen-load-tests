import { step, TestSettings, By, beforeAll, afterAll, Until } from '@flood/element'
import { faker } from '@faker-js/faker'

export const settings: TestSettings = {
	userAgent: 'seventen-flood-chrome-test',
	name: 'seventen-load-tests-core3-updates',
	loopCount: 5,
	waitUntil: 'visible',
}

export default () => {
	const url = 'https://dev.710labs.com'
	let email: string
	let password: string
	let firstName: string
	let lastName: string
	let billingAddress: string
	let billingCity: string
	let billingPostCode: string
	var usageTypes = ['recreational', 'medical']
	var medicalCardFileTypes = ['cards/medical/medical-card.png']
	var driversLicenseFileTypes = [
		'cards/drivers-license/drivers-license.jpg',
		'cards/drivers-license/drivers-license.png',
		'cards/drivers-license/drivers-license.heic',
		'cards/drivers-license/drivers-license.pdf',
		'cards/drivers-license/drivers-license.gif',
		'cards/drivers-license/drivers-license.webp',
		'cards/drivers-license/drivers-license.bmp',
		'cards/limit-image-size.jpg',
	]
	let medicalCard: string
	let driversLicense: string
	let usageType: string
	let zipCode: string
	let zipcodes = [
		'91331',
		'90011',
		'92683',
		'91710',
		'94806',
		'94544',
		'94080',
		'94112',
		'94403',
		'94062',
	]
	function getRandomArbitrary(min: number, max: number) {
		return Math.random() * (max - min) + min
	}

	beforeAll(async browser => {
		await browser.wait('500ms')
		const id = faker.random.alphaNumeric(8)
		email = `test-${id}@playwright.dev`
		password = id
		firstName = faker.name.firstName()
		lastName = faker.name.lastName()
		billingAddress = faker.address.streetAddress()
		billingCity = faker.address.city()
		usageType = usageTypes[Math.floor(Math.random() * usageTypes.length)]
		zipCode = zipcodes[Math.floor(Math.random() * zipcodes.length)]
		billingPostCode = zipCode
		medicalCard = medicalCardFileTypes[Math.floor(Math.random() * medicalCardFileTypes.length)]
		driversLicense =
			driversLicenseFileTypes[Math.floor(Math.random() * driversLicenseFileTypes.length)]
	})

	afterAll(async browser => {
		await browser.wait('500ms')
	})

	step('Pass Age Gate', async browser => {
		await browser.visit(url)
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
		await browser.click(By.attr('a', 'href', '/register/'))
		await browser.type(By.id('reg_email'), email)
		await browser.type(By.id('reg_password'), password)
		await browser.type(By.id('svntn_core_registration_zip'), zipCode)
		await browser.selectByValue(By.css('#svntn_core_dob_month_sbmt'), '12')
		await browser.selectByValue(By.css('#svntn_core_dob_day_sbmt'), '16')
		await browser.selectByValue(By.css('#svntn_core_dob_year_sbmt'), '1988')
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
		let buttons = await browser.findElements(By.css('.add_to_cart_button'))
		for (let i = 0; i < getRandomArbitrary(5, 8); i++) {
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
		await browser.wait(
			Until.elementTextContains(
				By.css('.woocommerce-thankyou-order-received'),
				'Thank you. Your order has been received.',
			),
		)
	})
}
