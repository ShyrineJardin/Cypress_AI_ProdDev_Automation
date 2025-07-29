module.exports = (site, baseUrl, pass) => {
    const { url } = require("inspector");

    // Define selector arrays for better maintainability
    const selectors = {
        testimonialsList: [
            '.aiosTestimonialsEquinox__list a',
            '.aios-testimonials-lists a',
            '.testimonials-list a',
            '.testimonial-item a'
        ],
        reviewerName: [
            '.aiosTestimonialsEquinox__content h3',
            '.aios-testimonials-lists h3',
            '.testimonial-content h3',
            '.review-name h3',
            'h3.reviewer-name',
            '.aios-testimonials-popup h2'
        ],
        reviewText: [
            '.aiosTestimonialsEquinox__content--text',
            '.aios-testimonials-content ',
            '.testimonial-content--text',
            '.review-text',
            '.testimonial-text'
        ],
        starRating: [
            '.star_rating_display',
            '.star-rating',
            '.rating-stars',
            '.review-rating'
        ],
        modalContent: [
            '.aiosp-content.aios-popup-body',
            '.aios-popup-body',
            '.modal-content',
            '.popup-content',
            '.testimonial-modal'
        ],
        modalReviewText: [
            '.aiosTestimonialsEquinox__content--text p',
            '.aios-testimonials-popup-content',
            '.testimonial-content--text p',
            '.review-text p',
            '.modal-review-text p'
        ],
        modalCloseButton: [
            'button.aiosp-close[title="Close"]',
            'button.modal-close',
            '.close-button',
            'button[aria-label="Close"]'
        ],
        pagination: [
            '.ai-testimonials-pagination',
            '.testimonials-pagination',
            '.pagination-wrapper'
        ],
        paginationContainer: [
            '.ai-testimonials-pagination ul',
            '.testimonials-pagination ul',
            '.pagination ul'
        ],
        nextButton: [
            'li a.next.page-numbers',
            'li a.next',
            '.next-page',
            'a.page-next'
        ],
        prevButton: [
            'li a.prev.page-numbers',
            'li a.prev',
            '.prev-page',
            'a.page-prev'
        ]
    };

    // Helper function to find working selector
    function findWorkingSelector(selectorArray, context = 'body') {
        return cy.get(context).then(($body) => {
            for (let selector of selectorArray) {
                if ($body.find(selector).length > 0) {
                    return selector;
                }
            }
            return selectorArray[0]; // fallback to first selector
        });
    }

    // Helper function to check if any selector exists
    function checkElementExists(selectorArray, context = 'body') {
        return cy.get(context).then(($body) => {
            for (let selector of selectorArray) {
                if ($body.find(selector).length > 0) {
                    return true;
                }
            }
            return false;
        });
    }

    describe('🗣️ Testimonial Page', () => {
        

        it('🗣️ Checks Testimonial Page', () => {
            cy.log('1️⃣ Navigate to the Testimonials page');
            cy.visit(`${baseUrl}testimonials`);
        
            cy.log('🗣️ Testimonials Section Is Present');
            const failedReview = [];
            let currentPage = 1;
            let hasNextPage = true;
        
            function checkTestimonialsOnCurrentPage() {
                
                // Find working testimonials list selector
                return findWorkingSelector(selectors.testimonialsList).then((testimonialsSelector) => {
                    return cy.get(testimonialsSelector).then(($links) => {
                        const totalTestimonials = $links.length;
                        cy.log(`Page ${currentPage} - Total testimonials found: ${totalTestimonials}`);
                    
                        return cy.get(testimonialsSelector).each(($el, index) => {
                            const href = $el.prop('href');

                            cy.log(`🔎 Checking Testimony #${index + 1}: ${href}`);
                            cy.visit(href);
                        
                            return cy.get('body').then(($body) => {
                                const missing = [];
                            
                                // Check for reviewer name using selector array
                                let nameFound = false;
                                for (let selector of selectors.reviewerName) {
                                    if ($body.find(selector).length > 0) {
                                        nameFound = true;
                                        break;
                                    }
                                }
                                if (!nameFound) missing.push('name');

                                // Check for review text using selector array
                                let textFound = false;
                                for (let selector of selectors.reviewText) {
                                    if ($body.find(selector).length > 0) {
                                        textFound = true;
                                        break;
                                    }
                                }
                                if (!textFound) missing.push('text');

                                // Check for star rating using selector array
                                let ratingFound = false;
                                for (let selector of selectors.starRating) {
                                    if ($body.find(selector).length > 0) {
                                        ratingFound = true;
                                        break;
                                    }
                                }
                                if (!ratingFound) missing.push('rate');
                            
                                if (missing.length === 0) {
                                    cy.log('✅ All details are present');
                                } else {
                                    cy.log(`❌ Missing detail(s): ${missing.join(', ')}`);
                                    failedReview.push({url: href, missing});
                                }
                            }).then(() => {
                        
                                // Go back to testimonials page to test modal
                                cy.visit(`${baseUrl}testimonials`);

                                if (currentPage > 1) {
                                    // Navigate back to current page
                                    return findWorkingSelector(selectors.paginationContainer).then((paginationContainerSelector) => {
                                        return findWorkingSelector(selectors.nextButton).then((nextButtonSelector) => {
                                            for (let i = 1; i < currentPage; i++) {
                                                cy.get(paginationContainerSelector)
                                                    .find(nextButtonSelector)
                                                    .should('be.visible')
                                                    .click();
                                            }
                                        });
                                    });
                                }
                            }).then(() => {
                        
                                cy.log('📄 Clicking Review Opens Modal');

                                // Click on the current testimonial to test modal
                                return findWorkingSelector(selectors.testimonialsList).then((testimonialsSelector) => {
                                    return cy.get(testimonialsSelector).eq(index).then(($testimonial) => {
                                        const testimonialTitle = $testimonial.text().trim();
                                        cy.log(`🔍 Clicking on testimonial: "${testimonialTitle}"`);

                                        cy.wrap($testimonial).click();
                                    
                                        // Find working modal selector
                                        return findWorkingSelector(selectors.modalContent).then((modalSelector) => {
                                            // Check if modal/popup appears
                                            cy.get(modalSelector).should('be.visible');
                                        
                                            return cy.get(modalSelector).should('be.visible').then(($modal) => {
                                                cy.log('✅ Modal opened successfully');

                                                const modalContent = [];

                                                // Check modal reviewer name
                                                let modalNameFound = false;
                                                for (let selector of selectors.reviewerName) {
                                                    if ($modal.find(selector).length > 0) {
                                                        modalNameFound = true;
                                                        break;
                                                    }
                                                }
                                                if (!modalNameFound) {
                                                    modalContent.push('reviewer name');
                                                }

                                                // Check modal review text
                                                let modalTextFound = false;
                                                for (let selector of selectors.modalReviewText) {
                                                    if ($modal.find(selector).length > 0) {
                                                        modalTextFound = true;
                                                        break;
                                                    }
                                                }
                                                if (!modalTextFound) {
                                                    modalContent.push('review text');
                                                }

                                                // Check modal rating
                                                let modalRatingFound = false;
                                                for (let selector of selectors.starRating) {
                                                    if ($modal.find(selector).length > 0) {
                                                        modalRatingFound = true;
                                                        break;
                                                    }
                                                }
                                                if (!modalRatingFound) {
                                                    modalContent.push('rating');
                                                }

                                                if (modalContent.length === 0) {
                                                    cy.log('✅ Modal contains all required review details');
                                                } else {
                                                    cy.log(`❌ Modal missing: ${modalContent.join(', ')}`);
                                                    throw new Error(`Modal missing required content: ${modalContent.join(', ')}`);
                                                }
                                            }).then(() => {
                                            
                                                // Find working close button selector
                                                return findWorkingSelector(selectors.modalCloseButton, modalSelector).then((closeButtonSelector) => {
                                                    cy.get(modalSelector).within(() => {
                                                        cy.get(closeButtonSelector).should('be.visible').click();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        
            function checkPagination() {
                // Check if pagination exists first
                return checkElementExists(selectors.pagination).then((paginationExists) => {
                    if (!paginationExists) {
                        cy.log('📃 No pagination found - Single page testimonials');
                        return Promise.resolve();
                    }

                    // Find working pagination selector
                    return findWorkingSelector(selectors.pagination).then((paginationSelector) => {
                        // Check if pagination is visible
                        return cy.get('body').then(($body) => {
                            const $pagination = $body.find(paginationSelector);
                            if ($pagination.length === 0 || !$pagination.is(':visible')) {
                                cy.log('📃 Pagination not visible - Single page testimonials');
                                return Promise.resolve();
                            }

                            // Check if pagination has meaningful height (not collapsed)
                            const paginationHeight = $pagination.height();
                            if (paginationHeight <= 0) {
                                cy.log('📃 Pagination collapsed (height: 0) - Single page testimonials');
                                return Promise.resolve();
                            }

                            cy.get(paginationSelector).scrollIntoView();

                            // Find working pagination container selector
                            return findWorkingSelector(selectors.paginationContainer).then((paginationContainerSelector) => {
                                return cy.get(paginationContainerSelector).then(($paginationContainer) => {
                                    // Check for working next button selector
                                    let nextButtonFound = false;
                                    let nextButtonSelector = null;
                                    for (let selector of selectors.nextButton) {
                                        if ($paginationContainer.find(selector).length > 0) {
                                            nextButtonFound = true;
                                            nextButtonSelector = selector;
                                            break;
                                        }
                                    }

                                    if (nextButtonFound) {
                                        cy.log('📃 Next Page Available - Moving to next page');

                                        return cy.url().then((initialUrl) => {
                                            cy.log('Current Page URL: ' + initialUrl);
                                        
                                            // Next button
                                            cy.get(paginationContainerSelector)
                                                .find(nextButtonSelector)
                                                .should('be.visible')
                                                .click();
                                        
                                            cy.url().should('not.equal', initialUrl);
                                        
                                            return cy.url().then((nextPageUrl) => {
                                                cy.log('Next page URL: ' + nextPageUrl);
                                                currentPage++;

                                                return checkTestimonialsOnCurrentPage().then(() => {
                                                    return checkPagination();
                                                });
                                            });
                                        });
                                    } else {
                                        cy.log('📃 No more pages - Testing prev button to go back to first page');
                                        hasNextPage = false;

                                        // Test prev button to go back to first page
                                        if (currentPage > 1) {
                                            // Find working prev button selector
                                            let prevButtonSelector = null;
                                            for (let selector of selectors.prevButton) {
                                                if ($paginationContainer.find(selector).length > 0) {
                                                    prevButtonSelector = selector;
                                                    break;
                                                }
                                            }
                                            if (!prevButtonSelector) {
                                                prevButtonSelector = selectors.prevButton[0];
                                            }

                                            cy.get(paginationContainerSelector)
                                                .find(prevButtonSelector)
                                                .should('be.visible')
                                                .click();
                                        
                                            return cy.url().then((finalUrl) => {
                                                cy.log('Final URL after clicking prev: ' + finalUrl);

                                                const isFirstPage = !finalUrl.includes('pg=') || finalUrl.includes('pg=1');

                                                if (isFirstPage) {
                                                    cy.log('✅ SUCCESS: Returned to first page');
                                                } else {
                                                    cy.log('❌ ERROR: Did not return to first page');
                                                    throw new Error('❌ Pagination failed: Did not return to first page');
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        });
                    });
                });
            }
        
            checkTestimonialsOnCurrentPage().then(() => {
                return checkPagination();
            }).then(() => {
                if (failedReview.length > 0) {
                    cy.log(`❌ Total failed reviews: ${failedReview.length}`);
                    failedReview.forEach((review, index) => {
                        cy.log(`Failed Review #${index + 1}: ${review.url} - Missing: ${review.missing.join(', ')}`);
                    });
                    throw new Error(`${failedReview.length} testimonials have missing elements`);
                } else {
                    cy.log('✅ All testimonials passed validation');
                }
            });
        });
    });

};



