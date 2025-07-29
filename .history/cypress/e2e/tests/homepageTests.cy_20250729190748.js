module.exports = (site, baseUrl, pass) => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('jQuery is not a function')) {
      return false
    }
    return true
  })

    describe('🏡 Homepage Page', () => {

      // it('🏠 Homepage Loads Successfully', () => {
      //   cy.log('2️⃣ Wait for site to load');
      //   cy.get('header', { timeout: 10000 }).should('be.visible')
      //     .then(($header) => {
      //       if ($header.length > 0 && $header.is(':visible')) {
      //         cy.get('body').should('be.visible');
      //         cy.get('footer').should('be.visible');
      //         cy.log('✅ Loads as expected');
      //       } else {
      //         cy.log('🚨 Header not visible — possible load failure');
      //         throw new Error('❌ Homepage did not load as expected');
      //       }
      //     });
      // });

      // it('🖼️ No Broken Styling or Images', () => {
      //   const brokenImages = [];
      //   const brokenCSS = [];
      //   const brokenFonts = [];

      //   cy.log('2️⃣ Check if all images load properly');
    //     cy.get('img').each(($img) => {
    //       const imgSrc = $img.prop('src');

    //       if (!imgSrc || imgSrc.startsWith('data:')) {
    //         cy.log(`⚠️ Skipping embedded or invalid img: ${imgSrc}`);
    //         return;
    //       }

    //       cy.request({
    //         url: imgSrc,
    //         failOnStatusCode: false, 
    //       }).then((resp) => {
    //         if (resp.status >= 400) {
    //           brokenImages.push(`❌ Broken img: ${imgSrc} (Status: ${resp.status})`);
    //         }
    //       });
    //     });

    //     cy.log('3️⃣ Check if stylesheets load properly');
    //     cy.get('link[rel="stylesheet"]').each(($link) => {
    //       const cssHref = $link.prop('href');

    //       if (!cssHref || cssHref.startsWith('data:')) {
    //         cy.log(`⚠️ Skipping embedded or invalid CSS: ${cssHref}`);
    //         return;
    //       }

    //       cy.request({
    //         url: cssHref,
    //         failOnStatusCode: false,
    //       }).then((resp) => {
    //         if (resp.status >= 400) {
    //           brokenCSS.push(`❌ Broken CSS: ${cssHref} (Status: ${resp.status})`);
    //         }
    //       });
    //     });

    //     cy.log('4️⃣ Check if web fonts load properly');
    //     cy.get('link[href*="fonts"]').each(($link) => {
    //       const fontHref = $link.prop('href');

    //       if (!fontHref || fontHref.startsWith('data:') || fontHref.includes('fonts.googleapis.com/') === false) {
    //         cy.log(`⚠️ Skipping non-Google Fonts or embedded: ${fontHref}`);
    //         return;
    //       }

    //       cy.request({
    //         url: fontHref,
    //         failOnStatusCode: false,
    //       }).then((resp) => {
    //         if (resp.status >= 400) {
    //           brokenFonts.push(`❌ Broken Font: ${fontHref} (Status: ${resp.status})`);
    //         }
    //       });
    //     });

    //     // Final summary log and assertion
    //     cy.then(() => {
    //       cy.log('📋 Final Report:');

    //       let errorMessage = '🚨 Styling or image issues found.';
    //       let hasIssues = false;

    //       if (brokenImages.length > 0) {
    //         hasIssues = true;
    //         cy.log('🖼️ Broken Images:');
    //         brokenImages.forEach((msg) => cy.log(msg));
    //         errorMessage += `\n\nBroken Images:\n${brokenImages.join('\n')}`;
    //       }

    //       if (brokenCSS.length > 0) {
    //         hasIssues = true;
    //         cy.log('🎨 Broken CSS Files:');
    //         brokenCSS.forEach((msg) => cy.log(msg));
    //         errorMessage += `\n\nBroken CSS Files:\n${brokenCSS.join('\n')}`;
    //       }

    //       if (brokenFonts.length > 0) {
    //         hasIssues = true;
    //         cy.log('🔤 Broken Fonts:');
    //         brokenFonts.forEach((msg) => cy.log(msg));
    //         errorMessage += `\n\nBroken Fonts:\n${brokenFonts.join('\n')}`;
    //       }

    //       if (hasIssues) {
    //         cy.log('🚨 Issues detected with styling or images. Failing test.');
    //         throw new Error(errorMessage);
    //       } else {
    //         cy.log('✅ No broken images, CSS, or fonts found');
    //       }
    //     });
    //   });

    //   it('🔎 Quick Search is Present and Functional', () => {
    //     const failedSearch = [];
    //     const selectedValues = {};

    //     // Dynamic selectors for quick search section
    //     const quickSearchSelectors = [
    //         'section.quicksearch',
    //         '#hp-qs',
    //         '#quicksearch',
    //         '.quick-search-container',
    //         '.hp-quick-search',
    //         '.quickSearch',
    //         '.quickSearch',
    //         '.search-section',
    //         '.property-search',
    //         '[data-testid="quick-search"]',
    //         '.search-form-container',
    //         '.quick-search-form'
    //     ];

    //     // Dynamic selectors for dropdown buttons
    //     const dropdownButtonSelectors = [
    //         'button[data-id]',
    //         '.bootstrap-select button',
    //         '.dropdown-toggle',
    //         'button.selectpicker',
    //         '.select-button',
    //         '[data-toggle="dropdown"]',
    //         '.custom-select-trigger',
    //         '.search-dropdown-btn'
    //     ];

    //     // Dynamic selectors for dropdown menu
    //     const dropdownMenuSelectors = [
    //         'ul.dropdown-menu.inner',
    //         '.dropdown-menu',
    //         '.select-dropdown',
    //         '.bootstrap-select .dropdown-menu',
    //         '.custom-dropdown-menu',
    //         '.select-options'
    //     ];

    //     // Dynamic selectors for dropdown options
    //     const dropdownOptionSelectors = [
    //         'li:not(.is-hidden):not(.hidden)',
    //         'li:not([style*="display: none"])',
    //         'li.option',
    //         '.dropdown-item',
    //         '.select-option',
    //         'li[data-original-index]'
    //     ];

    //     // Dynamic selectors for search submit button
    //     const searchButtonSelectors = [
    //         'button[type="submit"]',
    //         '.quicksearch-submit',
    //         '.submit-search',
    //         'input[type="submit"]',
    //         '.search-btn',
    //         '.btn-search',
    //         '[data-testid="search-submit"]',
    //         '.search-button',
    //         '.quick-search-submit'
    //     ];

    //     // Dynamic selectors for advanced search link
    //     const advancedSearchSelectors = [
    //         'a[href*="advanced"]',
    //         'a[href*="homes-for-sale-search-advanced"]',
    //         '.advanced-search-link',
    //         'a[href*="search-advanced"]',
    //         '.advanced-link',
    //         '[data-testid="advanced-search"]',
    //         '.link-advanced'
    //     ];

    //     // Dynamic selectors for advanced search form
    //     const advancedFormSelectors = [
    //         '.ihf-advanced-property-search',
    //         '#ihf-main-search-form',
    //         '.advanced-search-form',
    //         '.property-search-advanced',
    //         '.search-form-advanced',
    //         '[data-testid="advanced-form"]'
    //     ];

    //     // Helper function to ensure element is ready for interaction after animations
    //     const waitForElementReady = (element, elementName) => {
    //         cy.log(`⏳ Waiting for ${elementName} to be fully ready for interaction`);
            
    //         return element
    //             .should('exist')
    //             .should('be.visible')
    //             .scrollIntoView({ duration: 500 })
    //             .then($el => {
    //                 const style = window.getComputedStyle($el[0]);
    //                 const transitionDuration = parseFloat(style.transitionDuration) * 1000;
    //                 const animationDuration = parseFloat(style.animationDuration) * 1000;
    //                 const maxDuration = Math.max(transitionDuration, animationDuration, 500);
                    
    //                 if (maxDuration > 0) {
    //                     cy.wait(maxDuration);
    //                 }
                    
    //                 // Additional check to ensure element is stable
    //                 return cy.wrap($el)
    //                     .should('be.visible')
    //                     .should(($elem) => {
    //                         expect($elem).to.have.css('opacity').not.equal('0');
    //                         expect($elem).to.have.css('visibility').not.equal('hidden');
    //                     });
    //             });
    //     };

    //     // Helper function to find element using multiple selectors
    //     const findElementWithSelectors = (selectors, elementName, options = {}) => {
    //         const trySelector = (index = 0) => {
    //             if (index >= selectors.length) {
    //                 throw new Error(`❌ ${elementName} not found with any of these selectors: ${selectors.join(', ')}`);
    //             }
                
    //             const selector = selectors[index];
                
    //             if (Cypress.$(selector).length > 0) {
    //                 cy.log(`✅ Found ${elementName} with selector: ${selector}`);
    //                 return cy.get(selector, { timeout: 5000, ...options });
    //             } else {
    //                 return trySelector(index + 1);
    //             }
    //         };
            
    //         return trySelector();
    //     };

    //     // Helper function to find element with optional handling
    //     const findElementOptional = (selectors, elementName, options = {}) => {
    //         for (const selector of selectors) {
    //             if (Cypress.$(selector).length > 0) {
    //                 cy.log(`✅ Found ${elementName} with selector: ${selector}`);
    //                 return cy.get(selector, { timeout: 1000, ...options });
    //             }
    //         }
    //         cy.log(`⚠️ ${elementName} not found with any selector`);
    //         return null;
    //     };

    //     cy.log('2️⃣ Locate Quick Search section and ensure it\'s ready');
    //     findElementWithSelectors(quickSearchSelectors, 'Quick Search section')
    //         .then($qs => waitForElementReady(cy.wrap($qs), 'Quick Search section'))
    //         .should('exist');

    //     // Additional wait to ensure all dropdowns are properly initialized
    //     cy.log('⏳ Allowing time for dropdown initialization');
    //     cy.wait(1000);

    //     cy.log('3️⃣ Test all dropdown fields');
    //     findElementWithSelectors(dropdownButtonSelectors, 'Dropdown buttons')
    //         .filter(':visible')
    //         .each(($btn, index) => {
    //             cy.wrap($btn).then(($el) => {
    //                 const label = $el.attr('aria-labelledby') || $el.attr('title') || `Dropdown ${index + 1}`;

    //                 // Ensure dropdown button is ready for interaction
    //                 cy.wrap($el)
    //                     .should('be.visible')
    //                     .should('not.be.disabled')
    //                     .scrollIntoView()
    //                     .wait(200) 
    //                     .click({ force: false }) 
    //                     .then(() => {
    //                         const $dropdown = cy.wrap($el).closest('.bootstrap-select');

    //                         // Check if any dropdown menu exists
    //                         $dropdown.then($dropdownEl => {
    //                             // Try to find dropdown menu with multiple selectors
    //                             let menuFound = false;
    //                             for (const menuSelector of dropdownMenuSelectors) {
    //                                 const $menu = $dropdownEl.find(menuSelector);
    //                                 if ($menu.length > 0) {
    //                                     cy.wrap($menu).should('be.visible');
                                        
    //                                     // Try to find options within the menu
    //                                     for (const optionSelector of dropdownOptionSelectors) {
    //                                         const $options = $menu.find(optionSelector).filter(':visible');
    //                                         if ($options.length > 0) {
    //                                             cy.wrap($options.first())
    //                                                 .should('be.visible')
    //                                                 .click();
    //                                             cy.log(`✅ Selected first option for "${label}"`);
    //                                             menuFound = true;
    //                                             break;
    //                                         }
    //                                     }
    //                                     if (menuFound) break;
    //                                 }
    //                             }
                                
    //                             if (!menuFound) {
    //                                 cy.log(`⚠️ Skipped "${label}" — no options found`);
    //                                 // Close dropdown if it's open
    //                                 cy.wrap($el).click({ force: true });
    //                             }
    //                         });
    //                     });
    //             });
    //         });

    //     cy.log('4️⃣ Click search button');
    //     findElementWithSelectors(searchButtonSelectors, 'Search submit button')
    //         .filter(':visible')
    //         .first()
    //         .should('not.be.disabled')
    //         .should('be.visible')
    //         .scrollIntoView()
    //         .wait(200)
    //         .click();

    //     cy.url().then((currentUrl) => {
    //         cy.log(`Current URL: ${currentUrl}`);

    //         // Check if URL contains search results path
    //         if (currentUrl.includes('/homes-for-sale-results/') || currentUrl.includes('search') || currentUrl.includes('results')) {
    //             cy.log('✅ Search results URL loaded successfully');
            
    //             const url = new URL(currentUrl);
    //             const params = new URLSearchParams(url.search);
            
    //             cy.log('📋 URL Parameters found:');
            
    //             // Check for expected parameters
    //             const expectedParams = ['propertyType', 'cityzip', 'bedrooms', 'bathCount', 'minListPrice'];
    //             let paramCount = 0;
            
    //             expectedParams.forEach(param => {
    //                 if (params.has(param)) {
    //                     const value = params.get(param);
    //                     cy.log(`✅ Parameter "${param}": ${value || '(empty)'}`);
    //                     paramCount++;
    //                 } else {
    //                     cy.log(`⚠️ Parameter "${param}": not found`);
    //                 }
    //             });

    //             if (paramCount > 0) {
    //                 cy.log(`✅ Found ${paramCount} search parameters in URL`);
    //             } else {
    //                 cy.log('❌ No search parameters found in URL');
    //                 failedSearch.push('Search URL missing expected parameters');
    //             }

    //             // Verify selected values appear in URL 
    //             Object.keys(selectedValues).forEach(fieldId => {
    //                 const selectedValue = selectedValues[fieldId];
    //                 const paramMapping = {
    //                     'property-type': 'propertyType',
    //                     'beds': 'bedrooms',
    //                     'baths': 'bathCount',
    //                     'minListPrice': 'minListPrice',
    //                     'maxListPrice': 'minListPrice' 
    //                 };

    //                 const paramName = paramMapping[fieldId];
    //                 if (paramName && params.has(paramName)) {
    //                     cy.log(`✅ Selected value "${selectedValue}" found in URL parameter "${paramName}"`);
    //                 }
    //             });

    //             // Check for ihf-main-search-form on search results page
    //             cy.get('body').then(($body) => {
    //                 if ($body.find('#ihf-main-search-form').length > 0) {
    //                     cy.log('✅ ihf-main-search-form found on search results page');
    //                 } else {
    //                     cy.log('❌ ihf-main-search-form NOT found on search results page');
    //                     failedSearch.push('ihf-main-search-form missing on search results page');
    //                 }
    //             });

    //         } else {
    //             cy.log('❌ Search results page URL validation failed');
    //             failedSearch.push(`Search results page URL validation failed. Expected URL to contain search/results path, but got: ${currentUrl}`);
    //         }
    //     });

    //     cy.log('5️⃣ Go back and click "Advanced" link');
    //     cy.visit(baseUrl);

    //     // Scroll to and wait for quick search section to be fully loaded with proper animation handling
    //     cy.log('🔍 Ensuring Quick Search section is visible and animations complete');
    //     findElementWithSelectors(quickSearchSelectors, 'Quick Search section for advanced link')
    //         .then($qs => waitForElementReady(cy.wrap($qs), 'Quick Search section for advanced search'));

    //     // Try to find advanced search link within quick search section first
    //     cy.log('🔍 Looking for Advanced Search link within Quick Search section');
    //     cy.then(() => {
    //         let linkFoundWithinSection = false;
            
    //         // Check if advanced link exists within the quick search section
    //         for (const selector of advancedSearchSelectors) {
    //             const elementsInSection = Cypress.$('.quicksearch, #quicksearch, .quick-search-container, .hp-quick-search, .quickSearch').find(selector);
    //             if (elementsInSection.length > 0 && elementsInSection.is(':visible')) {
    //                 cy.log(`✅ Found Advanced Search link within Quick Search: ${selector}`);
    //                 cy.get(selector)
    //                     .filter(':visible')
    //                     .first()
    //                     .should('be.visible')
    //                     .scrollIntoView()
    //                     .wait(200)
    //                     .click();
    //                 linkFoundWithinSection = true;
    //                 break;
    //             }
    //         }
            
    //         // If not found within section, try global search
    //         if (!linkFoundWithinSection) {
    //             cy.log('⚠️ Advanced link not found within Quick Search section, trying globally...');
                
    //             let linkFoundGlobally = false;
    //             for (const selector of advancedSearchSelectors) {
    //                 if (Cypress.$(selector).length > 0 && Cypress.$(selector).is(':visible')) {
    //                     cy.log(`✅ Found Advanced Search link globally: ${selector}`);
    //                     cy.get(selector)
    //                         .filter(':visible')
    //                         .first()
    //                         .should('be.visible')
    //                         .scrollIntoView()
    //                         .wait(200)
    //                         .click();
    //                     linkFoundGlobally = true;
    //                     break;
    //                 }
    //             }
                
    //             if (!linkFoundGlobally) {
    //                 throw new Error(`❌ Advanced search link not found with any of these selectors: ${advancedSearchSelectors.join(', ')}`);
    //             }
    //         }
    //     });

    //     cy.log('🔍 Check if Advanced Search page loaded properly');

    //     // Check URL contains "advanced"
    //     cy.url().should('include', 'advanced');

    //     cy.get('body').then(($body) => {
    //         // Check if advanced form exists using multiple selectors
    //         let formFound = false;
    //         for (const selector of advancedFormSelectors) {
    //             if ($body.find(selector).length > 0) {
    //                 cy.log(`✅ Advanced Search page loaded successfully (found: ${selector})`);
    //                 formFound = true;
    //                 break;
    //             }
    //         }
            
    //         if (!formFound) {
    //             cy.log('❌ Advanced Search page missing expected form');
    //             failedSearch.push('Advanced Search page missing expected form');
    //         }
    //     });

    //     // Final check for any failures
    //     cy.then(() => {
    //         if (failedSearch.length > 0) {
    //             throw new Error(`❌ Search functionality issues: ${failedSearch.join(', ')}`);
    //         } else {
    //             cy.log('✅ All search pages loaded and verified successfully');
    //         }
    //     });
    // });

it('🏢 Featured Properties Are Present', () => {
      const failedProperties = [];

      // Dynamic selectors for featured properties section
      const featuredSectionSelectors = [
        'section.featuredProperties',
        '.hp-fp',
        '.listings',
        '.featured-properties',
        '[data-testid="featured-properties"]',
        '.featured-section',
        '.fp-section',
        '.hp-featured-properties',
        'section[class*="properties"]',
        '.property-highlights',
        '.highlighted-properties'
      ];

      // Dynamic selectors for property links
      const propertyLinkSelectors = [
        '.fp-image a',
        '.listings__slider a',
        '.fp-col a',
        '.featuredProperties__col > a',
        '.fp-list a',
        '.featured-properties a',
        '.property-card a',
        '.listing-card a',
        '[data-testid="property-link"]',
        '.property-item a',
        '.featured-item a'
      ];

      // Dynamic selectors for property detail pages
      const propertyDetailSelectors = [
        '.aci-details-equinox',
        '.listings-info',
        '.property-details',
        '.listing-details',
        '[data-testid="property-details"]',
        '.featuredProperties__col a',
        '.detail-container',
        '.property-info',
        '.listing-container'
      ];

      // Dynamic selectors for "View All" button
      const viewAllButtonSelectors = [
        '.featuredProperties__viewMore a',
        'a.site-button'
        '.siteButton a',
        'a.default_button',
        '.view-all-btn',
        '[data-testid="view-all"]',
        '.btn-view-all',
        'a[href*="properties"]',
        '.see-all-properties',
        '.load-more-properties'
      ];

      // Helper function to find element using multiple selectors
      const findElementWithSelectors = (selectors, options = {}) => {
        return cy.window().then(() => {
          for (const selector of selectors) {
            const element = Cypress.$(selector);
            if (element.length > 0) {
              cy.log(`✅ Found element with selector: ${selector}`);
              return cy.get(selector, options);
            }
          }
          throw new Error(`❌ No element found with any of these selectors: ${selectors.join(', ')}`);
        });
      };



      cy.log('2️⃣ Scroll to Featured Properties section');
      findElementWithSelectors(featuredSectionSelectors)
        .should('exist')
        .scrollIntoView();

      cy.log('3️⃣ Click on each property link to check if it loads');
      cy.url().then((homePageUrl) => {
        findElementWithSelectors(propertyLinkSelectors).each(($el, index) => {
          const href = $el.prop('href');
          cy.log(`📝 Checking property #${index + 1}: ${href}`);

          cy.visit(href);
          cy.get('body').then(($body) => {
            let detailsFound = false;
            
            // Check if any of the property detail selectors exist
            for (const selector of propertyDetailSelectors) {
              if ($body.find(selector).length > 0) {
                detailsFound = true;
                cy.log(`✅ Found property details with selector: ${selector}`);
                break;
              }
            }

            if (detailsFound) {
              cy.scrollTo('top', { duration: 1000 })
                .wait(1000);
              cy.scrollTo('bottom', { duration: 1000 })
                .wait(1000);
              cy.scrollTo('center', { duration: 1000 })
                .wait(1000);
              cy.log(`✅ Property accessible: ${href}`);
            } else {
              cy.log(`❌ Property failed - missing property details section: ${href}`);
              failedProperties.push(`❌ Featured Property link missing required section: ${href} (No property details found with selectors: ${propertyDetailSelectors.join(', ')})`);
            }
          });
        });

        // Go back to homepage only once after checking all properties
        cy.visit(homePageUrl);
        findElementWithSelectors(featuredSectionSelectors)
          .should('exist')
          .scrollIntoView();
        cy.wait(500);
      });

      cy.log('4️⃣ Test "View All Listings" button');
      findElementWithSelectors(featuredSectionSelectors).then(($section) => {
        let viewAllButtonFound = false;
        let foundSelector = null;

        // Check if any view all button selector exists within this section
        for (const selector of viewAllButtonSelectors) {
          if ($section.find(selector).length > 0) {
            viewAllButtonFound = true;
            foundSelector = selector;
            cy.log(`✅ Found "View All" button with selector: ${selector}`);
            break;
          }
        }

        if (viewAllButtonFound) {
          cy.wrap($section).within(() => {
            cy.get(foundSelector)
              .should('exist')
              .first() // Ensure we only get the first matching element
              .should(($el) => {
                const text = $el.text().toLowerCase();
                const validTexts = ['view', 'see all', 'show all', 'more', 'browse'];
                const hasValidText = validTexts.some(validText => text.includes(validText));
                expect(hasValidText).to.be.true;
              })
              .click({ force: true });
          });

          // Dynamic URL validation for properties page
          cy.url().should('satisfy', (url) => {
            const validPaths = ['/properties/', '/listings/', '/browse/', '/search/'];
            return validPaths.some(path => url.includes(path));
          });
        } else {
          cy.log('ℹ️ Seems like no "View All" button found - this is optional');
        }
      });

      // Check results after all properties have been tested
      cy.then(() => {
        if (failedProperties.length > 0) {
          cy.log('⚠️ Some property links failed to load:');
          failedProperties.forEach((msg) => cy.log(msg));
          throw new Error(`${failedProperties.length} property links are broken`);
        } else {
          cy.log('✅ All property links opened successfully.');
        }
      });
    });

    // it('🏛️ Featured Communities Are Present', () => {
    //   const failedCommunities = [];

    //   // Dynamic selectors for featured communities section
    //   const featuredCommunitySectionSelectors = [
    //     'section.featuredCommunities',
    //     '.featured-communities',
    //     '[data-testid="featured-communities"]',
    //     '.featured-community-section',
    //     '.fc-section',
    //     'section[class*="community"]',
    //     '.community-highlights',
    //     '.highlighted-communities'
    //   ];

    //   // Dynamic selectors for community links
    //   const communityLinkSelectors = [
    //     '.featuredCommunities__list a',
    //     '.fc-slide a',
    //     '.featured-communities a',
    //     '.community-card a',
    //     '.community-item a',
    //     '[data-testid="community-link"]',
    //     '.fc-list a',
    //     '.featured-community-item a'
    //   ];

    //   // Dynamic selectors for community detail pages
    //   const communityDetailSelectors = [
    //     '.community-featured-image',
    //     '.community-title',
    //     '.community-content',
    //     '.community-main',
    //     '[data-testid="community-details"]',
    //     '.community-info',
    //     '.community-container',
    //     '.community-header'
    //   ];

    //   // Dynamic selectors for "View More Communities" button
    //   const viewMoreButtonSelectors = [
    //     '.siteButton a',
    //     'a.default_button',
    //     '.view-more-btn',
    //     '[data-testid="view-more"]',
    //     '.btn-view-more',
    //     'a[href*="communities"]',
    //     '.see-all-communities',
    //     '.load-more-communities'
    //   ];

    //   // Helper function to find element using multiple selectors
    //   const findElementWithSelectors = (selectors, options = {}) => {
    //     return cy.window().then(() => {
    //       for (const selector of selectors) {
    //         const element = Cypress.$(selector);
    //         if (element.length > 0) {
    //           cy.log(`✅ Found element with selector: ${selector}`);
    //           return cy.get(selector, options);
    //         }
    //       }
    //       throw new Error(`❌ No element found with any of these selectors: ${selectors.join(', ')}`);
    //     });
    //   };

    //   // Helper function to find element with optional handling
    //   const findElementOptional = (selectors, elementName, options = {}) => {
    //     return cy.window().then(() => {
    //       for (const selector of selectors) {
    //         const element = Cypress.$(selector);
    //         if (element.length > 0) {
    //           cy.log(`✅ Found ${elementName} with selector: ${selector}`);
    //           return cy.get(selector, options);
    //         }
    //       }
    //       cy.log(`⚠️ Maybe no ${elementName} exists on this page. Tried selectors: ${selectors.join(', ')}`);
    //       throw new Error(`❌ Maybe no ${elementName} exists - no element found with any of these selectors: ${selectors.join(', ')}`);
    //     });
    //   };

    //   cy.log('2️⃣ Scroll to Featured Communities section');
    //   findElementWithSelectors(featuredCommunitySectionSelectors)
    //     .should('exist')
    //     .scrollIntoView();

    //   cy.log('3️⃣ Click on each community link to check if it loads');
    //   cy.url().then((homePageUrl) => {
    //     findElementWithSelectors(communityLinkSelectors).each(($el, index) => {
    //       const href = $el.prop('href');
    //       cy.log(`📝 Checking community #${index + 1}: ${href}`);

    //       cy.visit(href);
    //       cy.get('body').then(($body) => {
    //         let detailsFound = false;
            
    //         // Check if any of the community detail selectors exist
    //         for (const selector of communityDetailSelectors) {
    //           if ($body.find(selector).length > 0) {
    //             detailsFound = true;
    //             cy.log(`✅ Found community details with selector: ${selector}`);
    //             break;
    //           }
    //         }

    //         if (detailsFound) {
    //           cy.log(`✅ Community accessible: ${href}`);
    //         } else {
    //           cy.log(`❌ Community failed - missing content section: ${href}`);
    //           failedCommunities.push(`❌ Featured Community link missing required section: ${href} (No community details found with selectors: ${communityDetailSelectors.join(', ')})`);
    //         }
    //       });
    //     });

    //     cy.visit(homePageUrl);
    //     findElementWithSelectors(featuredCommunitySectionSelectors)
    //       .should('exist')
    //       .scrollIntoView();
    //     cy.wait(500);
    //   });

    //   cy.log('4️⃣ Test "View More Communities" button');
    //   findElementWithSelectors(featuredCommunitySectionSelectors).within(() => {
    //     findElementOptional(viewMoreButtonSelectors, 'View More Communities button')
    //       .should('exist')
    //       .first() // Ensure we only get the first matching element
    //       .should(($el) => {
    //         const text = $el.text().toLowerCase();
    //         const validTexts = ['view', 'see all', 'show all', 'more', 'browse'];
    //         const hasValidText = validTexts.some(validText => text.includes(validText));
    //         expect(hasValidText).to.be.true;
    //       })
    //       .click({ force: true });
    //   });

    //   // Dynamic URL validation for communities page
    //   cy.url().should('satisfy', (url) => {
    //     const validPaths = ['/communities/', '/community/', '/locations/', '/areas/'];
    //     return validPaths.some(path => url.includes(path));
    //   });

    //   // Check results after all communities have been tested
    //   cy.then(() => {
    //     if (failedCommunities.length > 0) {
    //       cy.log('⚠️ Some community links failed to load:');
    //       failedCommunities.forEach((msg) => cy.log(msg));
    //       throw new Error(`${failedCommunities.length} community links are broken`);
    //     } else {
    //       cy.log('✅ All community links opened successfully.');
    //     }
    //   });
    // });

    // it('💻 Social Media Section Is Present and Clickable', () => {
    //   const failedSocialLinks = [];

    //   // Dynamic selectors for Facebook section
    //   const facebookSectionSelectors = [
    //     'section.hpFacebook',
    //     '.hp-facebook',
    //     '[data-testid="facebook-section"]',
    //     '.facebook-section',
    //     '.fb-section',
    //     'section[class*="facebook"]',
    //     '.social-facebook',
    //     '.facebook-feed-section'
    //   ];

    //   // Dynamic selectors for Facebook post links
    //   const facebookLinkSelectors = [
    //     '.hpFacebook__feed a',
    //     '.hp-fb-list a',
    //     '.facebook-feed a',
    //     '.fb-post a',
    //     '.facebook-post a',
    //     '[data-testid="facebook-link"]',
    //     '.fb-list a',
    //     '.facebook-item a'
    //   ];

    //   // Dynamic selectors for Facebook "See more" button
    //   const facebookButtonSelectors = [
    //     '.siteButton a',
    //     '.fb-button-wrap a',
    //     '.facebook-button a',
    //     '[data-testid="facebook-more"]',
    //     '.see-more-fb',
    //     'a[href*="social"]',
    //     '.fb-more-btn',
    //     '.facebook-see-more'
    //   ];

    //   // Dynamic selectors for Instagram section
    //   const instagramSectionSelectors = [
    //     'section.hpInstagram',
    //     '.hp-instagram',
    //     '[data-testid="instagram-section"]',
    //     '.instagram-section',
    //     '.ig-section',
    //     'section[class*="instagram"]',
    //     '.social-instagram',
    //     '.instagram-feed-section'
    //   ];

    //   // Dynamic selectors for Instagram post links
    //   const instagramLinkSelectors = [
    //     '.hpInstagram__feed a',
    //     '.hp-ig-list a',
    //     '.instagram-feed a',
    //     '.ig-post a',
    //     '.instagram-post a',
    //     '[data-testid="instagram-link"]',
    //     '.ig-list a',
    //     '.instagram-item a'
    //   ];

    //   // Dynamic selectors for Instagram "See more" button
    //   const instagramButtonSelectors = [
    //     '.siteButton a',
    //     '.hp-ig-buttons a',
    //     '.instagram-button a',
    //     '[data-testid="instagram-more"]',
    //     '.see-more-ig',
    //     'a[href*="social"]',
    //     '.ig-more-btn',
    //     '.instagram-see-more'
    //   ];

    //   // Helper function to find element using multiple selectors
    //   const findElementWithSelectors = (selectors, options = {}) => {
    //     return cy.window().then(() => {
    //       for (const selector of selectors) {
    //         const element = Cypress.$(selector);
    //         if (element.length > 0) {
    //           cy.log(`✅ Found element with selector: ${selector}`);
    //           return cy.get(selector, options);
    //         }
    //       }
    //       throw new Error(`❌ No element found with any of these selectors: ${selectors.join(', ')}`);
    //     });
    //   };

    //   // Helper function to find element with optional handling
    //   const findElementOptional = (selectors, elementName, options = {}) => {
    //     return cy.window().then(() => {
    //       for (const selector of selectors) {
    //         const element = Cypress.$(selector);
    //         if (element.length > 0) {
    //           cy.log(`✅ Found ${elementName} with selector: ${selector}`);
    //           return cy.get(selector, options);
    //         }
    //       }
    //       cy.log(`⚠️ Maybe no ${elementName} exists on this page. Tried selectors: ${selectors.join(', ')}`);
    //       // Don't throw error, let the calling code handle it with try-catch
    //       return cy.wrap(null);
    //     });
    //   };

    //   // Helper function to safely execute test steps without stopping execution
    //   const safeExecute = (testName, testFunction) => {
    //     try {
    //       return testFunction();
    //     } catch (error) {
    //       cy.log(`⚠️ ${testName} failed: ${error.message}`);
    //       failedSocialLinks.push(`❌ ${testName} failed: ${error.message}`);
    //       return cy.wrap(null);
    //     }
    //   };

    //   cy.log('2️⃣ Scroll to Facebook section');
    //   cy.then(() => {
    //     try {
    //       findElementWithSelectors(facebookSectionSelectors)
    //         .should('exist')
    //         .scrollIntoView();

    //       cy.log('3️⃣ Click on each Facebook posts link to check if it loads');
    //       cy.url().then((homePageUrl) => {
    //         findElementWithSelectors(facebookLinkSelectors).each(($el, index) => {
    //           const href = $el.prop('href');
    //           cy.log(`📝 Checking facebook post #${index + 1}: ${href}`);

    //           // Check if link has target="_blank" or opens in new tab
    //           const target = $el.attr('target');
    //           const isExternalLink = href.includes('facebook.com') || href.includes('fb.com');
            
    //           if (target === '_blank' || isExternalLink) {
    //             cy.log(`✅ Facebook post opens in new tab: ${href}`);
    //           } else {
    //             cy.log(`❌ Facebook post failed - not opening in new tab: ${href}`);
    //             failedSocialLinks.push(`❌ Facebook post link not opening in new tab: ${href}`);
    //           }
    //         });

    //         // Go back to homepage after checking all posts
    //         cy.visit(homePageUrl);
    //         findElementWithSelectors(facebookSectionSelectors)
    //           .should('exist')
    //           .scrollIntoView();
    //         cy.wait(500);
    //       });

    //       cy.log('4️⃣ Test Facebook "See more posts" button');
    //       cy.then(() => {
    //         try {
    //           findElementWithSelectors(facebookSectionSelectors).within(() => {
    //             findElementOptional(facebookButtonSelectors, 'Facebook See more posts button').then(($el) => {
    //               if ($el === null) {
    //                 throw new Error('Maybe no Facebook See more posts button exists on this page');
    //               }
                  
    //               cy.wrap($el)
    //                 .should('exist')
    //                 .should(($element) => {
    //                   const text = $element.text().toLowerCase();
    //                   const validTexts = ['more', 'see more', 'view more', 'show more'];
    //                   const hasValidText = validTexts.some(validText => text.includes(validText));
    //                   expect(hasValidText).to.be.true;
    //                 })
    //                 .first()
    //                 .click({ force: true });
    //             });
    //           });

    //           // Dynamic URL validation for social media page
    //           cy.url().should('satisfy', (url) => {
    //             const validPaths = ['/social-media/', '/social/', '/facebook/', '/fb/'];
    //             return validPaths.some(path => url.includes(path));
    //           });

    //         } catch (error) {
    //           cy.log(`⚠️ Facebook "See more posts" button testing failed: ${error.message}`);
    //           failedSocialLinks.push(`❌ Facebook "See more posts" button failed: ${error.message}`);
    //         }
    //       });

    //     } catch (error) {
    //       cy.log(`⚠️ Facebook section testing failed: ${error.message}`);
    //       failedSocialLinks.push(`❌ Facebook section testing failed: ${error.message}`);
    //     }
    //   });

    //   // Go back to homepage for Instagram testing
    //   cy.visit(baseUrl);

    //   cy.log('5️⃣ Scroll to Instagram section');
    //   cy.then(() => {
    //     try {
    //       findElementWithSelectors(instagramSectionSelectors)
    //         .should('exist')
    //         .scrollIntoView();

    //       cy.log('6️⃣ Click on each Instagram posts link to check if it loads');
    //       cy.url().then((homePageUrl) => {
    //         findElementWithSelectors(instagramLinkSelectors).each(($el, index) => {
    //           const href = $el.prop('href');
    //           cy.log(`📝 Checking instagram post #${index + 1}: ${href}`);

    //           // Check if link has target="_blank" or opens in new tab
    //           const target = $el.attr('target');
    //           const isExternalLink = href.includes('instagram.com') || href.includes('insta');
            
    //           if (target === '_blank' || isExternalLink) {
    //             cy.log(`✅ Instagram post opens in new tab: ${href}`);
    //           } else {
    //             cy.log(`❌ Instagram post failed - not opening in new tab: ${href}`);
    //             failedSocialLinks.push(`❌ Instagram post link not opening in new tab: ${href}`);
    //           }
    //         });

    //         // Go back to homepage after checking all posts
    //         cy.visit(homePageUrl);
    //         findElementWithSelectors(instagramSectionSelectors)
    //           .should('exist')
    //           .scrollIntoView();
    //         cy.wait(500);
    //       });

    //       cy.log('7️⃣ Test Instagram "See more posts" button');
    //       cy.then(() => {
    //         try {
    //           findElementWithSelectors(instagramSectionSelectors).within(() => {
    //             findElementOptional(instagramButtonSelectors, 'Instagram See more posts button').then(($el) => {
    //               if ($el === null) {
    //                 throw new Error('Maybe no Instagram See more posts button exists on this page');
    //               }
                  
    //               cy.wrap($el)
    //                 .should('exist')
    //                 .should(($element) => {
    //                   const text = $element.text().toLowerCase();
    //                   const validTexts = ['more', 'see more', 'view more', 'show more'];
    //                   const hasValidText = validTexts.some(validText => text.includes(validText));
    //                   expect(hasValidText).to.be.true;
    //                 })
    //                 .first()
    //                 .click({ force: true });
    //             });
    //           });

    //           // Dynamic URL validation for social media page
    //           cy.url().should('satisfy', (url) => {
    //             const validPaths = ['/social-media/', '/social/', '/instagram/', '/ig/'];
    //             return validPaths.some(path => url.includes(path));
    //           });

    //         } catch (error) {
    //           cy.log(`⚠️ Instagram "See more posts" button testing failed: ${error.message}`);
    //           failedSocialLinks.push(`❌ Instagram "See more posts" button failed: ${error.message}`);
    //         }
    //       });

    //     } catch (error) {
    //       cy.log(`⚠️ Instagram section testing failed: ${error.message}`);
    //       failedSocialLinks.push(`❌ Instagram section testing failed: ${error.message}`);
    //     }
    //   });

    //   // Check results after all posts have been tested
    //   cy.then(() => {
    //     if (failedSocialLinks.length > 0) {
    //       cy.log('⚠️ Some social media links failed to load:');
    //       failedSocialLinks.forEach((msg) => cy.log(msg));
    //       throw new Error(`${failedSocialLinks.length} social media links are broken`);
    //     } else {
    //       cy.log('✅ All social media links opened successfully.');
    //     }
    //   });
    // });

    // it('🗣️ Testimonials Section and Navigation', () => {
    //   // Dynamic selectors for testimonials section
    //   const testimonialsSectionSelectors = [
    //     'section.hpTestimonials',
    //     '.hp-testi',
    //     '.hp-testimonials',
    //     '.testimonials-section',
    //     'section[class*="testimonial"]',
    //     '[data-testid="testimonials"]',
    //     '.testimonials',
    //     '.testimonial-container',
    //     '.client-testimonials'
    //   ];

    //   // Dynamic selectors for active testimonial text
    //   const activeTestimonialSelectors = [
    //     '.swiper-slide-active .hpTestimonials__list p',
    //     // '.is-active p',
    //     '.swiper-slide-active p',
    //     '.active-slide p',
    //     '.testimonial-active p',
    //     '.current-testimonial p',
    //     '.splide__slide.is-active p',
    //     '.testimonial-slide.active p',
    //     '.testimonial-item.active p'
    //   ];

    //   // Dynamic selectors for next arrow
    //   const nextArrowSelectors = [
    //     '.testi-next',
    //     '.testi-arrow.testi-next',
    //     '.hpTestimonialsNext',
    //     '.splide__arrow--next',
    //     '.swiper-button-next',
    //     '.testimonial-next',
    //     '.arrow-next',
    //     '.next-arrow',
    //     '.testimonials-next',
    //     '[data-testid="testimonial-next"]',
    //     '.slider-arrow-next'
    //   ];

    //   // Dynamic selectors for prev arrow
    //   const prevArrowSelectors = [
    //     '.testi-prev',
    //     '.testi-arrow.testi-prev',
    //     '.hpTestimonialsPrev',
    //     '.splide__arrow--prev',
    //     '.swiper-button-prev',
    //     '.testimonial-prev',
    //     '.arrow-prev',
    //     '.prev-arrow',
    //     '.testimonials-prev',
    //     '[data-testid="testimonial-prev"]',
    //     '.slider-arrow-prev'
    //   ];

    //   // Dynamic selectors for testimonial controls container
    //   const controlsContainerSelectors = [
    //     '.testi-control',
    //     '.testimonial-controls',
    //     '.slider-controls',
    //     '.testimonials-arrows',
    //     '.arrow-controls'
    //   ];

    //   // Helper function to find element using multiple selectors with visibility handling
    //   const findElementWithSelectors = (selectors, elementName, options = {}) => {
    //     const trySelector = (index = 0) => {
    //       if (index >= selectors.length) {
    //         throw new Error(`❌ ${elementName} not found with any of these selectors: ${selectors.join(', ')}`);
    //       }
          
    //       const selector = selectors[index];
          
    //       return cy.document().then((doc) => {
    //         if (doc.querySelector(selector)) {
    //           cy.log(`✅ Found ${elementName} with selector: ${selector}`);
    //           return cy.get(selector, { timeout: 10000, ...options });
    //         } else {
    //           return trySelector(index + 1);
    //         }
    //       });
    //     };
        
    //     return trySelector();
    //   };

    //   // Helper function to make controls visible by hovering or triggering animation
    //   const makeControlsVisible = () => {
    //     cy.log('🎯 Making testimonial controls visible');
        
    //     // Try to find and hover over the testimonials section to trigger visibility
    //     findElementWithSelectors(testimonialsSectionSelectors, 'Testimonials section')
    //       .trigger('mouseover', { force: true });
        
    //     // Also try to find and hover over the controls container specifically
    //     cy.document().then((doc) => {
    //       for (const selector of controlsContainerSelectors) {
    //         const element = doc.querySelector(selector);
    //         if (element) {
    //           cy.log(`🎯 Found controls container: ${selector}`);
    //           cy.get(selector).trigger('mouseover', { force: true });
    //           break;
    //         }
    //       }
    //     });
        
    //     cy.wait(500); 
    //   };

    //   // Store the initial text in a variable accessible to all steps
    //   let trimmedInitial;

    //   // Wait for page to be fully loaded
    //   cy.log('1️⃣ Ensuring page is loaded');
    //   cy.document().should('exist');
    //   cy.get('html').should('be.visible');

    //   cy.log('2️⃣ Scroll to Testimonials section');
    //   findElementWithSelectors(testimonialsSectionSelectors, 'Testimonials section')
    //     .should('exist')
    //     .scrollIntoView()
    //     .as('testimonialsSection');

    //   cy.log('3️⃣ Get initial testimonial text');
    //   cy.get('@testimonialsSection').within(() => {
    //     findElementWithSelectors(activeTestimonialSelectors, 'Active testimonial text')
    //       .invoke('text')
    //       .then((initialText) => {
    //         trimmedInitial = initialText.trim();
    //         cy.log(`📋 Initial: "${trimmedInitial}"`);
    //       });
    //   });

    //   cy.log('4️⃣ Click ➡️ Next arrow');
    //   makeControlsVisible(); // Make controls visible first
    //   cy.get('@testimonialsSection').within(() => {
    //     findElementWithSelectors(nextArrowSelectors, 'Next arrow')
    //       .should('exist') 
    //       .then(($el) => {
    //         // Check if element is visible, if not try to make it visible
    //         if (!$el.is(':visible')) {
    //           cy.log('⚠️ Arrow not visible, trying to make it visible');
    //           cy.wrap($el).invoke('show'); 
    //           cy.wrap($el).parent().trigger('mouseover', { force: true }); 
    //         }
    //       })
    //       .first()
    //       .click({ force: true }); // Use force: true to click even if not visible
    //   });
    //   cy.wait(1000);

    //   cy.log('5️⃣ Get text after Next click');
    //   cy.get('@testimonialsSection').within(() => {
    //     findElementWithSelectors(activeTestimonialSelectors, 'Active testimonial text after next')
    //       .should('be.visible')
    //       .invoke('text')
    //       .then((nextText) => {
    //         const trimmedNext = nextText.trim();
    //         cy.log(`➡️ New: "${trimmedNext}"`);
          
    //         if (trimmedNext === trimmedInitial) {
    //           cy.log('❌ Testimonial did not change after clicking Next');
    //           throw new Error("❌ Testimonial arrow didn't work — content did not change after clicking Next");
    //         } else {
    //           cy.log('✅ Right arrow (Next) navigation is working');
    //         }
    //       });
    //   });

    //   cy.log('6️⃣ Click ⬅️ Prev arrow');
    //   makeControlsVisible(); 
    //   cy.get('@testimonialsSection').within(() => {
    //     findElementWithSelectors(prevArrowSelectors, 'Prev arrow')
    //       .should('exist') 
    //       .then(($el) => {
    //         // Check if element is visible, if not try to make it visible
    //         if (!$el.is(':visible')) {
    //           cy.log('⚠️ Arrow not visible, trying to make it visible');
    //           cy.wrap($el).invoke('show'); // Try to show the element
    //           cy.wrap($el).parent().trigger('mouseover', { force: true });
    //         }
    //       })
    //       .first()
    //       .click({ force: true }); // Use force: true to click even if not visible
    //   });
    //   cy.wait(1000);

    //   cy.log('7️⃣ Get text after Prev click');
    //   cy.get('@testimonialsSection').within(() => {
    //     findElementWithSelectors(activeTestimonialSelectors, 'Active testimonial text after prev')
    //       .should('be.visible')
    //       .invoke('text')
    //       .then((finalText) => {
    //         const trimmedFinal = finalText.trim();
    //         cy.log(`🔁 Final: "${trimmedFinal}"`);
          
    //         if (trimmedFinal !== trimmedInitial) {
    //           cy.log('❌ Testimonial did not return to original after clicking Prev');
    //           throw new Error("❌ Testimonial arrow didn't work — content did not return after clicking Prev");
    //         } else {
    //           cy.log('✅ Left arrow (Prev) navigation is working');
    //         }
    //       });
    //   });
    // });

    // it('📰 Latest News or Blog Section Is Present', () => {
    //   const failedArticles = [];

    //   // Dynamic selectors for news/blog section
    //   const newsSectionSelectors = [
    //     'section.latestNews',
    //     '.hp-blog',
    //     '.latest-news',
    //     '.news-section',
    //     '.blog-section',
    //     'section[class*="news"]',
    //     'section[class*="blog"]',
    //     '[data-testid="news-section"]',
    //     '[data-testid="blog-section"]',
    //     '.news-container',
    //     '.blog-container'
    //   ];

    //   // Dynamic selectors for article links
    //   const articleLinkSelectors = [
    //     '.latestNews__list a',
    //     '.blog-list a',
    //     '.news-list a',
    //     '.article-list a',
    //     '.blog-item a',
    //     '.news-item a',
    //     '.post-link',
    //     '.blog-link',
    //     '.news-link',
    //     '[data-testid="article-link"]',
    //     '.latest-news a',
    //     '.blog-posts a'
    //   ];

    //   // Dynamic selectors for article content (to verify page loaded correctly)
    //   const articleContentSelectors = [
    //     '.singlePost',
    //     '.entry-content',
    //     '.post-content',
    //     '.article-content',
    //     '.blog-content',
    //     '.news-content',
    //     '.single-post',
    //     '.post-body',
    //     '.article-body',
    //     '[data-testid="article-content"]',
    //     '.content-area'
    //   ];

    //   // Dynamic selectors for "View All" button
    //   const viewAllButtonSelectors = [
    //     '.siteButton a',
    //     '.blog-button a',
    //     '.view-all-btn a',
    //     '.more-posts a',
    //     '.see-all a',
    //     '.view-more a',
    //     '.all-posts a',
    //     '[data-testid="view-all"]',
    //     '.btn-view-all',
    //     '.news-more a'
    //   ];

    //   // Helper function to find element using multiple selectors
    //   const findElementWithSelectors = (selectors, elementName, options = {}) => {
    //     // Try each selector one by one with proper Cypress commands
    //     const trySelector = (index = 0) => {
    //       if (index >= selectors.length) {
    //         throw new Error(`❌ ${elementName} not found with any of these selectors: ${selectors.join(', ')}`);
    //       }
          
    //       const selector = selectors[index];
          
    //       // Check if element exists in DOM first using Cypress.$
    //       if (Cypress.$(selector).length > 0) {
    //         cy.log(`✅ Found ${elementName} with selector: ${selector}`);
    //         return cy.get(selector, { timeout: 2000, ...options });
    //       } else {
    //         return trySelector(index + 1);
    //       }
    //     };
        
    //     return trySelector();
    //   };

    //   // Helper function to check if any content selector exists
    //   const hasArticleContent = () => {
    //     for (const selector of articleContentSelectors) {
    //       if (Cypress.$(selector).length > 0) {
    //         cy.log(`✅ Found article content with selector: ${selector}`);
    //         return true;
    //       }
    //     }
    //     return false;
    //   };

    //   cy.log('2️⃣ Scroll to Latest News section');
    //   findElementWithSelectors(newsSectionSelectors, 'News/Blog section')
    //     .should('exist')
    //     .scrollIntoView();

    //   // Break the chain - find the section again to avoid stale element
    //   findElementWithSelectors(newsSectionSelectors, 'News/Blog section for validation').within(() => {
    //     findElementWithSelectors(articleLinkSelectors, 'Article links')
    //       .should('have.length.greaterThan', 0);
    //   });

    //   cy.log('3️⃣ Click on each news article link to check if it loads');
    //   cy.url().then((homePageUrl) => {
    //     findElementWithSelectors(articleLinkSelectors, 'Article links for testing')
    //       .each(($el, index) => {
    //         const href = $el.prop('href');
    //         cy.log(`📝 Checking article #${index + 1}: ${href}`);
          
    //         cy.visit(href);
    //         cy.get('body').then(($body) => {
    //           if (hasArticleContent()) {
    //             cy.log(`✅ Blog accessible: ${href}`);
    //           } else {
    //             cy.log(`❌ Article failed - missing content section: ${href}`);
    //             failedArticles.push(`❌ Article link missing required section: ${href} (No content section found)`);
    //           }
    //         });
    //       });

    //     // Go back to homepage only once after checking all articles
    //     cy.visit(homePageUrl);
    //     findElementWithSelectors(newsSectionSelectors, 'News/Blog section after return')
    //       .should('exist')
    //       .scrollIntoView();
    //     cy.wait(500);
    //   });

    //   cy.log('4️⃣ Test "View All Posts" button');
    //   // Find the section fresh again to avoid stale element reference
    //   findElementWithSelectors(newsSectionSelectors, 'News/Blog section for button test').within(() => {
    //     findElementWithSelectors(viewAllButtonSelectors, '"View All" button')
    //       .should('exist')
    //       .should(($el) => {
    //         const text = $el.text().toLowerCase();
    //         const validTexts = ['view', 'read', 'more', 'all', 'see'];
    //         const hasValidText = validTexts.some(validText => text.includes(validText));
    //         expect(hasValidText).to.be.true;
    //       })
    //       .click({ force: true });
    //   });

    //   cy.url().should('include', '/category/');

    //   // Check results after all articles have been tested
    //   cy.then(() => {
    //     if (failedArticles.length > 0) {
    //       cy.log('⚠️ Some blog links failed to load:');
    //       failedArticles.forEach((msg) => cy.log(msg));
    //       throw new Error(`${failedArticles.length} article links are broken`);
    //     } else {
    //       cy.log('✅ All blog links opened successfully.');
    //     }
    //   });
    // });


    // it('📱 Comprehensive Phone & Header Validation - Mobile Header, Clickability & Agent Image Check', () => {
    //     const prohibitedNumbers = [
    //         '+1.877.729.5534',
    //         '+1.877.317.4111',
    //         '+1.310.595.9033'
    //     ]
        
    //     const viewports = [
    //         { name: 'desktop', width: 1280, height: 720 },
    //         { name: 'mobile', width: 375, height: 667 }
    //     ]
        
    //     const phoneSelectors = ['.aios-ai-phone', '.amh-phone']
        
    //     // Collect all errors from all test cases
    //     let mobileHeaderIssues = []
    //     let clickabilityIssues = []
    //     let validationIssues = []
        
    //     // Success tracking
    //     let mobileHeaderSuccess = []
    //     let clickabilitySuccess = []
    //     let validationSuccess = []
    //     let totalPhoneNumbers = 0

    //     cy.log(`Found ${viewports.length} viewports to test`)

    //     // ============================================
    //     // TEST CASE 1: Mobile Header Validation
    //     // ============================================
    //     cy.log('📋 Test Case 1: Mobile Header Agent Image Validation')
        
    //     cy.viewport(390, 844) // Mobile resolution for header test
        
    //     cy.get('.aios-mobile-header-wrapper, .header__container, .site-header__container, .block-header__inner, .mobile-header-menu').then(($header) => {
    //         if ($header.length) {
    //             const headerText = $header.text().trim()
                
    //             // Define the Agent Image numbers and email
    //             const agentImageNumbers = [
    //                 '877.729.5534',
    //                 '877.317.4111',
    //                 '310.595.9033',
    //                 '843.973.0182'
    //             ]
    //             const agentImageEmail = ['support@agentimage.com']
                
    //             // Extract valid phone numbers and emails
    //             const detectedPhoneNumbers = (headerText.match(/\+?\d{0,2}[.\s-]?\(?\d{3}\)?[.\s-]?\d{3}[.\s-]?\d{4}/g) || [])
    //                 .map(num => num.trim())
    //                 .filter(num => num.length > 6)
                
    //             const detectedEmails = (headerText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [])
    //                 .map(email => email.trim())
                
    //             // Check for matches
    //             const matchingPhoneNumbers = detectedPhoneNumbers.filter(number => agentImageNumbers.includes(number))
    //             const matchingEmail = detectedEmails.find(email => agentImageEmail.includes(email)) || null
                
    //             // Validate phone numbers
    //             if (detectedPhoneNumbers.length > 0) {
    //                 cy.log(`🔍 Detected phone numbers in mobile header: ${detectedPhoneNumbers.join(', ')}`)
                    
    //                 if (matchingPhoneNumbers.length > 0) {
    //                     const errorMsg = `❌ Mobile header contains Agent Image phone numbers: ${matchingPhoneNumbers.join(', ')}`
    //                     cy.log(errorMsg)
    //                     mobileHeaderIssues.push(errorMsg)
    //                 } else {
    //                     const successMsg = `✅ Phone numbers found but none match Agent Image: ${detectedPhoneNumbers.join(', ')}`
    //                     cy.log(successMsg)
    //                     mobileHeaderSuccess.push(successMsg)
    //                 }
    //             } else {
    //                 const successMsg = '✅ No phone numbers found in mobile header'
    //                 cy.log(successMsg)
    //                 mobileHeaderSuccess.push(successMsg)
    //             }
                
    //             // Validate emails
    //             if (detectedEmails.length > 0) {
    //                 cy.log(`🔍 Detected email(s) in mobile header: ${detectedEmails.join(', ')}`)
                    
    //                 if (matchingEmail) {
    //                     const errorMsg = `❌ Mobile header contains Agent Image email: ${matchingEmail}`
    //                     cy.log(errorMsg)
    //                     mobileHeaderIssues.push(errorMsg)
    //                 } else {
    //                     const successMsg = `✅ Email found but does not match Agent Image: ${detectedEmails.join(', ')}`
    //                     cy.log(successMsg)
    //                     mobileHeaderSuccess.push(successMsg)
    //                 }
    //             } else {
    //                 const successMsg = '✅ No email found in mobile header'
    //                 cy.log(successMsg)
    //                 mobileHeaderSuccess.push(successMsg)
    //             }
    //         } else {
    //             const errorMsg = '❌ Mobile header element not found on the page'
    //             cy.log(errorMsg)
    //             mobileHeaderIssues.push(errorMsg)
    //         }
    //     })

    //     // ============================================
    //     // TEST CASE 2 & 3: Phone Clickability and Validation (Combined)
    //     // ============================================
    //     cy.log('📋 Test Case 2 & 3: Phone Clickability and Agent Image Validation')
        
    //     cy.wrap(viewports).each(({ name, width, height }) => {
    //         cy.log(`🔍 Testing ${name} view (${width}x${height})`)
    //         cy.viewport(width, height)
    //         cy.visit('/')
    //         cy.scrollTo('bottom').wait(1000)
    //         cy.scrollTo('bottom').wait(1000)
            
    //         // Test all phone selectors
    //         cy.wrap(phoneSelectors).each((selector) => {
    //             cy.get('body').then(($body) => {
    //                 const $foundElements = $body.find(selector)
                    
    //                 if ($foundElements.length > 0) {
    //                     cy.log(`   📱 Found ${$foundElements.length} elements with selector: ${selector}`)
                        
    //                     cy.get(selector).each(($el) => {
    //                         const isVisible = Cypress.$($el).is(':visible')
    //                         const phoneNumber = $el.text().trim()
    //                         const href = $el.attr('href') || ''
    //                         totalPhoneNumbers++
                            
    //                         if (isVisible) {
    //                             // TEST CASE 2: Check clickability (tel: format)
    //                             if (href.match(/^tel:/)) {
    //                                 const successMsg = `✅ [${name}] ${selector} — Phone "${phoneNumber}" is clickable with tel: format`
    //                                 cy.log(successMsg)
    //                                 clickabilitySuccess.push(successMsg)
                                    
    //                                 cy.wrap($el).should('not.have.attr', 'disabled')
    //                             } else {
    //                                 const errorMsg = `❌ [${name}] ${selector} — Phone "${phoneNumber}" missing tel: format (href: "${href}")`
    //                                 cy.log(errorMsg)
    //                                 clickabilityIssues.push(errorMsg)
    //                             }
                                
    //                             // TEST CASE 3: Check validation (format matching and prohibited numbers)
    //                             if (selector === '.aios-ai-phone' && href.match(/^tel:/)) {
    //                                 const hrefNumber = href.replace('tel:', '').trim()
    //                                 const displayedNumber = phoneNumber
                                    
    //                                 const countryCodeMatch = hrefNumber.match(/^\+(\d{1,3})/)
    //                                 const countryCode = countryCodeMatch ? countryCodeMatch[1] : '1'
                                    
    //                                 // Normalize the displayed number
    //                                 let cleanedDisplay = displayedNumber
    //                                     .replace(/\s+/g, '')
    //                                     .replace(/[()-]/g, '')
    //                                     .replace(/\./g, '.')
                                    
    //                                 let formattedDisplayedNumber
    //                                 if (cleanedDisplay.startsWith(`+${countryCode}`)) {
    //                                     formattedDisplayedNumber = cleanedDisplay
    //                                 } else {
    //                                     formattedDisplayedNumber = `+${countryCode}.${cleanedDisplay}`
    //                                 }
                                    
    //                                 // Check 1: Format matching
    //                                 if (formattedDisplayedNumber === hrefNumber) {
    //                                     const successMsg = `✅ [${name}] Phone "${displayedNumber}" matches href format`
    //                                     cy.log(successMsg)
    //                                     validationSuccess.push(successMsg)
    //                                 } else {
    //                                     const errorMsg = `❌ [${name}] Phone "${displayedNumber}" does not match href "${hrefNumber}"`
    //                                     cy.log(errorMsg)
    //                                     validationIssues.push(errorMsg)
    //                                 }
                                    
    //                                 // Check 2: Prohibited numbers
    //                                 if (!prohibitedNumbers.includes(hrefNumber)) {
    //                                     const successMsg = `✅ [${name}] Phone "${displayedNumber}" is not prohibited`
    //                                     cy.log(successMsg)
    //                                     validationSuccess.push(successMsg)
    //                                 } else {
    //                                     const errorMsg = `❌ [${name}] Phone "${displayedNumber}" is a prohibited Agent Image number`
    //                                     cy.log(errorMsg)
    //                                     validationIssues.push(errorMsg)
    //                                 }
    //                             }
    //                         } else {
    //                             cy.log(`⚠️ [${name}] ${selector} — Skipped "${phoneNumber}" (not visible)`)
    //                         }
    //                     })
    //                 } else {
    //                     cy.log(`   ⚠️ [${name}] No elements found for selector: ${selector}`)
    //                 }
    //             })
    //         })
    //     })
        
    //     // ============================================
    //     // FINAL VALIDATION - ALL TEST CASES COMBINED
    //     // ============================================
    //     cy.then(() => {
    //         // Combine all issues from all test cases
    //         const allIssues = [
    //             ...mobileHeaderIssues,
    //             ...clickabilityIssues,
    //             ...validationIssues
    //         ]
            
    //         // Log summary for each test case
    //         cy.log('🎯 ========== COMPREHENSIVE PHONE & HEADER VALIDATION RESULTS ==========')
            
    //         // Test Case 1 Results
    //         if (mobileHeaderIssues.length === 0) {
    //             cy.log('✅ TEST CASE 1: Mobile Header Agent Image Validation - PASSED')
    //             cy.log(`   ✅ ${mobileHeaderSuccess.length} mobile header validations passed`)
    //         } else {
    //             cy.log('❌ TEST CASE 1: Mobile Header Agent Image Validation - FAILED')
    //             cy.log(`   ❌ ${mobileHeaderIssues.length} mobile header issues found`)
    //             cy.log(`   ✅ ${mobileHeaderSuccess.length} mobile header validations passed`)
    //             mobileHeaderIssues.forEach(issue => cy.log(`   ${issue}`))
    //         }
            
    //         // Test Case 2 Results
    //         if (clickabilityIssues.length === 0) {
    //             cy.log('✅ TEST CASE 2: Phone Clickability - PASSED')
    //             cy.log(`   ✅ ${clickabilitySuccess.length} phone clickability checks passed`)
    //         } else {
    //             cy.log('❌ TEST CASE 2: Phone Clickability - FAILED')
    //             cy.log(`   ❌ ${clickabilityIssues.length} phone clickability issues found`)
    //             cy.log(`   ✅ ${clickabilitySuccess.length} phone clickability checks passed`)
    //             clickabilityIssues.forEach(issue => cy.log(`   ${issue}`))
    //         }
            
    //         // Test Case 3 Results
    //         if (validationIssues.length === 0) {
    //             cy.log('✅ TEST CASE 3: Phone Validation & Agent Image Check - PASSED')
    //             cy.log(`   ✅ ${validationSuccess.length} phone validation checks passed`)
    //         } else {
    //             cy.log('❌ TEST CASE 3: Phone Validation & Agent Image Check - FAILED')
    //             cy.log(`   ❌ ${validationIssues.length} phone validation issues found`)
    //             cy.log(`   ✅ ${validationSuccess.length} phone validation checks passed`)
    //             validationIssues.forEach(issue => cy.log(`   ${issue}`))
    //         }
                    
    //         // Create detailed error message for assertion
    //         let errorMessage = `COMPREHENSIVE PHONE & HEADER VALIDATION FAILED with ${allIssues.length} total issues:\n\n`
            
    //         if (mobileHeaderIssues.length > 0) {
    //             errorMessage += `🔴 Mobile Header Issues (${mobileHeaderIssues.length}):\n`
    //             mobileHeaderIssues.forEach(issue => errorMessage += `   ${issue}\n`)
    //             errorMessage += '\n'
    //         }
            
    //         if (clickabilityIssues.length > 0) {
    //             errorMessage += `🔴 Phone Clickability Issues (${clickabilityIssues.length}):\n`
    //             clickabilityIssues.forEach(issue => errorMessage += `   ${issue}\n`)
    //             errorMessage += '\n'
    //         }
            
    //         if (validationIssues.length > 0) {
    //             errorMessage += `🔴 Phone Validation Issues (${validationIssues.length}):\n`
    //             validationIssues.forEach(issue => errorMessage += `   ${issue}\n`)
    //             errorMessage += '\n'
    //         }
            
    //         errorMessage += `📊 Summary: ${mobileHeaderSuccess.length + clickabilitySuccess.length + validationSuccess.length} successful checks, ${allIssues.length} failed checks across all test cases.`
            
    //         // Final assertion - fail if ANY test case had issues
    //         if (allIssues.length > 0) {
    //             cy.log(`🚨 COMPREHENSIVE VALIDATION FAILED: ${allIssues.length} total issue(s) found across all test cases`)
    //             throw new Error(errorMessage)
    //         } else {
    //             cy.log('🎉 COMPREHENSIVE VALIDATION PASSED: All 3 test cases completed successfully!')
    //         }
    //     })
    // })

    // it('🍔 Menu Items should be in text form', () => {
    // let nonStringItems = [] // Array to collect all non-string items
    // let validStringItems = [] // Array to collect valid string items
    // let totalItemsChecked = 0

    // cy.get('header, #site-header').then(($header) => {
    //     if ($header.find('.menu, .site-menu').length > 0) {
    //         cy.log('🔍 Found normal menu, checking menu items...')
            
    //         // If normal menu exists
    //         cy.get('.menu, .site-menu').then(($menus) => {
    //             cy.wrap($menus).each(($menu) => {
    //                 cy.wrap($menu).find('a').each(($item) => {
    //                     const text = $item.text().trim()
    //                     totalItemsChecked++

    //                     if (typeof text !== 'string' || text === '') {
    //                         const errorItem = text || '[Empty Text]'
    //                         nonStringItems.push(errorItem)
    //                         cy.log(`❌ "${errorItem}" is NOT in text form`)
    //                     } else {
    //                         validStringItems.push(text)
    //                         cy.log(`✅ "${text}" is in text form`)
    //                     }
    //                 })
    //             })
    //         })
    //     } else if ($header.find('button[aria-label="Header Burger Button"]').length > 0) {
    //         cy.log('🔍 Found burger menu, checking off-canvas menu items...')
            
    //         // If burger button exists
    //         cy.get('header button[aria-label="Header Burger Button"]').click()

    //         // Wait for off-canvas menu and validate items
    //         cy.get('.offcanvas-navigation', { timeout: 4000 }).should('be.visible').then(($offMenu) => {
    //             if ($offMenu.length > 0) {
    //                 cy.wrap($offMenu).find('a').each(($item) => {
    //                     const text = $item.text().trim() // Fix: Add missing text extraction
    //                     totalItemsChecked++

    //                     if (typeof text !== 'string' || text === '') {
    //                         const errorItem = text || '[Empty Text]'
    //                         nonStringItems.push(errorItem)
    //                         cy.log(`❌ "${errorItem}" is NOT in text form`)
    //                     } else {
    //                         validStringItems.push(text)
    //                         cy.log(`✅ "${text}" is in text form`)
    //                     }
    //                 })
    //             } else {
    //                 cy.log('❌ No off-canvas menu found after clicking burger button')
    //                 throw new Error('No off-canvas menu found after clicking burger button')
    //             }
    //         })
    //     } else {
    //         cy.log('❌ No menu structure found on this page')
    //         throw new Error('No menu structure found on this page')
    //     }
    // }).then(() => {
    //     // Final validation with detailed logging
    //     cy.log('🍔 ========== MENU ITEMS VALIDATION RESULTS ==========')
        
    //     if (nonStringItems.length > 0) {
    //         cy.log('🚨 MENU ITEMS TEST FAILED')
    //         cy.log(`   ❌ ${nonStringItems.length} non-string items found`)
    //         cy.log(`   ✅ ${validStringItems.length} valid string items found`)
    //         cy.log(`   📊 Total items checked: ${totalItemsChecked}`)
            
    //         // Log all problematic items
    //         nonStringItems.forEach(item => cy.log(`   ❌ Invalid item: "${item}"`))
            
    //         // Create detailed error message
    //         let errorMessage = `MENU ITEMS TEST FAILED - Non-string items detected:\n\n`
    //         errorMessage += `🔴 Non-String Items (${nonStringItems.length}):\n`
    //         nonStringItems.forEach(item => errorMessage += `   ❌ "${item}"\n`)
    //         errorMessage += `\n📊 Summary: ${nonStringItems.length} invalid items, ${validStringItems.length} valid items out of ${totalItemsChecked} total items checked.`
            
    //         throw new Error(errorMessage)
    //     } else {
    //         cy.log('🎉 MENU ITEMS TEST PASSED')
    //         cy.log(`   ✅ All ${validStringItems.length} menu items are in proper text form`)
    //         cy.log(`   📊 Total items checked: ${totalItemsChecked}`)
            
    //         // Log sample of valid items
    //         if (validStringItems.length > 0) {
    //             cy.log(`   ✅ Sample valid items: ${validStringItems.slice(0, 3).join(', ')}${validStringItems.length > 3 ? '...' : ''}`)
    //         }
            
    //         expect(true, '✅ All menu items are in proper text form').to.be.true
    //     }
        
    //     cy.log('🍔 =============================================')
    // })
    // })
    
    // it('📏 Fixed header should not exceed 100px by standard', () => {
    // cy.viewport(1920, 1080)
    // cy.wait(3000)
    // cy.scrollTo('bottom').wait(3000)

    // cy.log('📏 ========== FIXED HEADER SIZE VALIDATION ==========')

    // // Check fixed headers directly
    // cy.get('.header.aios-sticky-header.header--fixed, header, .header')
    //     .invoke('outerHeight')
    //     .then((fixedHeight) => {
    //         cy.log(`🔍 Checking Fixed Header height: ${fixedHeight}px`)
    //         cy.log(`📐 Standard limit: 100px`)
    //         cy.log(`📊 Difference: ${fixedHeight - 100}px ${fixedHeight > 100 ? 'over limit' : 'within limit'}`)

    //         // Detailed validation with proper logging
    //         if (fixedHeight > 100) {
    //             cy.log('🚨 FIXED HEADER TEST FAILED')
    //             cy.log(`   ❌ Header height ${fixedHeight}px exceeds 100px limit`)
    //             cy.log(`   ❌ Exceeds limit by: ${fixedHeight - 100}px`)
                
    //             // Create detailed error message
    //             const errorMessage = `FIXED HEADER TEST FAILED - Header too large:\n\n🔴 Header Size Issue:\n   ❌ Current height: ${fixedHeight}px\n   ❌ Maximum allowed: 100px\n   ❌ Exceeds limit by: ${fixedHeight - 100}px\n\n📊 Summary: Fixed header violates size standard by ${((fixedHeight - 100) / 100 * 100).toFixed(1)}%`
                
    //             throw new Error(errorMessage)
    //         } else {
    //             cy.log('🎉 FIXED HEADER TEST PASSED')
    //             cy.log(`   ✅ Header height ${fixedHeight}px is within 100px limit`)
    //             cy.log(`   ✅ Remaining headroom: ${100 - fixedHeight}px`)
                
    //             expect(fixedHeight, `✅ Fixed header is correctly within the 100px limit`).to.be.lte(100)
    //         }
            
    //     })
    
    // });



    });
}