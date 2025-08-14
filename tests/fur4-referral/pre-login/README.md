# FUR4 Referral Site - Pre-login Test Suite

This directory contains comprehensive automated tests for the FUR4 Referral Site pre-login functionality, following the same structure and format as the FUR4 main test cases.

## Test Structure

The pre-login tests are organized into logical modules based on functionality:

```
tests/fur4-referral/pre-login/
├── home/                    # Home page tests
│   └── home.spec.ts        # 21 test cases for homepage functionality
├── menu-overlay/            # Menu overlay tests
│   └── menu-overlay.spec.ts # 20 test cases for hamburger menu functionality
├── register/                # Registration page tests
│   └── register.spec.ts     # 20 test cases for registration form
├── login/                   # Login page tests
│   └── login.spec.ts        # 24 test cases for login functionality
├── faq/                     # FAQ page tests
│   └── faq.spec.ts          # 31 test cases for FAQ accordion and footer
├── legal-pages/             # Legal pages tests
│   └── legal-pages.spec.ts  # 30 test cases for privacy, terms, etc.
├── about-us/                # About Us page tests
│   └── about-us.spec.ts     # 10 test cases for about us functionality
├── contact-us/              # Contact Us page tests
│   └── contact-us.spec.ts   # 12 test cases for contact form functionality
├── referral/                # Referral page tests
│   └── referral.spec.ts     # 7 test cases for referral page functionality
├── security/                # Security page tests
│   └── security.spec.ts     # 7 test cases for security page functionality
├── sms-tc/                  # SMS T&C page tests
│   └── sms-tc.spec.ts       # 8 test cases for SMS T&C page functionality
├── run-all-prelogin-tests.ts # Comprehensive test runner (15 integration tests)
└── README.md                # This documentation file
```

## Page Objects

The tests use the following page object classes located in `page-objects/refer/`:

- **ReferralHomePage** - Homepage functionality and footer verification
- **MenuOverlayPage** - Hamburger menu and navigation overlay
- **RegisterPage** - Registration form and validation
- **LoginPage** - Social login and email/phone authentication
- **FAQPage** - FAQ accordion functionality and footer links
- **LegalPages** - Privacy, terms, and other legal page functionality
- **AboutUsPage** - About Us page functionality and social links
- **ContactUsPage** - Contact form functionality and validation
- **ReferralPage** - Referral page functionality and social links
- **SecurityPage** - Security page functionality and social links
- **SMSTCPage** - SMS T&C page functionality and external links

## Test Coverage

### Home Page Tests (15 test cases)
- Page loading and navigation elements
- Footer sections and links
- Homepage content and sections
- Call-to-action buttons
- Responsive design elements

### Menu Overlay Tests (20 test cases)
- Hamburger menu functionality
- All menu elements visibility
- Navigation links functionality
- Authentication buttons
- Newsletter subscription
- Country/region selection
- Menu state management

### Register Page Tests (20 test cases)
- Registration form elements
- Form validation and functionality
- Password confirmation matching
- Country/region dropdown
- Navigation between register and login
- Form accessibility features

### Login Page Tests (24 test cases)
- Social login buttons (Google, Facebook, LinkedIn)
- Email and phone tab functionality
- Input field validation
- Remember Me checkbox
- Tab switching behavior
- Navigation to registration

### FAQ Page Tests (31 test cases)
- All 18 FAQ accordion items
- Expand/collapse functionality
- Register button functionality
- Footer link navigation
- FAQ search and accessibility
- Accordion performance

### Legal Pages Tests (30 test cases)
- Privacy Policy page
- Terms of Service page
- Referral Policy page
- EULA page
- SMS T&C page
- Security page
- Footer link consistency
- Cross-navigation functionality

### About Us Page Tests (10 test cases)
- Page loading and content verification
- Browse Our Products button functionality
- Chat with us widget presence
- Social media links (Facebook, YouTube, Instagram)
- Page accessibility and performance

### Contact Us Page Tests (12 test cases)
- Contact form elements visibility
- Form field functionality and validation
- Form data entry and clearing
- Info email link functionality
- Chat with us widget presence
- Social media links verification

### Referral Page Tests (7 test cases)
- Page loading and content verification
- Info email link functionality
- Chat with us widget presence
- Social media links verification
- Page accessibility and performance

