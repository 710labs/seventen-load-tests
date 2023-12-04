import { step, TestSettings, By, beforeAll, afterAll, Until, Device } from '@flood/element'
import assert from 'assert'

export const settings: TestSettings = {
	userAgent: 'seventen-load-tests-flood',
	name: 'seventen-basic-user-workflow-flood',
	loopCount: 2,
	screenshotOnFailure: true,
	disableCache: false,
	clearCache: true,
	actionDelay: 2.5,
	stepDelay: 2.5,
	waitUntil: 'visible',
	waitTimeout: '90s',
}

export default () => {
	const url = 'https://thelist.theflowery.co/'
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
		'32003',
		'32009',
		'32011',
		'32033',
		'32034',
		'32043',
		'33403',
		'33404',
		'33405',
		'33406',
		'33407',
		'34112',
		'34113',
		'34114',
		'34116',
		'34117',
		'34119',
		'34120',
		'34134',
		'34135',
	]
	let mmur: any
	let mmurAccounts = [
		{
			birthday: '09011981',
			id: 'P5HX4670',
			flowery: 'nine',
		},
		{
			birthday: '02011981',
			id: 'P2RX4442',
			flowery: 'two',
		},
	]
	function getRandomNumber(min: number, max: number) {
		return Math.random() * (max - min) + min
	}

	step('Go to https://710-prod.salve.dev/', async browser => {
		await browser.wait('500ms')
		mmur = mmurAccounts[Math.floor(Math.random() * mmurAccounts.length)]
		const id = Math.floor(Math.random() * 99999)
		email = `${mmur.flowery}-${id}+710Labs@salve-load.dev`
		password = `password${mmur.flowery}-${id}`
		firstName = `first${mmur.flowery}-${id}`
		lastName = `last${mmur.flowery}-${id}`
		billingAddress = '123 Front Street'
		billingCity = 'Miami'
		zipCode = zipcodes[Math.floor(Math.random() * zipcodes.length)]
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
		await browser.type(By.id('first_name'), firstName)
		await browser.type(By.id('last_name'), lastName)
		await browser.type(By.id('birthday'), mmur.birthday)
		await browser.type(By.id('phone'), '1234567890')

		await browser.type(By.id('billing_address_1'), '123 Main Street')
		await browser.type(By.id('patient_number'), mmur.id)
		await browser.type(By.id('billing_city'), 'Miami')
		await browser.type(By.id('billing_postcode'), zipCode)

		await browser.type(By.id('reg_email'), email)
		await browser.type(By.id('reg_password'), email)

		await browser.click(By.nameAttr('register'))
	})

	step('Load Cart', async browser => {
		await browser.wait(Until.elementIsVisible(By.css('.add_to_cart_button')))
		let buttons = await browser.findElements(By.css('.add_to_cart_button'))
		assert.ok(buttons != null, 'Add to Cart Buttons Not Found/Visible')
		for (let i = 0; i < getRandomNumber(8, 11); i++) {
			try {
				await browser.click(buttons[i])
			} catch {
				break
			}
		}

		await browser.wait(Until.elementIsVisible(By.css('.cart-contents')))
	})

	step('View Cart', async browser => {
		await browser.visit(`${url}reservations`)
	})

	step('Proceed to Checkout', async browser => {
		await browser.visit(`${url}checkout`)
	})

	step('Add Fulfillment Info', async browser => {
		await browser.click(By.id('fulfillment'))
		let typeOption = By.visibleText('Pickup')
		await browser.wait(Until.elementIsVisible(typeOption))
		await browser.click(typeOption)

		await browser.click(By.id('pickup_location_dropdown'))
		let valueOption = By.visibleText('710 Labs - List Drop')
		await browser.wait(Until.elementIsVisible(valueOption))
		await browser.click(valueOption)
	})

	step('Complete Order', async browser => {
		let completeOrderButton = By.id('place_order')
		await browser.wait(Until.elementIsVisible(By.id('place_order')))
		await browser.click(completeOrderButton)
		assert.ok(completeOrderButton != null, 'Complete Order Button Not Found/Visible')
	})
}
