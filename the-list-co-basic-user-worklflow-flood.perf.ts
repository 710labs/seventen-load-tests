import { step, TestSettings, By, Until, Key } from '@flood/element'
import assert from 'assert'

export const settings: TestSettings = {
	userAgent: 'seventen-load-tests-flood-co',
	name: 'seventen-basic-user-workflow-flood-co',
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

function generate_uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var uuid = (Math.random() * 16) | 0,
			v = c == 'x' ? uuid : (uuid & 0x3) | 0x8
		return uuid.toString(16)
	})
}

export default () => {
	const url = 'https://thelist-co.710labs.com'
	let email: string
	let password: string
	let firstName: string
	let lastName: string
	let billingPhone: string
	let billingAddress: any
	var fulfillmentTypes = ['pickup']
	let fulfillmentType: string
	var usageTypes = ['recreational', 'medical']
	var medicalCardFileTypes = ['medical-card.png']
	var driversLicenseFileTypes = [
		'drivers-license.jpg',
		'drivers-license.png',
		'drivers-license.bmp',
	]
	let medicalCard: string
	let driversLicense: string
	let usageType: string

	let billingAddreses: any[] = [{
		streetAddress: '15509 East 7th Circle',
		city: 'Aurora',
		state: 'CO',
		zipcode: '80011',
		fullAddress: '15509 East 7th Circle, Aurora, CO 80011',
	},

	{
		streetAddress: '6021 Yarrow Street',
		city: 'Arvada',
		state: 'CO',
		zipcode: '80004',
		fullAddress: '6021 Yarrow Street, Arvada, CO 80004',
	},

	{
		streetAddress: '3813 Sheffield Lane',
		city: 'Pueblo',
		state: 'CO',
		zipcode: '81005',
		fullAddress: '3813 Sheffield Lane, Pueblo, CO 81005',
	},

	{
		streetAddress: '15847 West 74th Place',
		city: 'Arvada',
		state: 'CO',
		zipcode: '80007',
		fullAddress: '15847 West 74th Place, Arvada, CO 80007',
	},

	{
		streetAddress: '6740 Van Gordon Street',
		city: 'Arvada',
		state: 'CO',
		zipcode: '80004',
		fullAddress: '6740 Van Gordon Street, Arvada, CO 80004',
	},

	{
		streetAddress: '6880 Xavier Circle',
		city: 'Westminster',
		state: 'CO',
		zipcode: '80030',
		fullAddress: '6880 Xavier Circle, Westminster, CO 80030',
	},

	{
		streetAddress: '6234 West 68th Circle',
		city: 'Arvada',
		state: 'CO',
		zipcode: '80003',
		fullAddress: '6234 West 68th Circle, Arvada, CO 80003',
	},

	{
		streetAddress: '7854 Webster Way',
		city: 'Arvada',
		state: 'CO',
		zipcode: '80003',
		fullAddress: '7854 Webster Way, Arvada, CO 80003',
	},

	{
		streetAddress: '5644 Kipling Parkway',
		city: 'Arvada',
		state: 'CO',
		zipcode: '80002',
		fullAddress: '5644 Kipling Parkway, Arvada, CO 80002',
	},

	{
		streetAddress: '8671 West 78th Circle',
		city: 'Arvada',
		state: 'CO',
		zipcode: '80005',
		fullAddress: '8671 West 78th Circle, Arvada, CO 80005',
	},
	{
		streetAddress: '350 5th Ave',
		city: 'New York',
		state: 'NY',
		zipcode: '10118',
		fullAddress: '350 5th Ave, New York, NY 10118',
	},
	{
		streetAddress: '200 Santa Monica Pier',
		city: 'Santa Monica',
		state: 'CA',
		zipcode: '90401',
		fullAddress: '200 Santa Monica Pier, Santa Monica, CA 90401',
	},
	{
		streetAddress: '201 E Randolph St',
		city: 'Chicago',
		state: 'IL',
		zipcode: '60602',
		fullAddress: '201 E Randolph St, Chicago, IL 60602',
	},
	{
		streetAddress: '6001 Fannin St',
		city: 'Houston',
		state: 'TX',
		zipcode: '77030',
		fullAddress: '6001 Fannin St, Houston, TX 77030',
	},
	{
		streetAddress: '2600 Benjamin Franklin Pkwy',
		city: 'Philadelphia',
		state: 'PA',
		zipcode: '19130',
		fullAddress: '2600 Benjamin Franklin Pkwy, Philadelphia, PA 19130',
	},
	{
		streetAddress: '1625 N Central Ave',
		city: 'Phoenix',
		state: 'AZ',
		zipcode: '85004',
		fullAddress: '1625 N Central Ave, Phoenix, AZ 85004',
	},
	{
		streetAddress: '300 Alamo Plaza',
		city: 'San Antonio',
		state: 'TX',
		zipcode: '78205',
		fullAddress: '300 Alamo Plaza, San Antonio, TX 78205',
	},
	{
		streetAddress: '2920 Zoo Dr',
		city: 'San Diego',
		state: 'CA',
		zipcode: '92101',
		fullAddress: '2920 Zoo Dr, San Diego, CA 92101',
	},
	{
		streetAddress: '2201 N Field St',
		city: 'Dallas',
		state: 'TX',
		zipcode: '75201',
		fullAddress: '2201 N Field St, Dallas, TX 75201',
	},
	{
		streetAddress: '180 Woz Way',
		city: 'San Jose',
		state: 'CA',
		zipcode: '95110',
		fullAddress: '180 Woz Way, San Jose, CA 95110',
	},
]
	function getRandomNumber(min: number, max: number) {
		return Math.random() * (max - min) + min
	}

	step('Go to https://thelist-co.710labs.com', async browser => {
		await browser.wait('500ms')
		const id = generate_uuidv4()
		email = `test-${id}+710Labs@playwright.dev`
		password = `password${id}`
		firstName = `first${id}`
		lastName = `last${id}`
		billingPhone = '(310)456-8978'
		billingAddress = billingAddreses[Math.floor(Math.random() * billingAddreses.length)]
		usageType = usageTypes[Math.floor(Math.random() * usageTypes.length)]
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
		await browser.type(By.id('billing_address_1'), billingAddress.fullAddress)
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

	step('Order Confirmation', async browser => {
		await browser.wait(Until.elementIsVisible(By.visibleText('Thank you. Your order has been received.')))
		await browser.wait(Until.elementIsVisible(By.visibleText(email)))
	})
}