### Security Page Tests (7 test cases)
- Page loading and content verification
- Security email link functionality
- Chat with us widget presence
- Social media links verification
- Page accessibility and performance

### SMS T&C Page Tests (8 test cases)
- Page loading and content verification
- Support email link functionality
- External privacy link functionality
- Chat with us widget presence
- Social media links verification

### Integration Tests (15 test cases)
- Complete user journey testing
- Menu navigation integration
- Cross-page functionality
- Performance testing
- Cross-browser compatibility
- New page functionality testing

## Running the Tests

### Run All Pre-login Tests
```bash
npx playwright test tests/fur4-referral/pre-login/run-all-prelogin-tests.ts
```

### Run Individual Test Modules
```bash
# Home page tests
npx playwright test tests/fur4-referral/pre-login/home/

# Menu overlay tests
npx playwright test tests/fur4-referral/pre-login/menu-overlay/

# Registration tests
npx playwright test tests/fur4-referral/pre-login/register/

# Login tests
npx playwright test tests/fur4-referral/pre-login/login/

# FAQ tests
npx playwright test tests/fur4-referral/pre-login/faq/

# Legal pages tests
npx playwright test tests/fur4-referral/pre-login/legal-pages/
```

### Run Tests with Specific Tags
```bash
# Run tests for specific functionality
npx playwright test --grep "home page"
npx playwright test --grep "menu overlay"
npx playwright test --grep "registration"
```

## Test Case IDs

Each test case has a unique identifier following the pattern:
- **001-015**: Home page tests
- **016-035**: Menu overlay tests
- **036-055**: Registration tests
- **056-079**: Login tests
- **080-110**: FAQ tests
- **111-140**: Legal pages tests
- **COMP001-COMP010**: Integration tests

## Environment Variables

The tests require the following environment variable:
- `FUR4_REFERRAL_URL`: Base URL for the referral site (defaults to https://refer.fur4.com/)

## Test Configuration

- **Mode**: Tests run in parallel by default for individual modules, serial for integration tests
- **Timeout**: 15 seconds for page loads, 5 seconds for element visibility
- **User Agent**: Chrome 120.0.0.0 on Windows 10
- **Wait Strategy**: DOM content loaded for navigation, visible state for elements

## Key Features Tested

### Navigation Elements
- FUR4 HOME link
- Register button
- Hamburger menu button
- Get Your Unique Referral Link button

### Menu Overlay
- Country/Region dropdown (United States default)
- Referral Home link
- Referral FAQs link
- Sign In button
- Sign Up button
- Newsletter email input
- Subscribe button
- Close menu button

### Registration Form
- Country/Region dropdown
- Email input
- Password input
- Confirm Password input
- Register and Get Link button
- Sign In link

### Login Functionality
- Google social sign-in
- Facebook social sign-in
- LinkedIn social sign-in
- Email tab
- Phone tab
- Email or phone input
- Remember Me checkbox
- Continue button
- Sign Up link

### FAQ System
- 18 comprehensive FAQ items
- Accordion expand/collapse
- Register button call-to-action
- Footer navigation links

### Legal Pages
- Privacy Policy
- Terms of Service
- Referral Policy
- EULA
- SMS T&C
- Security
- Consistent footer navigation

## Browser Compatibility

Tests are designed to work with:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## Performance Requirements

- Page load time: < 15 seconds
- Menu open/close: < 2 seconds
- Element visibility: < 5 seconds
- Form submission preparation: < 1 second

## Accessibility Testing

- ARIA attributes verification
- Keyboard navigation support
- Screen reader compatibility
- Form label associations
- Tab order validation

## Error Handling

- 404 page detection
- Network error handling
- Form validation errors
- Broken link detection
- Page load failures

## Reporting

Tests use the `buildTag` utility for consistent tagging and reporting:
- Site: 'refer'
- Module: 'prelogin'
- Case ID: Sequential numbering
- Functionality: Descriptive test names

## Maintenance

- Page objects are centralized for easy maintenance
- Locators use semantic selectors (getByRole, getByText)
- Test data is externalized and configurable
- Error messages are descriptive and actionable
- Test structure follows Playwright best practices
