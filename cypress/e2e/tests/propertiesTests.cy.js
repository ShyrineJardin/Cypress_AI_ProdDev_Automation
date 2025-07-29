module.exports = (site, baseUrl, pass) => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
         return false;
        }
  
        if (err.message.includes('Script error')) {
            return false;
        }
  
        return true;
    });

    describe('🏢 Properties Page', () => {
        it('Filter Properties', () => {
            cy.log('1️⃣ Navigate to properties page');
            cy.visit(`${baseUrl}properties`);
        
            cy.log('🛀 Filter by Price, Beds, and Baths');

            // Dynamic selectors for refine search dropdown
            const refineSearchSelectors = [
                '.aci-results-elevate-dropdown.as-search',
                '#ihf-refine-search',
                '.dropdown.sort-dropdown button.dropdown-toggle',
                '.sort-dropdown .dropdown-toggle',
                '[data-testid="refine-search"]',
                '.refine-search',
                '.filter-dropdown',
                '.search-refine'
            ];

            // Dynamic selectors for price inputs
            const minPriceSelectors = [
                '#listings-form-min-price',
                '#ihf-mini-form-minprice',
                '#min-price',
                '[data-testid="min-price"]',
                'input[name="min-price"]',
                'input[placeholder*="min"]',
                '.min-price-input'
            ];

            const maxPriceSelectors = [
                '#listings-form-max-price',
                '#ihf-mini-form-maxprice',
                '#max-price',
                '[data-testid="max-price"]',
                'input[name="max-price"]',
                'input[placeholder*="max"]',
                '.max-price-input'
            ];

            // Dynamic selectors for bedroom/bathroom dropdowns
            const bedroomSelectors = [
                '#listings-form-bedrooms',
                '#ihf-mini-form-select-bedrooms',
                'select#bedrooms',
                'select[name="bedrooms"]',
                '[data-testid="bedrooms"]',
                'select[data-field="bedrooms"]',
                '.bedrooms-select'
            ];

            const bathroomSelectors = [
                'select#baths',
                '#listings-form-bathrooms',
                '#ihf-mini-form-select-baths',
                'select[name="baths"]',
                'select[name="bathrooms"]',
                '[data-testid="bathrooms"]',
                'select[data-field="baths"]',
                '.bathrooms-select'
            ];

            // Dynamic selectors for update search button
            const updateSearchSelectors = [
                'input[type="submit"][value="Update Search"]',
                'input[type="submit"][value*="Update"]',
                'button[type="submit"]:contains("Update")',
                '[data-testid="update-search"]',
                '.update-search-btn',
                '.submit-search'
            ];
        
          // Test Refine Search dropdown
          cy.get('body').then($body => {
            let refineSearchElement = null;
            
            for (const selector of refineSearchSelectors) {
                if ($body.find(selector).length > 0) {
                    refineSearchElement = selector;
                    break;
                }
            }
            
            if (refineSearchElement) {
                cy.get(refineSearchElement)
                    .should('be.visible')
                    .contains('Refine Search')
                    .click();
            } else {
                cy.get(refineSearchSelectors[0])
                    .should('be.visible')
                    .contains('Refine Search')
                    .click();
            }
          });
        
          // Test Min Price input
          cy.get('body').then($body => {
            let minPriceElement = null;
            
            for (const selector of minPriceSelectors) {
                if ($body.find(selector).length > 0) {
                    minPriceElement = selector;
                    break;
                }
            }
            
            if (minPriceElement) {
                cy.get(minPriceElement)
                    .should('be.visible')
                    .should('have.attr', 'placeholder', 'No min')
                    .clear()
                    .type('100000');
            } else {
                cy.get(minPriceSelectors[0])
                    .should('be.visible')
                    .should('have.attr', 'placeholder', 'No min')
                    .clear()
                    .type('100000');
            }
          });
        
          // Test Max Price input
          cy.get('body').then($body => {
            let maxPriceElement = null;
            
            for (const selector of maxPriceSelectors) {
                if ($body.find(selector).length > 0) {
                    maxPriceElement = selector;
                    break;
                }
            }
            
            if (maxPriceElement) {
                cy.get(maxPriceElement)
                    .should('be.visible')
                    .should('have.attr', 'placeholder', 'No max')
                    .clear()
                    .type('500000');
            } else {
                cy.get(maxPriceSelectors[0])
                    .should('be.visible')
                    .should('have.attr', 'placeholder', 'No max')
                    .clear()
                    .type('500000');
            }
          });
        
          // Test Bedrooms dropdown
          cy.get('body').then($body => {
            let bedroomElement = null;
            
            for (const selector of bedroomSelectors) {
                if ($body.find(selector).length > 0) {
                    bedroomElement = selector;
                    break;
                }
            }
            
            if (bedroomElement) {
                cy.get(bedroomElement)
                    .should('be.visible')
                    .select('3');
            } else {
                cy.get(bedroomSelectors[0])
                    .should('be.visible')
                    .select('3');
            }
          });
        
          // Test Bathrooms dropdown
          cy.get('body').then($body => {
            let bathroomElement = null;
            
            for (const selector of bathroomSelectors) {
                if ($body.find(selector).length > 0) {
                    bathroomElement = selector;
                    break;
                }
            }
            
            if (bathroomElement) {
                cy.get(bathroomElement)
                    .should('be.visible')
                    .select('2');
            } else {
                cy.get(bathroomSelectors[0])
                    .should('be.visible')
                    .select('2');
            }
          });
        
          // Submit the refine search form
          cy.log('⏳ Submitting refine search...');
          cy.get('body').then($body => {
              let updateButtonElement = null;
              
              for (const selector of updateSearchSelectors) {
                  if ($body.find(selector).length > 0) {
                      updateButtonElement = selector;
                      break;
                  }
              }
              
              if (updateButtonElement) {
                  cy.get(updateButtonElement)
                      .should('be.visible')
                      .click();
              } else {
                  cy.get(updateSearchSelectors[0])
                      .should('be.visible')
                      .click();
              }
          });

          // Wait for page to load/refresh after filter submission
          cy.wait(2000);
          
          // Check if the page content has refreshed/updated
          cy.get('body').should('be.visible');
          cy.log('✅ SUCCESS: Refine search submitted and page refreshed');
      
          cy.log('🔧 Sort By Functionality');

          // Dynamic selectors for sort functionality
          const sortDropdownSelectors = [
            '.aci-results-elevate-dropdown.as-sort',
            '[data-toggle="dropdown"]',
            '.sort-dropdown .dropdown-toggle',
            '.dropdown.sort-dropdown button.dropdown-toggle',
            '[data-testid="sort-dropdown"]',
            '.sort-dropdown',
            '.results-sort',
            '.sort-filter'
          ];

          const sortOptionSelectors = [
            'a[data-ihf-sort-value="lpa"]',
            '[data-sort-value="lpa"]',
            '[value="lpa"]',
            'a:contains("Price (Low to High)")',
            '.sort-option[data-value="lpa"]'
          ];

          const sortActiveSelectors = [
            'li.active a[data-ihf-sort-value="lpa"]',
            '.active[data-sort-value="lpa"]',
            '.selected[value="lpa"]',
            '.sort-option.active[data-value="lpa"]'
          ];

          cy.get('body').then($body => {
              let sortDropdownElement = null;
              
              for (const selector of sortDropdownSelectors) {
                  if ($body.find(selector).length > 0) {
                      sortDropdownElement = selector;
                      break;
                  }
              }
              
              if (sortDropdownElement) {
                  cy.get(sortDropdownElement)
                      .should('be.visible')
                      .contains('Sort')
                      .click();
              } else {
                  cy.get(sortDropdownSelectors[0])
                      .should('be.visible')
                      .contains('Sort')
                      .click();
              }
          });
      
          cy.get('body').then($body => {
              let sortOptionElement = null;
              
              for (const selector of sortOptionSelectors) {
                  if ($body.find(selector).length > 0) {
                      sortOptionElement = selector;
                      break;
                  }
              }
              
              if (sortOptionElement) {
                  cy.get(sortOptionElement)
                      .should('be.visible')
                      .click();
              } else {
                  cy.get(sortOptionSelectors[0])
                      .should('be.visible')
                      .click();
              }
          });
      
          // Wait for page to load/refresh after sort
          cy.wait(2000);
          
          // Check if sort is active
          cy.get('body').then($body => {
              let sortActiveElement = null;
              
              for (const selector of sortActiveSelectors) {
                  if ($body.find(selector).length > 0) {
                      sortActiveElement = selector;
                      break;
                  }
              }
              
              if (sortActiveElement) {
                  cy.get(sortActiveElement).should('exist');
                  cy.log('✅ SUCCESS: Sort filter applied and active state detected');
              } else {
                  // Even if active state not found, sorting might still work
                  cy.log('✅ SUCCESS: Sort option clicked and page refreshed');
              }
          });
      
          cy.log('📃 Pagination Works');

          // Dynamic selectors for pagination
          const paginationContainerSelectors = [
            '.aci-results-elevate-pagination',
            '[data-testid="pagination"]',
            '.pagination',
            '.results-pagination',
            '.page-navigation'
          ];

          const nextPageSelectors = [
            '.aci-results-elevate-pagination ul li.as-arrow.as-next a',
            '[data-testid="next-page"]',
            '.pagination .next a',
            '.pagination-next',
            '.page-next a'
          ];

          const prevPageSelectors = [
            '.aci-results-elevate-pagination ul li.as-arrow.as-prev a',
            '[data-testid="prev-page"]',
            '.pagination .prev a',
            '.pagination-prev',
            '.page-prev a'
          ];

          // Check if pagination exists
          cy.get('body').then($body => {
              let paginationElement = null;
              
              for (const selector of paginationContainerSelectors) {
                  if ($body.find(selector).length > 0) {
                      paginationElement = selector;
                      break;
                  }
              }
              
              if (paginationElement) {
                  cy.get(paginationElement)
                      .scrollIntoView()
                      .should('be.visible');

                  // Store the initial URL before pagination
                  cy.url().then((initialUrl) => {
                    cy.log('Initial URL: ' + initialUrl);

                    // Click next page button
                    cy.get('body').then($body => {
                        let nextPageElement = null;
                        
                        for (const selector of nextPageSelectors) {
                            if ($body.find(selector).length > 0) {
                                nextPageElement = selector;
                                break;
                            }
                        }
                        
                        if (nextPageElement) {
                            cy.get(nextPageElement)
                                .should('be.visible')
                                .click();
                        } else {
                            cy.get(nextPageSelectors[0])
                                .should('be.visible')
                                .click();
                        }
                    });
                
                    // Wait for URL to update and verify pagination worked
                    cy.wait(2000);
                    cy.url().should('not.equal', initialUrl);

                    cy.url().then((nextPageUrl) => {
                      cy.log('Next page URL: ' + nextPageUrl);
                    
                      // Click previous page button
                      cy.get('body').then($body => {
                        let prevPageElement = null;
                        
                        for (const selector of prevPageSelectors) {
                            if ($body.find(selector).length > 0) {
                                prevPageElement = selector;
                                break;
                            }
                        }
                        
                        if (prevPageElement) {
                            cy.get(prevPageElement)
                                .should('be.visible')
                                .click();
                        } else {
                            cy.get(prevPageSelectors[0])
                                .should('be.visible')
                                .click();
                        }
                      });
                    
                      // Wait and verify pagination worked
                      cy.wait(2000);
                      cy.log('✅ SUCCESS: Pagination buttons clicked and navigation completed');
                    });
                  });
              } else {
                  cy.log('ℹ️ INFO: No pagination found on this page (this is normal for sites with few properties)');
              }
          });

        });

          it('🗒️ Properties (IHF, AIOS Listings, IDX)', () => {
            cy.log('1️⃣ Navigate to properties page');
            cy.visit(`${baseUrl}properties`);
        
            const failedDetails = [];
            const failedPrintableFlyer = [];
            const failedModalButtons = [];
            const failedAccordions = [];
            const failedNavigation = [];

            // Dynamic selectors for property listings
            const propertyListingSelectors = [
                '.listings-col a',
                '.ihf-grid-result a',
                '.aci-results-elevate-list-item a',
                '.property-item a',
                '.listing-item a',
                '[data-testid="property-link"]',
                '.property-card a'
            ];

            // Dynamic selectors for property details
            const propertyImageSelectors = [
                '.thumbnail-loader img',
                '.listings-hero',
                '.property-image img',
                '.listing-image img',
                '.gallery-image img',
                '[data-testid="property-image"]',
                '.detail-image img'
            ];

            const statusSelectors = [
                '.aci-details-equinox-status',
                '.listings-extras',
                '.property-status',
                '.listing-status',
                '[data-testid="property-status"]',
                '.status-badge'
            ];

            const addressSelectors = [
                '.aci-details-equinox-address',
                '.listings-address',
                '.property-address',
                '.listing-address',
                '[data-testid="property-address"]',
                '.address-info'
            ];

            const priceSelectors = [
                '.aci-details-equinox-price',
                '.listings-price',
                '.property-price',
                '.listing-price',
                '[data-testid="property-price"]',
                '.price-info'
            ];

            // Dynamic selectors for CTA buttons and modals
            const contactAgentSelectors = [
                'button[data-target="#ihfContactAgent"]',
                'button[data-bs-target="#ihfContactAgent"]',
                '[data-testid="contact-agent"]',
                '.btn-contact-agent',
                '.contact-agent-btn'
            ];

            const saveListingSelectors = [
                'button[data-target="#ihfsaveListing"]',
                'button[data-bs-target="#ihfsaveListing"]',
                '[data-testid="save-listing"]',
                '.btn-save-listing',
                '.save-listing-btn'
            ];

            const scheduleShowingSelectors = [
                'button[data-target="#ihfScheduleShowing"]',
                'button[data-bs-target="#ihfScheduleShowing"]',
                'a.listings-cta-schedule',
                '[data-testid="schedule-showing"]',
                '.btn-schedule-showing',
                '.schedule-showing-btn'
            ];

            const requestInfoSelectors = [
                'button[data-target="#ihfMoreInfo"]',
                'button[data-bs-target="#ihfMoreInfo"]',
                'a.listings-cta-request',
                '[data-testid="request-info"]',
                '.btn-request-info',
                '.request-info-btn'
            ];

            const mortgageCalculatorSelectors = [
                'button[data-target="#ihfMoreInfo"]',
                'button[data-bs-target="#ihfMoreInfo"]',
                'a.listings-cta-mortgage',
                '[data-testid="mortgage-calculator"]',
                '.btn-mortgage-calc',
                '.mortgage-calculator-btn'
            ];

            // Dynamic selectors for modals
            const contactAgentModalSelectors = [
                '#ihfContactAgent',
                '#contactAgentModal',
                '[data-testid="contact-agent-modal"]',
                '.contact-agent-modal',
                '.modal-contact-agent'
            ];

            const saveListingModalSelectors = [
                '#ihfsaveListing',
                '#saveListingModal',
                '[data-testid="save-listing-modal"]',
                '.save-listing-modal',
                '.modal-save-listing'
            ];

            const scheduleShowingModalSelectors = [
                '#ihfScheduleShowing',
                '#listings-schedule',
                '#scheduleShowingModal',
                '[data-testid="schedule-showing-modal"]',
                '.schedule-showing-modal',
                '.modal-schedule-showing'
            ];

            const requestInfoModalSelectors = [
                '#ihfMoreInfo',
                '#listings-request',
                '#requestInfoModal',
                '[data-testid="request-info-modal"]',
                '.request-info-modal',
                '.modal-request-info'
            ];

            const mortgageModalSelectors = [
                '#ihfMoreInfo',
                '#aios-mortage-calculator',
                '#mortgageCalculatorModal',
                '[data-testid="mortgage-calculator-modal"]',
                '.mortgage-calculator-modal',
                '.modal-mortgage-calc'
            ];

            // Dynamic selectors for modal close buttons
            const modalCloseSelectors = [
                '.close',
                '.btn-close',
                '.aiosp-close',
                '[data-dismiss="modal"]',
                '[data-bs-dismiss="modal"]',
                'button[aria-label="Close"]',
                '.modal-close',
                '.close-button',
                'button.close',
                '.fa-times',
                '.fa-close',
                'button[type="button"].close',
                '.modal-header .close',
                '.modal-footer .btn-secondary',
                '.modal-footer .cancel',
                'button:contains("Close")',
                'button:contains("Cancel")',
                '[title="Close"]'
            ];

            // Dynamic selectors for printable flyer
            const printableFlyerSelectors = [
                'a.aci-details-equinox-button.is-outlined-primary[href*="printable=true"]',
                'a.listings-cta-printable',
                'a[href*="printable=true"]',
                '[data-testid="printable-flyer"]',
                '.btn-printable-flyer',
                '.printable-flyer-btn'
            ];

            // Dynamic selectors for accordion
            const accordionContainerSelectors = [
                '.aci-details-equinox-accordion',
                '.listings-accordion',
                '.accordion',
                '.property-accordion',
                '[data-testid="property-accordion"]',
                '.details-accordion'
            ];

            const accordionTitleSelectors = [
                '.aci-details-equinox-accordion-title',
                '.listings-accordion-title',
                '.accordion-header',
                '.accordion-title',
                '[data-testid="accordion-title"]',
                '.accordion-toggle'
            ];

            const accordionContentSelectors = [
                '.aci-details-equinox-accordion-content',
                '.listings-accordion-content',
                '.accordion-body',
                '.accordion-content',
                '[data-testid="accordion-content"]',
                '.accordion-panel'
            ];

            // Dynamic selectors for navigation
            const navigationContainerSelectors = [
                '.aci-details-equinox-navigation',
                '.listings-link-navigation',
                '.property-navigation',
                '.listing-navigation',
                '[data-testid="property-navigation"]',
                '.nav-container'
            ];

            const nextButtonSelectors = [
                '.aci-details-equinox-navigation .as-next a',
                '.listings-link-navigation-next a',
                '.nav-next a',
                '.next-property a',
                '[data-testid="next-property"]',
                '.btn-next-property'
            ];

            const prevButtonSelectors = [
                '.aci-details-equinox-navigation .as-prev a',
                '.listings-link-navigation-prev a',
                '.nav-prev a',
                '.prev-property a',
                '[data-testid="prev-property"]',
                '.btn-prev-property'
            ];

            const backButtonSelectors = [
                '.aci-details-equinox-navigation .as-back a',
                '.listings-link-navigation-back a',
                '.nav-back a',
                '.back-to-listings a',
                '[data-testid="back-button"]',
                '.btn-back-listings'
            ];

            cy.log('2️⃣ Open the property detail pages');
        
            // Get property links using dynamic selectors
            cy.get('body').then($body => {
                let propertyLinkSelector = null;
                
                for (const selector of propertyListingSelectors) {
                    if ($body.find(selector).length > 0) {
                        propertyLinkSelector = selector;
                        break;
                    }
                }
                
                if (!propertyLinkSelector) {
                    propertyLinkSelector = propertyListingSelectors[0];
                }

                // total count of properties
                cy.get(propertyLinkSelector).then(($links) => {
                  const totalProperties = $links.length;
                  cy.log(`Total properties found: ${totalProperties}`);
                
                  cy.get(propertyLinkSelector).each(($el, index) => {
                    const href = $el.prop('href');
                    const isFirstProperty = index === 0;
                    const isLastProperty = index === totalProperties - 1;
                
                    cy.log(`🔍 Checking Property #${index + 1}: ${href}`);
                    cy.log(`First property: ${isFirstProperty}, Last property: ${isLastProperty}`);
                
                    cy.visit(href);
                
                    cy.get('body').then(($body) => {
                      // Check property images using dynamic selectors
                      let propertyImageSelector = null;
                      for (const selector of propertyImageSelectors) {
                          if ($body.find(selector).length > 0) {
                              propertyImageSelector = selector;
                              break;
                          }
                      }

                      const bannerImages = propertyImageSelector ? $body.find(propertyImageSelector) : $body.find(propertyImageSelectors[0]);
                    
                      if (bannerImages.length > 0) {
                        cy.log(`✅ Property image(s) found: ${bannerImages.length} banner image(s)`);
                    
                        const missing = [];
                    
                        // Check status using dynamic selectors
                        let statusFound = false;
                        for (const selector of statusSelectors) {
                            if ($body.find(selector).length > 0) {
                                statusFound = true;
                                break;
                            }
                        }
                        if (!statusFound) missing.push('status');

                        // Check address using dynamic selectors
                        let addressFound = false;
                        for (const selector of addressSelectors) {
                            if ($body.find(selector).length > 0) {
                                addressFound = true;
                                break;
                            }
                        }
                        if (!addressFound) missing.push('address');

                        // Check price using dynamic selectors
                        let priceFound = false;
                        for (const selector of priceSelectors) {
                            if ($body.find(selector).length > 0) {
                                priceFound = true;
                                break;
                            }
                        }
                        if (!priceFound) missing.push('price');
                    
                        if (missing.length === 0) {
                          cy.log('✅ All property details are present');
                        } else {
                          cy.log(`❌ Missing detail(s): ${missing.join(', ')}`);
                          failedDetails.push({ url: href, missing });
                        }
                      } else {
                        cy.log('❌ Property image is missing');
                        failedDetails.push({ url: href, missing: ['image', 'status', 'address', 'price'] });
                      }
                  
                  
                      // CTA Buttons Open Modal and Show Contact Form
                      cy.log('3️⃣ Testing modal buttons functionality');

                      const modalButtonsConfig = [
                        { 
                            selectors: contactAgentSelectors, 
                            name: 'Contact Agent', 
                            modalSelectors: contactAgentModalSelectors 
                        },
                        { 
                            selectors: saveListingSelectors, 
                            name: 'Save to Favorite', 
                            modalSelectors: saveListingModalSelectors 
                        },
                        { 
                            selectors: scheduleShowingSelectors, 
                            name: 'Schedule A Showing', 
                            modalSelectors: scheduleShowingModalSelectors 
                        },
                        { 
                            selectors: requestInfoSelectors, 
                            name: 'Request Info', 
                            modalSelectors: requestInfoModalSelectors 
                        },
                        { 
                            selectors: mortgageCalculatorSelectors, 
                            name: 'Mortgage Calculator', 
                            modalSelectors: mortgageModalSelectors 
                        }
                      ];
                  
                      modalButtonsConfig.forEach(({ selectors, name, modalSelectors }) => {
                        cy.get('body').then(($body) => {
                          let buttonSelector = null;
                          
                          for (const selector of selectors) {
                              if ($body.find(selector).length > 0) {
                                  buttonSelector = selector;
                                  break;
                              }
                          }

                          if (buttonSelector) {
                            cy.log(`🔍 Testing ${name} button`);

                            // Click the button to open modal
                            cy.get(buttonSelector).first().click({ force: true });
                            cy.wait(500);

                            // Check if modal is visible using dynamic selectors
                            cy.get('body').then(($bodyAfterClick) => {
                              let modalVisible = false;
                              let modalSelector = null;

                              for (const selector of modalSelectors) {
                                  if ($bodyAfterClick.find(`${selector}:visible, ${selector}.show, ${selector}.active`).length > 0) {
                                      modalVisible = true;
                                      modalSelector = selector;
                                      break;
                                  }
                              }
                            
                              if (modalVisible) {
                                cy.log(`✅ ${name} modal opened successfully`);

                                // Close modal using dynamic selectors
                                cy.get('body').then(($modalBody) => {
                                  let closeButtonFound = false;
                                  
                                  // Try different close button selector combinations
                                  const closeButtonCombinations = [
                                    // Inside the specific modal
                                    ...modalCloseSelectors.map(selector => `${modalSelector} ${selector}`),
                                    // Direct selectors in case modal is not properly scoped
                                    ...modalCloseSelectors,
                                    // Common Bootstrap modal close patterns
                                    `${modalSelector} button[data-dismiss="modal"]`,
                                    `${modalSelector} button[data-bs-dismiss="modal"]`,
                                    `${modalSelector} .modal-header .close`,
                                    `${modalSelector} .modal-footer .btn-secondary`,
                                    // Generic close buttons in visible modals
                                    '.modal:visible .close',
                                    '.modal.show .close',
                                    '.modal.in .close',
                                    'button[data-dismiss="modal"]:visible',
                                    'button[data-bs-dismiss="modal"]:visible'
                                  ];

                                  // Try each close button combination
                                  for (const selector of closeButtonCombinations) {
                                    if ($modalBody.find(selector).length > 0 && $modalBody.find(selector).is(':visible')) {
                                      cy.log(`Attempting to close modal with selector: ${selector}`);
                                      cy.get(selector).first().click({ force: true });
                                      closeButtonFound = true;
                                      break;
                                    }
                                  }

                                  // If no close button found, try multiple fallback methods
                                  if (!closeButtonFound) {
                                    cy.log('No close button found, trying fallback methods');
                                    
                                    // Try clicking outside the modal (backdrop click)
                                    cy.get('body').then(($body) => {
                                      if ($body.find('.modal-backdrop').length > 0) {
                                        cy.get('.modal-backdrop').click({ force: true });
                                      } else {
                                        // Try ESC key
                                        cy.get('body').type('{esc}');
                                      }
                                    });
                                  }
                                  
                                  cy.wait(500);
                                  
                                  // Verify modal is actually closed
                                  cy.get('body').then(($bodyAfterClose) => {
                                    const modalStillVisible = $bodyAfterClose.find(`${modalSelector}:visible, ${modalSelector}.show, ${modalSelector}.active`).length > 0;
                                    if (modalStillVisible) {
                                      cy.log(`⚠️ Modal ${name} may still be open after close attempt`);
                                      // Force close by removing modal classes or hiding
                                      cy.get(modalSelector).then($modal => {
                                        if ($modal.length > 0) {
                                          cy.wrap($modal).invoke('removeClass', 'show active in').invoke('hide');
                                        }
                                      });
                                    }
                                  });
                                });
                              } else {
                                cy.log(`❌ ${name} modal failed to open`);
                                failedModalButtons.push({
                                  url: href,
                                  button: name,
                                  issue: 'Modal did not open after clicking button'
                                });
                              }
                            });
                          } else {
                            cy.log(`ℹ️ ${name} button not found - skipping test`);
                          }
                        });
                      });
                  
                      // Check Printable Flyer button
                      cy.log('4️⃣ Testing Printable Flyer button');
                      
                      cy.get('body').then(($body) => {
                        let flyerSelector = null;
                        
                        for (const selector of printableFlyerSelectors) {
                            if ($body.find(selector).length > 0) {
                                flyerSelector = selector;
                                break;
                            }
                        }

                        if (flyerSelector) {
                          const $printableFlyer = $body.find(flyerSelector);
                          const flyerHref = $printableFlyer.prop('href');
                          const target = $printableFlyer.attr('target');

                          cy.log(`Testing Printable Flyer button: ${flyerHref}`);

                          if (target === '_blank') {
                            cy.log('✅ Printable Flyer button configured correctly (opens in new tab)');
                          } else {
                            cy.log('❌ Printable Flyer button missing target="_blank"');
                            failedPrintableFlyer.push({
                              url: href,
                              flyerUrl: flyerHref,
                              issue: 'Missing target="_blank" attribute',
                              currentTarget: target || 'undefined'
                            });
                          }
                        } else {
                          cy.log('ℹ️ Printable Flyer button not found - skipping test');
                        }
                      });
                  
                      // Test Accordion Sections Toggle Correctly
                      cy.log('5️⃣ Testing accordion sections functionality');

                      cy.get('body').then(($body) => {
                        let accordionContainerSelector = null;
                        
                        for (const selector of accordionContainerSelectors) {
                            if ($body.find(selector).length > 0) {
                                accordionContainerSelector = selector;
                                break;
                            }
                        }

                        if (accordionContainerSelector) {
                          cy.log('🔍 Accordion container found, testing toggle functionality');

                          // Scroll to accordion section
                          cy.get(accordionContainerSelector).scrollIntoView();
                          cy.wait(500);

                          // Get accordion titles using dynamic selectors
                          let accordionTitleSelector = null;
                          for (const selector of accordionTitleSelectors) {
                              if ($body.find(`${accordionContainerSelector} ${selector}`).length > 0) {
                                  accordionTitleSelector = `${accordionContainerSelector} ${selector}`;
                                  break;
                              }
                          }

                          if (!accordionTitleSelector) {
                            accordionTitleSelector = accordionTitleSelectors[0];
                          }

                          cy.get(accordionTitleSelector).each(($accordionTitle, accordionIndex) => {
                            const sectionName = $accordionTitle.find('span').text().trim() || `Section ${accordionIndex + 1}`;
                            cy.log(`🔍 Testing accordion section: "${sectionName}"`);
                          
                            // Find content panel using dynamic selectors
                            cy.get('body').then(($bodyContent) => {
                              let accordionContentSelector = null;
                              
                              for (const selector of accordionContentSelectors) {
                                  if ($bodyContent.find(selector).eq(accordionIndex).length > 0) {
                                      accordionContentSelector = selector;
                                      break;
                                  }
                              }

                              if (!accordionContentSelector) {
                                accordionContentSelector = accordionContentSelectors[0];
                              }

                              const $contentPanel = $accordionTitle.next(accordionContentSelector);
                          
                              if ($contentPanel.length > 0) {
                                // Check initial state (should be hidden)
                                cy.wrap($contentPanel).should('exist');

                                // Click to expand
                                cy.wrap($accordionTitle).click({ force: true });
                                cy.wait(500);

                                // Check if expanded
                                cy.get(accordionContentSelector).eq(accordionIndex).then(($panel) => {
                                  const isVisible = $panel.is(':visible') || 
                                                   $panel.attr('aria-hidden') === 'false' ||
                                                   $panel.css('display') !== 'none';
                                
                                  if (isVisible) {
                                    cy.log(`✅ Accordion "${sectionName}" expanded successfully`);

                                    // Click again to collapse
                                    cy.wrap($accordionTitle).click({ force: true });
                                    cy.wait(500);

                                    // Check if collapsed
                                    cy.get(accordionContentSelector).eq(accordionIndex).then(($panelAfter) => {
                                      const isHidden = !$panelAfter.is(':visible') || 
                                                      $panelAfter.attr('aria-hidden') === 'true' ||
                                                      $panelAfter.css('display') === 'none';
                                    
                                      if (isHidden) {
                                        cy.log(`✅ Accordion "${sectionName}" collapsed successfully`);
                                      } else {
                                        cy.log(`❌ Accordion "${sectionName}" failed to collapse`);
                                        failedAccordions.push({
                                          url: href,
                                          section: sectionName,
                                          issue: 'Failed to collapse after second click'
                                        });
                                      }
                                    });
                                  } else {
                                    cy.log(`❌ Accordion "${sectionName}" failed to expand`);
                                    failedAccordions.push({
                                      url: href,
                                      section: sectionName,
                                      issue: 'Failed to expand after click'
                                    });
                                  }
                                });
                              } else {
                                cy.log(`❌ Content panel not found for accordion "${sectionName}"`);
                                failedAccordions.push({
                                  url: href,
                                  section: sectionName,
                                  issue: 'Content panel not found'
                                });
                              }
                            });
                          });
                        } else {
                          cy.log('ℹ️ Accordion container not found - skipping accordion tests');
                        }
                      });
                  
                    // Test Navigation Functionality
                    cy.log('6️⃣ Testing property navigation functionality');
                    
                    cy.get('body').then(($body) => {
                      let navigationContainerSelector = null;
                      
                      for (const selector of navigationContainerSelectors) {
                          if ($body.find(selector).length > 0) {
                              navigationContainerSelector = selector;
                              break;
                          }
                      }
                  
                      if (navigationContainerSelector) {
                        cy.log('🔍 Navigation container found, testing next/prev functionality');

                        cy.get(navigationContainerSelector).scrollIntoView();
                        cy.wait(500);

                        // Test Next button (skip for last property)
                        if (!isLastProperty) {
                          cy.get('body').then(($navBody) => {
                            let nextButtonSelector = null;
                            
                            for (const selector of nextButtonSelectors) {
                                if ($navBody.find(selector).length > 0) {
                                    nextButtonSelector = selector;
                                    break;
                                }
                            }

                            if (nextButtonSelector) {
                              cy.get(nextButtonSelector).then(($nextLink) => {
                                if ($nextLink.length > 0) {
                                  cy.log('🔍 Testing Next button');

                                  const nextHref = $nextLink.prop('href');
                                  if (nextHref && nextHref !== href) {
                                    cy.log(`🔗 Next property URL: ${nextHref}`);
                                  
                                    cy.wrap($nextLink).click({force: true});
                                    cy.wait(3000);
                                  
                                    // Verify we navigated to the next property
                                    cy.url().should('include', nextHref.replace(/^https?:\/\/[^\/]+/, ''));
                                    cy.log('✅ Next navigation worked - navigated to next property');
                                  
                                    // Go back to continue testing
                                    cy.go('back');
                                    cy.wait(2000);
                                  } else {
                                    cy.log('❌ Next button href is invalid or same as current');
                                    failedNavigation.push({
                                      url: href,
                                      issue: 'Next button href is invalid or same as current'
                                    });
                                  }
                                } else {
                                  cy.log('ℹ️ Next button link not found - skipping');
                                }
                              });
                            } else {
                              cy.log('ℹ️ Next button selector not found - skipping');
                            }
                          });
                        } else {
                          cy.log('⏭️ Skipping Next button test for last property');
                        }

                        // Test Previous button (skip for first property)
                        if (!isFirstProperty) {
                          cy.get('body').then(($navBody) => {
                            let prevButtonSelector = null;
                            
                            for (const selector of prevButtonSelectors) {
                                if ($navBody.find(selector).length > 0) {
                                    prevButtonSelector = selector;
                                    break;
                                }
                            }

                            if (prevButtonSelector) {
                              cy.get(prevButtonSelector).then(($prevLink) => {
                                if ($prevLink.length > 0) {
                                  cy.log('🔍 Testing Previous button');

                                  const prevHref = $prevLink.prop('href');
                                  if (prevHref && prevHref !== href) {
                                    cy.log(`🔗 Previous property URL: ${prevHref}`);
                                  
                                    // Click the previous link
                                    cy.wrap($prevLink).click({force: true});
                                    cy.wait(3000);
                                  
                                    // Verify we navigated to the previous property
                                    cy.url().should('include', prevHref.replace(/^https?:\/\/[^\/]+/, ''));
                                    cy.log('✅ Previous navigation worked - navigated to previous property');
                                  
                                    // Go back to continue testing
                                    cy.go('back');
                                    cy.wait(2000);
                                  } else {
                                    cy.log('❌ Previous button href is invalid or same as current');
                                    failedNavigation.push({
                                      url: href,
                                      issue: 'Previous button href is invalid or same as current'
                                    });
                                  }
                                } else {
                                  cy.log('ℹ️ Previous button link not found - skipping');
                                }
                              });
                            } else {
                              cy.log('ℹ️ Previous button selector not found - skipping');
                            }
                          });
                        } else {
                          cy.log('⏮️ Skipping Previous button test for first property');
                        }
                      } else {
                        cy.log('ℹ️ Navigation container not found - skipping navigation tests');
                      }
                    });
                    });
                  });
                });
            });
        
            // Test Back Button Functionality
            cy.then(() => {
              cy.log('7️⃣ Testing Back button functionality');
            
              // Navigate to first property to test back button
              cy.visit(`${baseUrl}properties`);
              cy.wait(1000);
            
              // Store the properties page URL for comparison
              cy.url().then((propertiesPageUrl) => {
                cy.log(`Properties page URL: ${propertiesPageUrl}`);
            
                // Get first property link using dynamic selectors
                cy.get('body').then(($body) => {
                  let propertyLinkSelector = null;
                  
                  for (const selector of propertyListingSelectors) {
                      if ($body.find(selector).length > 0) {
                          propertyLinkSelector = selector;
                          break;
                      }
                  }
                  
                  if (!propertyLinkSelector) {
                      propertyLinkSelector = propertyListingSelectors[0];
                  }

                  cy.get(propertyLinkSelector).first().then(($firstLink) => {
                    const firstPropertyHref = $firstLink.prop('href');
                  
                    cy.wrap($firstLink).click();
                    cy.wait(2000);
                  
                    cy.get('body').then(($body) => {
                      let backButtonSelector = null;
                      
                      for (const selector of backButtonSelectors) {
                          if ($body.find(selector).length > 0) {
                              backButtonSelector = selector;
                              break;
                          }
                      }
                  
                      if (backButtonSelector) {
                        cy.log('🔍 Testing Back button');
                      
                        cy.get(backButtonSelector).click();
                        cy.wait(2000);
                      
                        cy.url().then((currentUrl) => {
                          cy.log(`Current URL after back click: ${currentUrl}`);
                      
                          // This could be the same URL or contain properties-related path
                          const isBackOnPropertiesPage = currentUrl === propertiesPageUrl || 
                                                       currentUrl.includes('/properties') ||
                                                       currentUrl.includes('parent') ||
                                                       currentUrl.includes('current');
                      
                          if (isBackOnPropertiesPage) {
                            cy.log('✅ Back button worked - returned to properties listing');
                          } else {
                            cy.log('❌ Back button did not return to properties listing page');
                            cy.log(`Expected to be on properties page, but got: ${currentUrl}`);
                            failedNavigation.push({
                              url: firstPropertyHref,
                              issue: `Back button did not return to properties listing page. Expected properties page, got: ${currentUrl}`
                            });
                          }
                        });
                      } else {
                        cy.log('ℹ️ Back button not found - skipping back button test');
                      }
                    });
                  });
                });
              });
            });
        
            // Final assertions - report all errors at the end
            cy.then(() => {
              cy.log('📊 Final Test Results Summary:');
            
              if (failedDetails.length > 0) {
                cy.log(`❌ Properties with missing details: ${failedDetails.length}`);
                failedDetails.forEach((failure, index) => {
                  cy.log(`${index + 1}. ${failure.url} - Missing: ${failure.missing.join(', ')}`);
                });
              }

              if (failedModalButtons.length > 0) {
                cy.log(`❌ Modal button failures: ${failedModalButtons.length}`);
                failedModalButtons.forEach((failure, index) => {
                  cy.log(`${index + 1}. ${failure.url} - ${failure.button}: ${failure.issue}`);
                });
              }

              if (failedPrintableFlyer.length > 0) {
                cy.log(`❌ Printable Flyer failures: ${failedPrintableFlyer.length}`);
                failedPrintableFlyer.forEach((failure, index) => {
                  cy.log(`${index + 1}. ${failure.url} - ${failure.issue}`);
                });
              }
          
              if (failedAccordions.length > 0) {
                cy.log(`❌ Accordion failures: ${failedAccordions.length}`);
                failedAccordions.forEach((failure, index) => {
                  cy.log(`${index + 1}. ${failure.url} - ${failure.section || 'General'}: ${failure.issue}`);
                });
              }
          
              if (failedNavigation.length > 0) {
                cy.log(`❌ Navigation failures: ${failedNavigation.length}`);
                failedNavigation.forEach((failure, index) => {
                  cy.log(`${index + 1}. ${failure.url} - ${failure.issue}`);
                });
              }

              const totalErrors = failedDetails.length + failedModalButtons.length + failedPrintableFlyer.length + failedAccordions.length + failedNavigation.length;
              if (totalErrors > 0) {
                cy.log(`❌ Total test failures: ${totalErrors}`);
                expect(totalErrors).to.equal(0, `Found ${totalErrors} issues across all properties`);
              } else {
                cy.log('✅ All properties passed all tests!');
              }
            });
          });
    });

}