module.exports = (site, baseUrl, pass) => {
    describe('🕵️ Agents Page', () => {
        it('Comprehensive Agent Testing - Navigation, CTA, Description & Social Media', () => {

            // Step 1: Navigate to the Agents page with multiple URL possibilities
            cy.log('1️⃣ Navigate to the Agents page');

            // Try different team page URLs
            const teamUrls = [
                'meet-the-team',
                'our-team', 
                'meet-our-team',
                'team',
                'agents',
                'staff',
                'our-agents',
                'team-members',
                'about-us/team',
                'people'
            ];

            let finalTeamUrl = `${baseUrl}meet-the-team/`;

            // First check the default URL
            cy.request({ url: finalTeamUrl, failOnStatusCode: false }).then((response) => {
                if (response.status === 200) {
                    cy.log(`✅ Found team page: ${finalTeamUrl}`);
                    cy.visit(finalTeamUrl);
                    cy.log(`ℹ️ Navigating to the Team Page: ${finalTeamUrl}`);
                } else {
                    cy.log('ℹ️ /meet-the-team/ page not found, trying alternatives');
                    
                    // Use a recursive function to check URLs one by one
                    const checkTeamUrls = (urls, index = 0) => {
                        if (index >= urls.length) {
                            throw new Error('❌ No valid team page found. Tried all possible URLs.');
                        }
                        
                        const testUrl = `${baseUrl}${urls[index]}/`;
                        cy.log(`🔍 Checking: ${testUrl}`);
                        
                        cy.request({ url: testUrl, failOnStatusCode: false }).then((resp) => {
                            if (resp.status === 200) {
                                finalTeamUrl = testUrl;
                                cy.log(`✅ Found team page: ${testUrl}`);
                                cy.visit(finalTeamUrl);
                                cy.log(`ℹ️ Navigating to the Team Page: ${finalTeamUrl}`);
                            } else {
                                cy.log(`❌ ${testUrl} returned status ${resp.status}`);
                                // Recursively check the next URL
                                checkTeamUrls(urls, index + 1);
                            }
                        });
                    };
                    
                    // Start checking alternative URLs
                    checkTeamUrls(teamUrls);
                }
            });
            cy.wait(2000);

            // Page structure selectors
            const pageStructureSelectors = {
                header: [
                    'header',
                    '.header',
                    '.site-header',
                    '#header',
                    '.main-header',
                    '.page-header',
                    'nav',
                    '.navigation'
                ],
                body: [
                    'body',
                    'main',
                    '.main-content',
                    '#content',
                    '.site-content'
                ],
                footer: [
                    'footer',
                    '.footer',
                    '.site-footer',
                    '#footer',
                    '.main-footer',
                    '.page-footer'
                ]
            };

            // Agent listing selectors
            const agentListSelectors = [
                '.agents-item',
                '.aiosAgentsEquinox__agents',
                '.aiosAgentsElevate__our-agents',
                '.agent-item',
                '.team-member',
                '.staff-member',
                '.agent-card',
                '.team-card',
                '.member-item',
                '.agent-profile',
                '.team-member-item',
                '.agent-listing'
            ];

            // CTA Button selectors
            const ctaButtonSelectors = [
                '.agents-button',
                '.agent-button',
                '.cta-button',
                '.contact-button',
                '.agent-cta',
                '.profile-cta',
                '.agent-contact',
                '.contact-agent',
                '.get-in-touch',
                '.reach-out',
                'button[class*="agent"]',
                'button[class*="contact"]',
                '.btn-contact',
                '.btn-cta'
            ];

            // Modal selectors
            const modalSelectors = {
                body: [
                    '.aios-popup-body',
                    '.modal-body',
                    '.popup-body',
                    '.dialog-body',
                    '.overlay-body',
                    '.contact-modal',
                    '.agent-modal',
                    '.popup-content',
                    '.modal-content'
                ],
                close: [
                    '.aiosp-close',
                    '.modal-close',
                    '.popup-close',
                    '.close',
                    '.close-modal',
                    '.close-popup',
                    '[data-dismiss="modal"]',
                    '.dialog-close',
                    '.overlay-close'
                ]
            };

            // Description selectors
            const descriptionSelectors = [
                '.agent-entry-content',
                '.agentsingle__description',
                '.agent-description',
                '.agent-bio',
                '.profile-description',
                '.member-bio',
                '.agent-content',
                '.bio-content',
                '.description',
                '.about',
                '.profile-content',
                '.member-description',
                '.agent-details',
                '.bio-text'
            ];

            // Social media selectors
            const socialMediaSelectors = {
                container: [
                    '.agentsingle__card-smi',
                    '.agent-social',
                    '.social-media',
                    '.social-links',
                    '.profile-social',
                    '.member-social',
                    '.social-icons',
                    '.social-media-links',
                    '.agent-social-links',
                    '.social-buttons',
                    '.social-profiles'
                ]
            };

            // Verify page loads properly
            pageStructureSelectors.header.forEach(selector => {
                cy.get('body').then($body => {
                    if ($body.find(selector).length > 0) {
                        cy.get(selector).should('be.visible');
                        cy.log(`✅ Found header: ${selector}`);
                        return;
                    }
                });
            });

            pageStructureSelectors.body.forEach(selector => {
                cy.get('body').then($body => {
                    if ($body.find(selector).length > 0) {
                        cy.get(selector).should('be.visible');
                        cy.log(`✅ Found body: ${selector}`);
                        return;
                    }
                });
            });

            pageStructureSelectors.footer.forEach(selector => {
                cy.get('body').then($body => {
                    if ($body.find(selector).length > 0) {
                        cy.get(selector).should('be.visible');
                        cy.log(`✅ Found footer: ${selector}`);
                        return;
                    }
                });
            });

            // Expected Result: Agent list is displayed
            let agentContainerFound = false;
            agentListSelectors.forEach(selector => {
                if (!agentContainerFound) {
                    cy.get('body').then($body => {
                        if ($body.find(selector).length > 0) {
                            cy.get(selector).should('exist')
                                .should('have.length.greaterThan', 0);
                            cy.log(`✅ Found agent container: ${selector}`);
                            agentContainerFound = true;
                        }
                    });
                }
            });

            // Step 2: Scroll through the list of agents
            cy.scrollTo('bottom', { duration: 1000 });
            cy.wait(500);
            cy.scrollTo('top', { duration: 1000 });
        
            // Step 3: Collect all agent links and store them in an array
            cy.get('body').then($body => {
                let agentSelector = null;
                agentListSelectors.forEach(selector => {
                    if (!agentSelector && $body.find(selector).length > 0) {
                        agentSelector = selector;
                    }
                });

                if (!agentSelector) {
                    throw new Error('❌ No agent containers found on the page');
                }

                cy.get(agentSelector).find('a').then(($agentLinks) => {
                    const agentUrls = [];

                    // Extract all agent URLs from the links, filtering out duplicates and non-profile links
                    $agentLinks.each((index, element) => {
                        const href = element.getAttribute('href');
                        if (href && 
                            !href.startsWith('tel:') && 
                            !href.startsWith('mailto:') && 
                            !href.startsWith('#') &&
                            href.includes('/') &&
                            !agentUrls.includes(href)) { // Avoid duplicates
                            agentUrls.push(href);
                        }
                    });

                    cy.log(`Found ${agentUrls.length} agent links to test`);

                    // Collect all errors from all test cases
                    let navigationIssues = [];
                    let ctaIssues = [];
                    let descriptionIssues = [];
                    let socialMediaIssues = [];

                    // Success tracking for better logging
                    let navigationSuccess = [];
                    let ctaSuccess = [];
                    let descriptionSuccess = [];
                    let socialMediaSuccess = [];
                    let agentsWithSocialMedia = 0;
                    let agentsWithoutSocialMedia = [];

                    // Step 4: Test each agent profile page with all 4 test cases
                    cy.wrap(agentUrls).each((agentUrl, index) => {
                        cy.log(`🔍 Testing agent ${index + 1} of ${agentUrls.length}: ${agentUrl}`);

                        // Visit the agent's profile page directly
                        cy.visit(agentUrl);

                        // TEST CASE 1: Navigation & Page Structure
                        cy.log(`📋 Test Case 1: Navigation & Page Structure for agent ${index + 1}`);

                        let navigationPassed = true;

                        // Check navigation success
                        cy.url().then((currentUrl) => {
                            if (!currentUrl.includes(agentUrl)) {
                                const errorMsg = `❌ Agent ${index + 1}: Failed to navigate to ${agentUrl}`;
                                cy.log(errorMsg);
                                navigationIssues.push(errorMsg);
                                navigationPassed = false;
                            } else {
                                cy.log(`✅ Agent ${index + 1}: Successfully navigated`);
                            }
                        });

                        // Check header visibility using dynamic selectors
                        cy.get('body').then($body => {
                            let headerFound = false;
                            pageStructureSelectors.header.forEach(headerSelector => {
                                if (!headerFound && $body.find(headerSelector).length > 0) {
                                    cy.get(headerSelector, { timeout: 10000 }).then(($header) => {
                                        if (!$header.is(':visible')) {
                                            const errorMsg = `❌ Agent ${index + 1}: Header not visible`;
                                            cy.log(errorMsg);
                                            navigationIssues.push(errorMsg);
                                            navigationPassed = false;
                                        } else {
                                            cy.log(`✅ Agent ${index + 1}: Header is visible`);
                                            headerFound = true;
                                        }
                                    });
                                }
                            });
                        });

                        // Check body visibility using dynamic selectors
                        cy.get('body').then($body => {
                            let bodyFound = false;
                            pageStructureSelectors.body.forEach(bodySelector => {
                                if (!bodyFound && $body.find(bodySelector).length > 0) {
                                    cy.get(bodySelector).then(($bodyEl) => {
                                        if (!$bodyEl.is(':visible')) {
                                            const errorMsg = `❌ Agent ${index + 1}: Body not visible`;
                                            cy.log(errorMsg);
                                            navigationIssues.push(errorMsg);
                                            navigationPassed = false;
                                        } else {
                                            cy.log(`✅ Agent ${index + 1}: Body is visible`);
                                            bodyFound = true;
                                        }
                                    });
                                }
                            });
                        });

                        // Check footer visibility using dynamic selectors
                        cy.get('body').then($body => {
                            let footerFound = false;
                            pageStructureSelectors.footer.forEach(footerSelector => {
                                if (!footerFound && $body.find(footerSelector).length > 0) {
                                    cy.get(footerSelector, { timeout: 10000 }).then(($footer) => {
                                        if (!$footer.is(':visible')) {
                                            const errorMsg = `❌ Agent ${index + 1}: Footer not visible`;
                                            cy.log(errorMsg);
                                            navigationIssues.push(errorMsg);
                                            navigationPassed = false;
                                        } else {
                                            cy.log(`✅ Agent ${index + 1}: Footer is visible`);
                                            footerFound = true;
                                        }
                                    });
                                }
                            });
                        });
                    
                        // Track navigation success
                        cy.then(() => {
                            if (navigationPassed) {
                                navigationSuccess.push(`Agent ${index + 1}`);
                            }
                        });
                    
                        // TEST CASE 2: CTA Button Functionality
                        cy.log(`📋 Test Case 2: CTA Button Functionality for agent ${index + 1}`);

                        cy.get('body').then(($body) => {
                            // Check if CTA button exists using dynamic selectors
                            let ctaButtonFound = false;
                            ctaButtonSelectors.forEach(selector => {
                                if (!ctaButtonFound && $body.find(selector).length > 0) {
                                    ctaButtonFound = true;
                                    // Click CTA button and check modal
                                    cy.get(selector).scrollIntoView();
                                    cy.wait(500);
                                    cy.get(selector).click();
                                    cy.wait(1000);

                                    cy.get('body').then(($modalBody) => {
                                        let modalFound = false;
                                        modalSelectors.body.forEach(modalSelector => {
                                            if (!modalFound && $modalBody.find(`${modalSelector}:visible`).length > 0) {
                                                cy.log(`✅ Agent ${index + 1}: CTA button working correctly`);
                                                ctaSuccess.push(`Agent ${index + 1}`);
                                                modalFound = true;
                                            }
                                        });

                                        if (!modalFound) {
                                            const errorMsg = `❌ Agent ${index + 1}: Modal did not appear or not visible`;
                                            cy.log(errorMsg);
                                            ctaIssues.push(errorMsg);
                                        }

                                        // Close modal if it exists
                                        let closeButtonFound = false;
                                        modalSelectors.close.forEach(closeSelector => {
                                            if (!closeButtonFound && $modalBody.find(closeSelector).length > 0) {
                                                cy.get(closeSelector).click({ force: true });
                                                closeButtonFound = true;
                                            }
                                        });
                                        
                                        if (!closeButtonFound) {
                                            cy.get('body').type('{esc}');
                                        }
                                        cy.wait(500);
                                    });
                                }
                            });

                            if (!ctaButtonFound) {
                                const errorMsg = `❌ Agent ${index + 1}: CTA button does not exist`;
                                cy.log(errorMsg);
                                ctaIssues.push(errorMsg);
                            }
                        });
                    
                        // TEST CASE 3: Agent Description Visibility
                        cy.log(`📋 Test Case 3: Agent Description Visibility for agent ${index + 1}`);

                        cy.get('body').then(($body) => {
                            // Check if description element exists using dynamic selectors
                            let descriptionFound = false;
                            descriptionSelectors.forEach(selector => {
                                if (!descriptionFound && $body.find(selector).length > 0) {
                                    descriptionFound = true;
                                    // Scroll to description and check visibility/content
                                    cy.get(selector).scrollIntoView();
                                    cy.wait(500);

                                    cy.get(selector).then(($desc) => {
                                        // Check if description is visible
                                        if (!$desc.is(':visible')) {
                                            const errorMsg = `❌ Agent ${index + 1}: Description is not visible`;
                                            cy.log(errorMsg);
                                            descriptionIssues.push(errorMsg);
                                        }
                                        // Check if description has content
                                        else if ($desc.text().trim().length === 0) {
                                            const errorMsg = `❌ Agent ${index + 1}: Description has no content`;
                                            cy.log(errorMsg);
                                            descriptionIssues.push(errorMsg);
                                        }
                                        else {
                                            cy.log(`✅ Agent ${index + 1}: Description is visible and has content`);
                                            descriptionSuccess.push(`Agent ${index + 1}`);
                                        }
                                    });
                                }
                            });

                            if (!descriptionFound) {
                                const errorMsg = `❌ Agent ${index + 1}: Description element does not exist`;
                                cy.log(errorMsg);
                                descriptionIssues.push(errorMsg);
                            }
                        });
                    
                        // TEST CASE 4: Social Media Links
                        cy.log(`📋 Test Case 4: Social Media Links for agent ${index + 1}`);

                        cy.get('body').then(($body) => {
                            // Check if social media section exists using dynamic selectors
                            let socialSectionFound = false;
                            socialMediaSelectors.container.forEach(selector => {
                                if (!socialSectionFound && $body.find(selector).length > 0) {
                                    socialSectionFound = true;
                                    cy.log(`✅ Agent ${index + 1}: Social media section found`);

                                    // Scroll to social media section
                                    cy.get(selector).scrollIntoView();
                                    cy.wait(500);

                                    // Check if social media section is visible
                                    cy.get(selector).then(($smi) => {
                                        if (!$smi.is(':visible')) {
                                            const errorMsg = `❌ Agent ${index + 1}: Social media section is not visible`;
                                            cy.log(errorMsg);
                                            socialMediaIssues.push(errorMsg);
                                        } else {
                                            // Use jQuery to check if social media links exist first
                                            const socialLinks = $smi.find('a');

                                            if (socialLinks.length === 0) {
                                                cy.log(`ℹ️ Agent ${index + 1}: Social media section exists but has no links - skipping`);
                                                agentsWithoutSocialMedia.push(`Agent ${index + 1}`);
                                            } else {
                                                agentsWithSocialMedia++;
                                                cy.log(`✅ Agent ${index + 1}: Found ${socialLinks.length} social media link(s)`);

                                                let socialMediaPassed = true;

                                                // Check each social media link
                                                socialLinks.each((linkIndex, linkElement) => {
                                                    const href = linkElement.getAttribute('href');
                                                    const target = linkElement.getAttribute('target');

                                                    // Check if href exists and is not empty
                                                    if (!href || href.trim() === '' || href === '#') {
                                                        const errorMsg = `❌ Agent ${index + 1}: Social media link ${linkIndex + 1} has broken or empty href`;
                                                        cy.log(errorMsg);
                                                        socialMediaIssues.push(errorMsg);
                                                        socialMediaPassed = false;
                                                    } else {
                                                        cy.log(`🔍 Agent ${index + 1}: Testing social media link ${linkIndex + 1}: ${href}`);

                                                        // Check if this is a Facebook link (Facebook blocks automated requests)
                                                        if (href.includes('facebook.com') || href.includes('fb.com')) {
                                                            // Facebook blocks automated requests, so we'll just validate the URL format
                                                            if (href.match(/^https?:\/\/(www\.)?(facebook\.com|fb\.com)\/.+/)) {
                                                                cy.log(`✅ Agent ${index + 1}: Facebook link ${linkIndex + 1} has valid format (Facebook blocks automated testing)`);

                                                                // Check if link opens in new tab (should have target="_blank")
                                                                if (target !== '_blank') {
                                                                    cy.log(`⚠️ Agent ${index + 1}: Facebook link ${linkIndex + 1} does not open in new tab`);
                                                                }
                                                            } else {
                                                                const errorMsg = `❌ Agent ${index + 1}: Facebook link ${linkIndex + 1} has invalid format - ${href}`;
                                                                cy.log(errorMsg);
                                                                socialMediaIssues.push(errorMsg);
                                                                socialMediaPassed = false;
                                                            }
                                                        } else {
                                                            // Use cy.request to verify non-Facebook links
                                                            cy.request({
                                                                method: 'GET',
                                                                url: href,
                                                                failOnStatusCode: false,
                                                                timeout: 10000,
                                                                followRedirect: true
                                                            }).then((response) => {
                                                                // Check if the request was successful
                                                                if (response.status >= 200 && response.status < 400) {
                                                                    cy.log(`✅ Agent ${index + 1}: Social media link ${linkIndex + 1} is working (Status: ${response.status})`);

                                                                    // Check if link opens in new tab (should have target="_blank")
                                                                    if (target !== '_blank') {
                                                                        cy.log(`⚠️ Agent ${index + 1}: Social media link ${linkIndex + 1} does not open in new tab`);
                                                                    }
                                                                } else {
                                                                    const errorMsg = `❌ Agent ${index + 1}: Social media link ${linkIndex + 1} returned status ${response.status} - ${href}`;
                                                                    cy.log(errorMsg);
                                                                    socialMediaIssues.push(errorMsg);
                                                                    socialMediaPassed = false;
                                                                }
                                                            });
                                                        }
                                                    }
                                                });

                                                // Track social media success
                                                cy.then(() => {
                                                    if (socialMediaPassed) {
                                                        socialMediaSuccess.push(`Agent ${index + 1}`);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });

                            if (!socialSectionFound) {
                                cy.log(`ℹ️ Agent ${index + 1}: No social media section found - skipping`);
                                agentsWithoutSocialMedia.push(`Agent ${index + 1}`);
                            }
                        });

                        // Brief wait between agent page visits
                        cy.wait(500);
                    });

                    // FINAL VALIDATION - ALL TEST CASES COMBINED
                    cy.then(() => {
                        // Combine all issues from all test cases
                        const allIssues = [
                            ...navigationIssues,
                            ...ctaIssues,
                            ...descriptionIssues,
                            ...socialMediaIssues
                        ];

                        // Log detailed summary for each test case
                        cy.log('🎯 ========== COMPREHENSIVE TEST RESULTS ==========');

                        // Test Case 1 Results
                        if (navigationIssues.length === 0) {
                            cy.log('✅ TEST CASE 1: Navigation & Page Structure - PASSED');
                            cy.log(`   ✅ All ${agentUrls.length} agents passed navigation checks`);
                        } else {
                            cy.log('❌ TEST CASE 1: Navigation & Page Structure - FAILED');
                            cy.log(`   ❌ ${navigationIssues.length} navigation issues found`);
                            cy.log(`   ✅ ${navigationSuccess.length} agents passed navigation checks`);
                            navigationIssues.forEach(issue => cy.log(`   ${issue}`));
                        }

                        // Test Case 2 Results
                        if (ctaIssues.length === 0) {
                            cy.log('✅ TEST CASE 2: CTA Button Functionality - PASSED');
                            cy.log(`   ✅ All ${agentUrls.length} agents have working CTA buttons`);
                        } else {
                            cy.log('❌ TEST CASE 2: CTA Button Functionality - FAILED');
                            cy.log(`   ❌ ${ctaIssues.length} CTA button issues found`);
                            cy.log(`   ✅ ${ctaSuccess.length} agents have working CTA buttons`);
                            ctaIssues.forEach(issue => cy.log(`   ${issue}`));
                        }

                        // Test Case 3 Results
                        if (descriptionIssues.length === 0) {
                            cy.log('✅ TEST CASE 3: Agent Description Visibility - PASSED');
                            cy.log(`   ✅ All ${agentUrls.length} agents have visible descriptions with content`);
                        } else {
                            cy.log('❌ TEST CASE 3: Agent Description Visibility - FAILED');
                            cy.log(`   ❌ ${descriptionIssues.length} description issues found`);
                            cy.log(`   ✅ ${descriptionSuccess.length} agents have visible descriptions with content`);
                            if (descriptionSuccess.length > 0) {
                                cy.log(`   ✅ Agents with valid descriptions: ${descriptionSuccess.join(', ')}`);
                            }
                            descriptionIssues.forEach(issue => cy.log(`   ${issue}`));
                        }

                        // Test Case 4 Results
                        if (socialMediaIssues.length === 0) {
                            cy.log('✅ TEST CASE 4: Social Media Links - PASSED');
                            if (agentsWithSocialMedia > 0) {
                                cy.log(`   ✅ ${agentsWithSocialMedia} agents have working social media links`);
                                cy.log(`   ✅ Agents with social media: ${socialMediaSuccess.join(', ')}`);
                            } else {
                                cy.log('   ℹ️ No agents found with social media sections');
                            }
                            if (agentsWithoutSocialMedia.length > 0) {
                                cy.log(`   ℹ️ ${agentsWithoutSocialMedia.length} agents without social media: ${agentsWithoutSocialMedia.join(', ')}`);
                            }
                        } else {
                            cy.log('❌ TEST CASE 4: Social Media Links - FAILED');
                            cy.log(`   ❌ ${socialMediaIssues.length} social media issues found`);
                            cy.log(`   ✅ ${socialMediaSuccess.length} agents have working social media links`);
                            if (socialMediaSuccess.length > 0) {
                                cy.log(`   ✅ Agents with working social media: ${socialMediaSuccess.join(', ')}`);
                            }
                            if (agentsWithoutSocialMedia.length > 0) {
                                cy.log(`   ℹ️ ${agentsWithoutSocialMedia.length} agents without social media: ${agentsWithoutSocialMedia.join(', ')}`);
                            }
                            socialMediaIssues.forEach(issue => cy.log(`   ${issue}`));
                        }

                        // Create detailed error message for assertion
                        let errorMessage = `COMPREHENSIVE TEST FAILED with ${allIssues.length} total issues:\n\n`;

                        if (navigationIssues.length > 0) {
                            errorMessage += `🔴 Navigation Issues (${navigationIssues.length}):\n`;
                            navigationIssues.forEach(issue => errorMessage += `   ${issue}\n`);
                            errorMessage += '\n';
                        }

                        if (ctaIssues.length > 0) {
                            errorMessage += `🔴 CTA Button Issues (${ctaIssues.length}):\n`;
                            ctaIssues.forEach(issue => errorMessage += `   ${issue}\n`);
                            errorMessage += '\n';
                        }

                        if (descriptionIssues.length > 0) {
                            errorMessage += `🔴 Description Issues (${descriptionIssues.length}):\n`;
                            descriptionIssues.forEach(issue => errorMessage += `   ${issue}\n`);
                            errorMessage += '\n';
                        }

                        if (socialMediaIssues.length > 0) {
                            errorMessage += `🔴 Social Media Issues (${socialMediaIssues.length}):\n`;
                            socialMediaIssues.forEach(issue => errorMessage += `   ${issue}\n`);
                            errorMessage += '\n';
                        }

                        errorMessage += `📊 Summary: ${navigationSuccess.length + ctaSuccess.length + descriptionSuccess.length + socialMediaSuccess.length} successful checks, ${allIssues.length} failed checks out of ${agentUrls.length * 4} total checks.`;

                        // Final assertion - fail if ANY test case had issues
                        if (allIssues.length > 0) {
                            cy.log(`🚨 COMPREHENSIVE TEST FAILED: ${allIssues.length} total issue(s) found across all test cases`);
                            throw new Error(errorMessage);
                        } else {
                            cy.log('🎉 COMPREHENSIVE TEST PASSED: All 4 test cases completed successfully!');
                            expect(true, '✅ All agent tests passed successfully').to.be.true;
                        }
                    });
                });
            });
        });
    });
};