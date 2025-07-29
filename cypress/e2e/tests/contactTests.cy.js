module.exports = (site, baseUrl, pass) => {
    describe('📞 Contact Page', () => {
    it('Check if contact form is working', () => {
        cy.visit(`${baseUrl}contact`)
        cy.log('ℹ️ Navigating to the Contact Page');
        cy.get('form').first().scrollIntoView().should('be.visible');
        
        cy.wait(1000);
        const visibleSubmitSelectors = [
                'form [type="submit"]:visible',
                'form button[type="submit"]:visible',
                'form .submit-btn:visible',
                'form .submit:visible',
                'form [role="button"]:visible'
            ];
        
        cy.get('body').then($body => {
            let buttonFound = false;

            visibleSubmitSelectors.forEach(selector => {
                if (!buttonFound && $body.find(selector).length > 0) {
                    cy.get(selector).first().click();
                    buttonFound = true;
                    cy.log(`✅ Found visible submit button: ${selector}`);
                    return;
                }
            });

            // If no visible button found, try force clicking hidden ones
            if (!buttonFound) {
                cy.log('⚠️ No visible submit button found, trying to force click hidden button');
                cy.get('form')
                    .find('[type="submit"], button[type="submit"], .submit-btn, .submit')
                    .first()
                    .click({ force: true });
            }
        });
        cy.log('❌ Attempted to submit an empty form');
        cy.wait(2000); 

        // Check for validation messages
        cy.get('form').then(($body) => {
            // First check if CF7 validation messages exist
            if ($body.find('.wpcf7-not-valid-tip').length > 0) {
                cy.get('.wpcf7-not-valid-tip')
                    .should('exist')
                    .first()
                    .should('contain.text', 'field');
                cy.log('✅ Found Contact Form 7 validation messages');
                return;
            }

            if ($body.find('.wpcf7-response-output').length > 0) {
                cy.get('.wpcf7-response-output')
                    .should('be.visible')
                    .and('not.be.empty');
                cy.log('✅ Found Contact Form response output');
                return;
            }

            // Check for other validation patterns
            const otherValidationSelectors = [
                '.wpcf7-validation-errors',
                '.error',
                '.validation-message', 
                '.form-error',
                '.invalid-feedback',
                '.field-error'
            ];

            let foundOtherValidation = false;
            otherValidationSelectors.forEach(selector => {
                if (!foundOtherValidation && $body.find(selector).length > 0) {
                    cy.get(selector).should('be.visible');
                    cy.log(`✅ Found validation error: ${selector}`);
                    foundOtherValidation = true;
                }
            });

            if (!foundOtherValidation) {
                cy.url().should('include', 'contact');
                cy.log('⚠️ No visible validation messages, but form submission may have been prevented');
            }
        });
        const formData = {
        text: 'Test',
        email: 'john@example.com',
        phone: '1234567890',
        message: 'This is a cypress test message.',
        subject: 'Cypress Test'
        };
        cy.get('form').first().then($form => {
        Object.entries(formData).forEach(([field, value]) => {
            const selectors = [
            `[name="${field}"]`,
            `input[name="${field}"]`,
            `input[type="${field}"]`,
            `span[data-name="${field}"]`,
            `textarea[name="${field}"]`,
            `input[id="${field}"]`,
            `textarea[id="${field}"]`,
            `input[data-testid="${field}"]`,
            `textarea[data-testid="${field}"]`,
            `#${field}`,
            `.${field}`
            ];
            const trySelector = (index = 0) => {
            if (index >= selectors.length) {
                cy.log(`⚠️ Field not found: ${field} — skipping`);
                return;
            }
            const selector = selectors[index];
            cy.wrap($form).then($scopedForm => {
                if ($scopedForm.find(selector).length > 0) {
                cy.wrap($scopedForm).find(selector).each($el => {
                    cy.wrap($el)
                    .scrollIntoView({ offset: { top: -100 } })
                    .wait(300)
                    .clear({ force: true })
                    .type(value, { force: true });
                }).then(() => {
                    cy.log(`✅ Filled field "${field}" using selector: ${selector}`);
                });
                } else {
                trySelector(index + 1);
                }
            });
            };
            trySelector(); 
        });
        });
        cy.get('body').then($body => {
        let buttonFound = false;
        visibleSubmitSelectors.forEach(selector => {
            if (!buttonFound && $body.find(selector).length > 0) {
            cy.get(selector)
                .first()
                .click()
                .then(() => {
                cy.log(`✅ Found visible submit button: ${selector}`);
                // cy.wait(3000); 
                const successSelectors = [
                    '.wpcf7-response-output',
                    '.success',
                    '.alert-success',
                    '.thank-you-message',
                    '.form-success',
                    '.success-message',
                    '[data-testid="success"]',
                    '.alert.alert-success',
                    '.wpcf7-mail-sent-ok'
                ];
                // After submit, check for error OR success
                cy.get('body').then($afterSubmit => {

                    const hasError = $afterSubmit.find('.wpcf7-response-output')
                    .filter((_, el) => el.innerText.toLowerCase().includes('error'))
                    .length > 0;
                    if (hasError) {
                    cy.get('.wpcf7-response-output')
                        .should('contain.text', 'error'); 
                    cy.log('❌ Contact form error detected from response output');
                    throw new Error('❌ Contact form failed to submit — error response detected.');
                    }
                    // ✅ Check for success messages if no error found
                    let successFound = false;
                    successSelectors.forEach(successSelector => {
                    if (!successFound && $afterSubmit.find(successSelector).length > 0) {
                        cy.get(successSelector).should('be.visible');
                        cy.log(`🎉 Found success message: ${successSelector}`);
                        cy.log('✅ Contact form is working and message sent!');
                        successFound = true;
                    }
                        });
                        if (!successFound) {
                        // Fallback: check for thank you page redirect
                        cy.url().then(url => {
                            if (url.includes('thank') || url.includes('success')) {
                            cy.log('🎉 Redirected to thank you page');
                            cy.log('✅ Contact form is working and message sent!');
                            } else {
                            cy.log('⚠️ No success message or redirect found — unclear result');
                            }
                        });
                        }
                    });
                    });
                buttonFound = true;
                return;
            }
            });
            if (!buttonFound) {
                cy.log('⚠️ No visible submit button found');
            }
            });
            cy.log('🎉 Contact form test completed');
    });

   it('Contact page placeholder contact info must not match Agent Image phone and email', () => {
    // Try contact page first, then get-in-touch if contact doesn't exist
    const contactUrl = `${baseUrl}contact`;
    const altContactUrl = `${baseUrl}get-in-touch/`;
    
    cy.request({ url: contactUrl, failOnStatusCode: false }).then((response) => {
        let finalContactUrl = contactUrl;
        
        if (response.status === 404) {
            cy.log('ℹ️ /contact page not found, trying /get-in-touch/');
            finalContactUrl = altContactUrl;
        }
        
        cy.visit(finalContactUrl);
        cy.log(`ℹ️ Navigating to the Contact Page: ${finalContactUrl}`);
    });

    // Define Agent Image numbers and emails
    const agentImageNumbers = [
        '877.729.5534',
        '877.317.4111',
        '310.595.9033',
        '843.973.0182'
    ];
    const agentImageEmail = ['support@agentimage.com'];

    let detectedIssues = []; // Store detected errors

    cy.get('body').then(($body) => {
        let pageText = $body.text();
        cy.log('🔍 Extracted text from Contact Page');

        // 🔹 Extract phone numbers from text
        const detectedPhoneNumbers = (pageText.match(/\+?\d{0,2}[.\s-]?\(?\d{3}\)?[.\s-]?\d{3}[.\s-]?\d{4}/g) || [])
            .map(num => num.trim())
            .filter(num => num.length > 6); // Filter out short matches

        // 🔹 Extract emails correctly from <a href="mailto:...">
        let detectedEmails = [];
        cy.get('a[href^="mailto:"]').each(($a) => {
            let email = $a.attr('href').replace('mailto:', '').trim();
            if (email) {
                detectedEmails.push(email);
            }
        }).then(() => {
            // ✅ Check for matching phone numbers
            cy.wrap(detectedPhoneNumbers).each((number, index) => {
                cy.log(`🔍 Checking phone ${index + 1}: ${number}`);
                if (agentImageNumbers.includes(number)) {
                    const errorMsg = `❌ Phone number matches Agent Image: ${number}`;
                    cy.log(errorMsg);
                    detectedIssues.push(errorMsg);
                } else {
                    cy.log(`✅ Phone number does not match Agent Image: ${number}`);
                }
            });

            // ✅ Check for matching emails
            cy.wrap(detectedEmails).each((email, index) => {
                cy.log(`🔍 Checking email ${index + 1}: ${email}`);
                if (agentImageEmail.includes(email)) {
                    const errorMsg = `❌ Email matches Agent Image: ${email}`;
                    cy.log(errorMsg);
                    detectedIssues.push(errorMsg);
                } else {
                    cy.log(`✅ Email does not match Agent Image: ${email}`);
                }
            });
        });
    }).then(() => {
        // Final validation with simple logging
        if (detectedIssues.length > 0) {
            cy.log(`🚨 ${detectedIssues.length} Agent Image matches found:`);
            detectedIssues.forEach(issue => cy.log(issue));

            const errorMessage = `CONTACT PAGE TEST FAILED - ${detectedIssues.length} Agent Image matches found:\n${detectedIssues.join('\n')}`;
            throw new Error(errorMessage);
        } else {
            cy.log('🎉 No matching Agent Image phone numbers or emails found on the Contact Page.');
            expect(true, '✅ No Agent Image violations detected on contact page').to.be.true;
        }
    });
});
});
}