module.exports = (site, baseUrl, pass) => {
    // Helper function to get first working selector from an array
    const getFirstWorkingSelector = (selectors, $body) => {
        for (let i = 0; i < selectors.length; i++) {
            const selector = selectors[i];
            const elements = $body.find(selector);
            if (elements.length > 0 && elements.is(':visible')) {
                cy.log(`✅ Found working selector [${i + 1}/${selectors.length}]: "${selector}"`);
                return selector;
            }
            cy.log(`❌ Selector [${i + 1}/${selectors.length}]: "${selector}" not found or not visible`);
        }
        cy.log(`⚠️ No working selectors found, using first as fallback: "${selectors[0]}"`);
        return selectors[0]; // fallback to first
    };

    describe('🛣️ Roadmap Pages', () => {
        const roadmapSections = [
          { name: 'buyers', url: '/buyers/', redirectsTo: '/buyer/' },
          { name: 'sellers', url: '/sellers/', redirectsTo: '/seller/' },
          { name: 'financing', url: '/financing/', redirectsTo: '/finance/' }
        ];
    
        roadmapSections.forEach((section) => {
          describe(`${section.name.charAt(0).toUpperCase() + section.name.slice(1)} Roadmap Section`, () => {
            let subPageLinks = [];
            let actualSectionPath = section.url; // Track the actual path after redirects

            before(() => {
              // Visit the main section page to discover sub-pages dynamically
              const fullSectionUrl = baseUrl + section.url;
              cy.visit(fullSectionUrl);
            
              cy.url().then((currentUrl) => {
                const url = new URL(currentUrl);
                // Extract the path and determine the actual section path
                if (section.redirectsTo) {
                  actualSectionPath = section.redirectsTo;
                } else {
                  actualSectionPath = section.url;
                }
            
                cy.log(`Section ${section.name}: Original URL ${fullSectionUrl}, Actual path: ${actualSectionPath}`);
              });
          
              // Extract all links that belong to this section
              cy.get('body').then(($body) => {
                const links = [];

                const sectionPatterns = [section.name];
                if (section.redirectsTo) {
                  const redirectSectionName = section.redirectsTo.replace(/\//g, '');
                  if (redirectSectionName && !sectionPatterns.includes(redirectSectionName)) {
                    sectionPatterns.push(redirectSectionName);
                  }
                }
            
                // Find all links that contain any of the section patterns in the href
                sectionPatterns.forEach(pattern => {
                  $body.find(`a[href*="${pattern}"]`).each((index, element) => {
                    const href = Cypress.$(element).attr('href');

                    // Only include links that are sub-pages of this section
                    if (href &&
                      (href.includes(`/${pattern}/`) || href.includes(`/${section.name}/`)) &&
                      href !== section.url &&
                      !href.includes('#') &&
                      !href.includes('mailto:') &&
                      !href.includes('tel:')) {

                      let normalizedHref = href;
                      if (href.startsWith('/')) {
                        // Convert relative URL to full URL
                        normalizedHref = baseUrl + href;
                      } else if (!href.startsWith('http')) {
                        normalizedHref = `${baseUrl}/${pattern}/${href}`;
                      }
                  
                      if (!links.includes(normalizedHref)) {
                        links.push(normalizedHref);
                      }
                    }
                  });
                });
            
                subPageLinks = links;
                cy.log(`Found ${subPageLinks.length} sub-pages for ${section.name}: ${subPageLinks.join(', ')}`);
              });
            });
        
            it(`${section.name} Sub-pages Are Dynamically Discovered and Accessible`, () => {
              cy.then(() => {
                if (subPageLinks.length === 0) {
                  cy.log(`No sub-pages found for ${section.name} section to visit directly.`);
                  return;
                }
            
                subPageLinks.forEach((subPageUrl) => {
                  cy.visit(subPageUrl);
                
                  // Handle URL validation with potential redirects
                  cy.url().then((currentUrl) => {
                    const url = new URL(currentUrl);
                    const currentPath = url.pathname;

                    const sectionName = section.name;
                    const redirectSectionName = section.redirectsTo ? section.redirectsTo.replace(/\//g, '') : null;

                    const isValidPath = currentPath.includes(`/${sectionName}/`) ||
                      (redirectSectionName && currentPath.includes(`/${redirectSectionName}/`)) ||
                      currentPath === new URL(subPageUrl).pathname;

                    if (!isValidPath) {
                      cy.log(`⚠️ URL validation: Expected path containing /${sectionName}/ or /${redirectSectionName}/, got ${currentPath}`);
                    }
                
                    expect(isValidPath, `Expected ${currentPath} to be a valid sub-page of ${section.name}`).to.be.true;
                  });
              
                  cy.get('body').should('be.visible');
              
                  // Scroll through the content
                  cy.scrollTo('top');
                  cy.wait(500);
                  cy.scrollTo('bottom');
                  cy.wait(500);
                  cy.scrollTo('center');
                  cy.wait(500);
              
                  // Verify heading exists and has content
                  cy.get('body').then($body => {
                    const entryTitleSelectors = [
                      'h1.entry-title',
                      '.entry-title',
                      'h1',
                      'h2.entry-title'
                    ];
                    
                    const workingSelector = getFirstWorkingSelector(entryTitleSelectors, $body);
                    cy.get(workingSelector).should('exist').then(($h1) => {
                      const actualTitle = $h1.text().replace(/[^\w\s]/g, '').trim();
                      expect(actualTitle).to.not.be.empty;
                      cy.log(`✅ Title found: "${actualTitle}" for sub-page: ${subPageUrl}`);
                    });
                  });
              
                  cy.get('body').should('not.be.empty');
                  cy.log(`✅ Successfully validated sub-page: ${subPageUrl}`);
                });
              });
            });
        
            it('Table of Contents Scrolls to Section (If Present)', () => {
              if (subPageLinks.length < 2) {
                cy.log(`Not enough sub-pages found for ${section.name} (need at least 2) to test TOC navigation. Skipping.`);
                return;
              }
          
              const originSubPage = subPageLinks[0];

              cy.visit(originSubPage);
              cy.log(`Attempting TOC navigation test from: ${originSubPage}`);
          
              // Store the original URL for comparison
              let originalUrl;
              cy.url().then(url => {
                originalUrl = url;
              });
          
              // Open the mobile TOC if present
              cy.get('body').then($body => {
                const tocMobileHeadingSelectors = ['.aios-roadmaps-equinox__mobileHeading'];
                
                tocMobileHeadingSelectors.forEach((selector, index) => {
                  if ($body.find(selector).length > 0 && $body.find(selector).is(':visible')) {
                    cy.log(`Mobile TOC heading found with selector [${index + 1}/${tocMobileHeadingSelectors.length}]: "${selector}"`);
                    cy.get(selector).click();
                    
                    const tocMenuListsSelectors = ['.aios-roadmaps-equinox__menuLists'];
                    const menuListSelector = getFirstWorkingSelector(tocMenuListsSelectors, $body);
                    cy.get(menuListSelector).should('be.visible');
                    return false; // break out of forEach
                  }
                });
            
                // Get all TOC items and find one that's different from current page
                const tocMenuLinksSelectors = ['.aios-roadmaps-equinox__menu li a'];
                const workingTocSelector = getFirstWorkingSelector(tocMenuLinksSelectors, $body);
                
                cy.get(workingTocSelector).then($tocLinks => {
                  let targetTocLink = null;
                  let expectedHref = null;
                
                  for (let i = 0; i < $tocLinks.length; i++) {
                    const href = $tocLinks.eq(i).attr('href');

                    // Check if this href corresponds to one of our discovered sub-pages
                    if (href && href !== originalUrl && 
                        (subPageLinks.some(link => href.includes(link) || link.includes(href)) || 
                         !href.includes(originalUrl))) {
                      targetTocLink = $tocLinks.eq(i);
                      expectedHref = href;
                      break;
                    }
                  }
              
                  if (!targetTocLink || !expectedHref) {
                    cy.log('No suitable TOC link found that navigates to a different page. Skipping test.');
                    return;
                  }
              
                  const tocLinkText = targetTocLink.text().trim();
                  cy.log(`Clicking TOC item: "${tocLinkText}" with href: ${expectedHref}`);
              
                  cy.wrap(targetTocLink).click();
              
                  cy.url().should('not.eq', originalUrl).then((newUrl) => {
                    cy.log(`✅ Successfully navigated from ${originalUrl} to ${newUrl}`);

                    // Verify the new page has content
                    cy.get('body').then($newBody => {
                      const entryTitleSelectors = [
                        'h1.entry-title',
                        '.entry-title',
                        'h1',
                        'h2.entry-title'
                      ];
                      const titleSelector = getFirstWorkingSelector(entryTitleSelectors, $newBody);
                      cy.get(titleSelector).should('exist').and('not.be.empty');
                    });

                    // Verify we're still within the correct section
                    cy.url().then((currentUrl) => {
                      const url = new URL(currentUrl);
                      const currentPath = url.pathname;
                    
                      const sectionName = section.name;
                      const redirectSectionName = section.redirectsTo ? section.redirectsTo.replace(/\//g, '') : null;
                    
                      const isValidSectionPath = currentPath.includes(`/${sectionName}/`) ||
                        (redirectSectionName && currentPath.includes(`/${redirectSectionName}/`));
                    
                      expect(isValidSectionPath, `Expected ${currentPath} to be within ${section.name} section`).to.be.true;
                      cy.log(`✅ TOC navigation kept us within the correct section: ${currentPath}`);
                    });
                  });
                });
              });
            });
        
            // Test Next/Prev Pagination Navigation
            it('Pagination Works Across Sections or Steps', () => {
              const firstPageUrl = subPageLinks.length > 0 ? subPageLinks[0] : baseUrl + section.url;
            
              cy.visit(firstPageUrl); 
            
              const checkContentOnCurrentPage = () => {
                cy.get('body').then($body => {
                  const entryTitleSelectors = [
                    'h1.entry-title',
                    '.entry-title',
                    'h1',
                    'h2.entry-title'
                  ];
                  const titleSelector = getFirstWorkingSelector(entryTitleSelectors, $body);
                  cy.get(titleSelector).should('be.visible').and('not.be.empty');
                });
              };
          
              let originUrl; // To store the URL of the origin page (first sub-page)
          
              cy.url().then((url) => {
                originUrl = url;
                cy.log(`Starting pagination test from origin URL: ${originUrl}`);
                checkContentOnCurrentPage(); // Check content on the origin page
              });
          
              // Test "Next" button functionality
              cy.get('body').then($body => {
                const paginationNextSelectors = ['.aios-roadmaps-pagination a.aios-roadmaps-next'];
                
                paginationNextSelectors.forEach((selector, index) => {
                  if ($body.find(selector).length > 0 && $body.find(selector).is(':visible')) {
                    cy.log(`📃 Next button found with selector [${index + 1}/${paginationNextSelectors.length}]: "${selector}"`);
                    cy.get(selector)
                      .click()
                      .url()
                      .should('not.eq', originUrl) 
                      .then((nextPageUrl) => {
                        cy.log('Navigated to next page: ' + nextPageUrl);
                        checkContentOnCurrentPage(); 
                      
                        // test "Prev" button functionality from the another page
                        cy.get('body').then($newBody => {
                          const paginationPrevSelectors = ['.aios-roadmaps-pagination a.aios-roadmaps-prev'];
                          const prevSelector = getFirstWorkingSelector(paginationPrevSelectors, $newBody);
                          cy.get(prevSelector)
                            .should('be.visible')
                            .click()
                            .url()
                            .should('eq', originUrl) // Should navigate back to the origin page
                            .then((returnedUrl) => {
                              cy.log('Navigated back to origin page: ' + returnedUrl);
                              checkContentOnCurrentPage(); 
                              cy.log('✅ SUCCESS: Next button navigated to another page, and Prev button returned to origin.');
                            });
                        });
                      });
                    return false; // break out of forEach
                  } else {
                    cy.log(`❌ Next button selector [${index + 1}/${paginationNextSelectors.length}]: "${selector}" not found or not visible`);
                  }
                });
                
                // If no next button found
                if (!paginationNextSelectors.some(selector => $body.find(selector).length > 0 && $body.find(selector).is(':visible'))) {
                  cy.log('📃 No Next button found. Skipping Next/Prev pagination test.');
                }
              });
            });
          });
        });
    
        // Home Valuation Test Suite - Updated to find valuation pages and test form
        describe('Home Valuation Form', () => {
          let valuationPageUrl = null;
        
          before(() => {
            // First, try to find valuation pages by searching for links containing "valuation"
            cy.visit(baseUrl);

            cy.get('body').then(($body) => {
              // Look for any links that contain "valuation" in the href or text
              const valuationLinks = [];
            
              $body.find('a').each((index, element) => {
                const $link = Cypress.$(element);
                const href = $link.attr('href');
                const text = $link.text().toLowerCase();

                if ((href && href.toLowerCase().includes('valuation')) || 
                    text.includes('valuation') || 
                    text.includes('home value')) {
                  if (href && !valuationLinks.includes(href)) {
                    // Convert relative URLs to full URLs
                    const fullUrl = href.startsWith('http') ? href : baseUrl + href;
                    valuationLinks.push(fullUrl);
                  }
                }
              });

              if (valuationLinks.length > 0) {
                valuationPageUrl = valuationLinks[0];
                cy.log(`Found valuation page link: ${valuationPageUrl}`);
              }
            });

            // If no links found, try common URL patterns
            if (!valuationPageUrl) {
              const potentialValuationUrls = [
                '/home-valuation/',
                '/valuation/',
                '/home-value/',
                '/property-valuation/',
                '/get-home-value/',
                '/seller/home-valuation/',
                '/sellers/home-valuation/',
                '/seller/valuation/',
                '/sellers/valuation/'
              ];
          
              cy.wrap(potentialValuationUrls).each((url) => {
                if (!valuationPageUrl) {
                  const fullUrl = baseUrl + url;
                  cy.request({ url: fullUrl, failOnStatusCode: false }).then((response) => {
                    if (response.status === 200) {
                      valuationPageUrl = fullUrl;
                      cy.log(`Found Home Valuation page at: ${valuationPageUrl}`);
                    }
                  });
                }
              });
            }
          });
      
          it('Home Valuation Form Complete Flow Test (if present)', () => {
            if (!valuationPageUrl) {
              cy.log('No Home Valuation page found. Skipping form test.');
              return;
            }
        
            cy.log('🏠 Starting Home Valuation Form Test');
        
            cy.visit(valuationPageUrl);
            cy.log(`✅ Step 1: Navigated to Home Valuation page: ${valuationPageUrl}`);
        
            cy.get('body').should('be.visible');
            cy.wait(3000);
        
            cy.log('📍 Step 2: Filling out Step 1 (Address)...');
        
            // Address input field
            cy.get('body').then($body => {
              const addressInputSelectors = [
                '.aios-home-valuation-address-search',
                '#ahf-address',
                '[name="address"]',
                '[placeholder*="address"]',
                '[placeholder*="Address"]'
              ];
              
              const addressSelector = getFirstWorkingSelector(addressInputSelectors, $body);
              cy.get(addressSelector)
                .first()
                .should('be.visible')
                .clear()
                .type('Florida', { delay: 100 })
                .should('contain.value', 'Florida')
                .blur();
            });
        
            cy.log('✅ Typed "Florida" in address field');
            cy.wait(2000); 
        
            // Next step button
            cy.get('body').then($body => {
              const nextStepButtonSelectors = ['.aios-home-valuation-next.aios-home-valuation-proceed-2'];
              const nextButtonSelector = getFirstWorkingSelector(nextStepButtonSelectors, $body);
              cy.get(nextButtonSelector)
                .first()
                .should('be.visible')
                .click();
            });
        
            cy.log('✅ Clicked Next for Step 1');
            cy.wait(3000);
        
            // Fill out Step 2 -Personal Information with validation
            cy.log('👤 Step 3: Filling out Step 2 (Personal Information)...');
        
            // Name field
            cy.get('body').then($body => {
              const nameInputSelectors = [
                '#ahf-name',
                '[name="name"]',
                '[id*="name"]'
              ];
              
              const nameSelector = getFirstWorkingSelector(nameInputSelectors, $body);
              cy.get(nameSelector)
                .first()
                .should('be.visible')
                .clear()
                .type('Test User', { delay: 50 })
                .should('have.value', 'Test User')
                .blur();
            });
            cy.log('✅ Typed "Test User" in name field');
        
            // Email field
            cy.get('body').then($body => {
              const emailInputSelectors = [
                'input[name="your-email"]',
                '#ahf-email',
                '[name="email"]',
                '[type="email"]'
              ];
              
              const emailSelector = getFirstWorkingSelector(emailInputSelectors, $body);
              cy.get(emailSelector)
                .first()
                .should('be.visible')
                .should('have.attr', 'type', 'email') 
                .clear()
                .type('testuser@example.com', { delay: 50 })
                .should('have.value', 'testuser@example.com')
                .blur();
            });
            cy.log('✅ Typed "testuser@example.com" in email field');
        
            cy.wait(500);
        
            // Phone field
            cy.get('body').then($body => {
              const phoneInputSelectors = [
                '#ahf-phone',
                '[name="phone"]',
                '[id*="phone"]'
              ];
              
              const phoneSelector = getFirstWorkingSelector(phoneInputSelectors, $body);
              cy.get(phoneSelector)
                .first()
                .should('be.visible')
                .clear()
                .type('(555) 123-4567', { delay: 50 })
                .should('contain.value', '555')
                .blur();
            });
            cy.log('✅ Typed phone number in phone field');
        
            // Planning to sell dropdown
            cy.get('body').then($body => {
              const planningDropdownSelectors = [
                '#ahf-planning-to-sell',
                '[name*="planning"]',
                '[id*="planning"]'
              ];
              
              planningDropdownSelectors.forEach((selector, index) => {
                if ($body.find(selector).length > 0) {
                  cy.log(`✅ Found planning dropdown with selector [${index + 1}/${planningDropdownSelectors.length}]: "${selector}"`);
                  cy.get(selector).first().select(1);
                  cy.log('✅ Selected 2nd option in planning dropdown');
                  return false; // break out of forEach
                } else {
                  cy.log(`❌ Planning dropdown selector [${index + 1}/${planningDropdownSelectors.length}]: "${selector}" not found`);
                }
              });
            });
        
            cy.wait(1000);
        
            // Check for any validation errors before submitting
            cy.get('body').then($body => {
              const validationErrorSelectors = [
                '.wpcf7-not-valid-tip',
                '.error',
                '.validation-error',
                '.field-error'
              ];
              
              validationErrorSelectors.forEach((selector, index) => {
                if ($body.find(selector).length > 0) {
                  cy.get(selector).each($error => {
                    cy.log(`⚠️ Validation error found with selector [${index + 1}/${validationErrorSelectors.length}]: ${$error.text()}`);
                  });
                }
              });
            });
        
            // Verify all fields still have their values before submission
            cy.get('body').then($body => {
              const nameInputSelectors = ['#ahf-name', '[name="name"]', '[id*="name"]'];
              const emailInputSelectors = ['input[name="your-email"]', '#ahf-email', '[name="email"]', '[type="email"]'];
              const phoneInputSelectors = ['#ahf-phone', '[name="phone"]', '[id*="phone"]'];
              
              const nameSelector = getFirstWorkingSelector(nameInputSelectors, $body);
              const emailSelector = getFirstWorkingSelector(emailInputSelectors, $body);
              const phoneSelector = getFirstWorkingSelector(phoneInputSelectors, $body);
              
              cy.get(nameSelector).should('have.value', 'Test User');
              cy.get(emailSelector)
                .should('have.value', 'testuser@example.com')
                .should('have.attr', 'aria-invalid', 'false');
              cy.get(phoneSelector).should('not.have.value', '');
            });
        
            cy.get('body').then($body => {
              const wpcf7FormSelectors = ['.wpcf7-form'];
              const formSelector = getFirstWorkingSelector(wpcf7FormSelectors, $body);
              cy.get(formSelector).should('not.have.class', 'invalid');
            });
        
            cy.log('✅ All fields verified before submission');
        
            // Submit button
            cy.get('body').then($body => {
              const submitButtonSelectors = [
                '.wpcf7-form-control.wpcf7-submit.aios-home-valuation-next-step',
                '.wpcf7-submit',
                '[type="submit"]'
              ];
              
              const submitSelector = getFirstWorkingSelector(submitButtonSelectors, $body);
              cy.get(submitSelector)
                .first()
                .should('be.visible')
                .should('not.be.disabled')
                .click({force:true});
            });
        
            cy.log('✅ Clicked Next for Step 2');
        
            cy.wait(1000);
        
            // Wait for Step 3 to appear with better error handling
            cy.log('🔍 Step 4: Waiting for Step 3...');
        
            // Check for success/error messages
            cy.get('body').then($body => {
              // Success messages
              const successSelectors = [
                '.wpcf7-response-output',
                '.wpcf7-response-output.wpcf7-mail-sent-ok',
                '.aios-home-valuation-success-message',
                '.success-message'
              ];
          
              successSelectors.forEach((selector, index) => {
                if ($body.find(selector).length > 0 && $body.find(selector).is(':visible')) {
                  cy.log(`✅ Success message found with selector [${index + 1}/${successSelectors.length}]: "${selector}"`);
                  cy.get(selector).then($success => {
                    cy.log(`✅ Success message: ${$success.text()}`);
                  });
                } else {
                  cy.log(`❌ Success selector [${index + 1}/${successSelectors.length}]: "${selector}" not found or not visible`);
                }
              });
          
              // Error messages
              const errorSelectors = [
                '.wpcf7-response-output.wpcf7-validation-errors',
                '.wpcf7-response-output.wpcf7-mail-sent-ng',
                '.error-message'
              ];
          
              errorSelectors.forEach((selector, index) => {
                if ($body.find(selector).length > 0 && $body.find(selector).is(':visible')) {
                  cy.log(`⚠️ Error message found with selector [${index + 1}/${errorSelectors.length}]: "${selector}"`);
                  cy.get(selector).then($error => {
                    cy.log(`⚠️ Error message: ${$error.text()}`);
                  });
                } else {
                  cy.log(`✅ Error selector [${index + 1}/${errorSelectors.length}]: "${selector}" not found (good!)`);
                }
              });
            });
          });
        });
    });
}