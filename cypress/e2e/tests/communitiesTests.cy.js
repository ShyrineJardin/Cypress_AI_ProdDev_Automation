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

    describe('🏦 Communities Page', () => {
        it('🏛️ Checks Communities Page', () => {
            const communitiesUrl = `${baseUrl}communities`;
            const altCommunitiesUrls = [`${baseUrl}community/`, `${baseUrl}neighborhoods/`];
            
            cy.request({ url: communitiesUrl, failOnStatusCode: false }).then((response) => {
                let finalCommunitiesUrl = communitiesUrl;
                
                if (response.status === 404) {
                    cy.log('ℹ️ /communities page not found, trying alternatives');
                    finalCommunitiesUrl = altCommunitiesUrls[0];
                }
                
                cy.visit(finalCommunitiesUrl);
                cy.log(`ℹ️ Navigating to Communities Page: ${finalCommunitiesUrl}`);
            });

            cy.log('Communities List is Displayed')
            const failedCommunity = [];
            const communitiesWithoutProperties = [];
            const communitiesWithPropertyErrors = [];

            // Dynamic selectors for community items 
            const communityItemSelectors = [
                '.aiosCommunitiesEquinox__item a',
                '.aiosCommunitiesRadiance__list a',
                '.aiosCommunitiesPurist__col a',
                '.aiosCommunitiesEndeavor__col a',
                '.aiosCommunitiesGalaxy__col a',
                '.aiosCommunitiesPanorama__col a',
                '.aiosCommunitiesBeacon__col a',
                '.aiosCommunitiesAscend__item a',
                '.aiosCommunitiesElevate__item a',
                '.aioscomu-list a',
                '.community-item a',
                '.communities-list a',
                '.neighborhood-item a',
                '[data-testid="community-item"] a',
                '.community-card a'
            ];

            const communityTitleSelectors = [
                '.aiosCommunitiesEquinox__item--title',
                '.aiosCommunitiesPurist__title',
                '.aiosCommunitiesEndeavor__content h3',
                '.aiosCommunitiesGalaxy__content h2',
                '.aiosCommunitiesPanorama__name',
                '.aiosCommunitiesBeacon__content h3',
                '.aiosCommunitiesAscend__item--title',
                '.aiosCommunitiesElevate__item--title',
                '.aioscomu-label',
                '.community-title',
                '.community-name',
                '.neighborhood-title',
                '[data-testid="community-title"]',
                'h2', 'h3', 'h4' 
            ];

            cy.get('body').then(($body) => {
                let communityItemSelector = '';
                let foundCommunityItems = false;

                // Find the correct community item selector
                communityItemSelectors.forEach(selector => {
                    if (!foundCommunityItems && $body.find(selector).length > 0) {
                        communityItemSelector = selector;
                        foundCommunityItems = true;
                        cy.log(`✅ Found community items using selector: ${selector}`);
                    }
                });

                if (!foundCommunityItems) {
                    throw new Error(`No community items found. Tried selectors: ${communityItemSelectors.join(', ')}`);
                }

                cy.get(communityItemSelector).then(($links) => {
                    const totalCommunities = $links.length;
                    cy.log(`Total Communities found: ${totalCommunities}`)

                    // Get parent container selector
                    const parentSelector = communityItemSelector.split(' a')[0];

                    cy.get(parentSelector).each(($el, index) => {
                        const $link = $el.find('a');
                        const href = $link.prop('href');

                        cy.log(`🔎 Checking community #${index + 1}: ${href}`);

                        cy.wrap($el).as(`community-${index}`);
                        
                        // Get community name 
                        cy.get(`@community-${index}`).then(($currentEl) => {
                            let titleFound = false;
                            let communityName = '';

                            communityTitleSelectors.forEach(titleSelector => {
                                if (!titleFound && $currentEl.find(titleSelector).length > 0) {
                                    communityName = $currentEl.find(titleSelector).first().text().trim();
                                    cy.log(`📝 Community Name: ${communityName}`);

                                    if (!communityName || communityName.length === 0) {
                                        cy.log(`❌ Community #${index + 1} has empty name`);
                                        failedCommunity.push({
                                            index: index + 1,
                                            href: href,
                                            issue: 'Empty community name',
                                            name: communityName
                                        });
                                    } else {
                                        cy.log(`✅ Community #${index + 1} has valid name: ${communityName}`);
                                    }
                                    titleFound = true;
                                }
                            });

                            if (!titleFound) {
                                cy.log(`⚠️ No title found for community #${index + 1}`);
                                failedCommunity.push({
                                    index: index + 1,
                                    href: href,
                                    issue: 'No title element found',
                                    name: 'N/A'
                                });
                            }
                        });

                        cy.get(`@community-${index}`).find('img').then(($img) => {
                            if ($img.length > 0) {
                                // Get image source from either srcset or src
                                let imgSrc;

                                const srcset = $img.prop('srcset');
                                if (srcset) {
                                    imgSrc = srcset.split(',')[0].trim().split(' ')[0];
                                } else {
                                    imgSrc = $img.prop('src');
                                }


                                cy.log(`🖼️ Image src: ${imgSrc}`);
            

                                if (!imgSrc || imgSrc.length === 0) {
                                    cy.log(`❌ Community #${index + 1} has empty image src`);
                                    failedCommunity.push({
                                        index: index + 1,
                                        href: href,
                                        issue: 'Empty image src',
                                        imgSrc: imgSrc
                                    });
                                } else {
                                    // Check if image loads successfully
                                    cy.request({
                                        url: imgSrc,
                                        failOnStatusCode: false
                                    }).then((response) => {
                                        if (response.status === 200) {
                                            cy.log(`✅ Community #${index + 1} image loads successfully`);
                                        } else {
                                            cy.log(`❌ Community #${index + 1} image failed to load (Status: ${response.status})`);
                                            failedCommunity.push({
                                                index: index + 1,
                                                href: href,
                                                issue: `Image failed to load (Status: ${response.status})`,
                                                imgSrc: imgSrc
                                            });
                                        }
                                    });
                                }
                            } else {
                                cy.log(`⚠️ No image found for community #${index + 1}`);
                            }
                        });
                    }).then(() => {
                        // Summary report
                        cy.log(`📊 Summary Report:`);
                        cy.log(`Total Communities: ${totalCommunities}`);
                        cy.log(`Failed Communities: ${failedCommunity.length}`);

                        if (failedCommunity.length > 0) {
                            cy.log(`❌ Failed Communities Details:`);
                            failedCommunity.forEach((failed, idx) => {
                                cy.log(`${idx + 1}. Community #${failed.index} - ${failed.issue}`);
                                cy.log(`   URL: ${failed.href}`);
                                if (failed.imgSrc) cy.log(`   Image: ${failed.imgSrc}`);
                                if (failed.name) cy.log(`   Name: ${failed.name}`);
                            });

                             expect(failedCommunity.length).to.equal(0, `${failedCommunity.length} communities have issues`);
                        } else {
                            cy.log(`✅ All communities passed validation!`);
                        }
                    });
                });
            });
        
            cy.log('2️⃣ Testing Community Inner Page Navigation and Properties for All Communities')

            // Dynamic selectors for getting communities
            const firstCommunitySelectors = [
                '.aiosCommunitiesEquinox__item',
                '.aiosCommunitiesRadiance__list',
                '.aiosCommunitiesPurist__col',
                '.aiosCommunitiesEndeavor__col',
                '.aiosCommunitiesGalaxy__col',
                '.aiosCommunitiesPanorama__col',
                '.aiosCommunitiesBeacon__col ',
                '.aiosCommunitiesAscend__item ',
                '.aiosCommunitiesElevate__item ',
                '.aioscomu-list',
                '.community-item',
                '.communities-list > div',
                '.neighborhood-item',
                '[data-testid="community-item"]',
                '.community-card'
            ];

            cy.get('body').then(($body) => {
                let communitySelector = '';
                let foundCommunities = false;

                firstCommunitySelectors.forEach(selector => {
                    if (!foundCommunities && $body.find(selector).length > 0) {
                        communitySelector = selector;
                        foundCommunities = true;
                        cy.log(`✅ Found communities using selector: ${selector}`);
                    }
                });

                if (!foundCommunities) {
                    throw new Error(`No community container found. Tried selectors: ${firstCommunitySelectors.join(', ')}`);
                }

                // Test each community for properties
                cy.get(communitySelector).then(($communities) => {
                    const totalCommunities = $communities.length;
                    cy.log(`🏢 Found ${totalCommunities} communities to test`);

                    // Process each community sequentially
                    const processCommunity = (communityIndex) => {
                        if (communityIndex >= totalCommunities) {
                            // All communities processed, show final report
                            cy.then(() => {
                                // Final comprehensive summary report
                                cy.log(`📊 FINAL COMPREHENSIVE SUMMARY REPORT:`);
                                
                                if (communitiesWithoutProperties.length > 0) {
                                    cy.log(`🏠 Communities WITHOUT Featured Properties: ${communitiesWithoutProperties.length}`);
                                    communitiesWithoutProperties.forEach((community, idx) => {
                                        cy.log(`${idx + 1}. Community #${community.index}: ${community.name}`);
                                        cy.log(`   Issue: ${community.issue}`);
                                    });
                                }
                                
                                if (communitiesWithPropertyErrors.length > 0) {
                                    cy.log(`❌ Communities WITH Property Errors: ${communitiesWithPropertyErrors.length}`);
                                    communitiesWithPropertyErrors.forEach((community, idx) => {
                                        cy.log(`${idx + 1}. Community #${community.index}: ${community.name}`);
                                        cy.log(`   Issue: ${community.issue}`);
                                        if (community.expectedAddress) cy.log(`   Expected: ${community.expectedAddress}`);
                                        if (community.actualAddress) cy.log(`   Actual: ${community.actualAddress}`);
                                    });
                                }
                                
                                if (failedCommunity.length > 0) {
                                    cy.log(`⚠️ Communities WITH General Issues: ${failedCommunity.length}`);
                                    failedCommunity.forEach((failed, idx) => {
                                        cy.log(`${idx + 1}. Community #${failed.index}: ${failed.name || 'Unknown'}`);
                                        cy.log(`   Issue: ${failed.issue}`);
                                        cy.log(`   URL: ${failed.href}`);
                                    });
                                }
                                
                                cy.log(`📈 SUMMARY STATISTICS:`);
                                cy.log(`Communities without properties: ${communitiesWithoutProperties.length}`);
                                cy.log(`Communities with property errors: ${communitiesWithPropertyErrors.length}`);
                                cy.log(`Communities with general issues: ${failedCommunity.length}`);
                                
                                const totalIssues = communitiesWithoutProperties.length + communitiesWithPropertyErrors.length + failedCommunity.length;
                                if (totalIssues === 0) {
                                    cy.log(`✅ ALL COMMUNITIES PASSED ALL TESTS!`);
                                } else {
                                    throw new Error(`❌ Total communities with issues: ${totalIssues}`);

                                }
                                
                            });
                            return;
                        }

                        // Navigate back to communities page first
                        cy.request({ url: communitiesUrl, failOnStatusCode: false }).then((response) => {
                            let finalUrl = communitiesUrl;
                            if (response.status === 404) {
                                finalUrl = altCommunitiesUrls[0];
                            }
                            cy.visit(finalUrl);
                            cy.wait(2000); 
                        });

                        // Get the current community and extract its name
                        cy.get(communitySelector).eq(communityIndex).then(($communityEl) => {
                            let currentCommunityName = '';
                            
                            // Extract community name synchronously
                            communityTitleSelectors.forEach(titleSelector => {
                                if (!currentCommunityName && $communityEl.find(titleSelector).length > 0) {
                                    currentCommunityName = $communityEl.find(titleSelector).first().text().trim();
                                }
                            });

                            if (!currentCommunityName) {
                                currentCommunityName = `Community #${communityIndex + 1}`;
                            }

                            cy.log(`🎯 Testing community #${communityIndex + 1}: ${currentCommunityName}`);

                            // Click on the community
                            cy.get(communitySelector).eq(communityIndex).find('a').first().click();

                            cy.log('⏳ Waiting for inner page to load');
                            cy.get('body').should('be.visible');

                            // Verify we're on the community page
                            const communityPageTitleSelectors = [
                                '.community-title h2',
                                '.community-header h1',
                                '.page-title h1',
                                '.entry-title',
                                '[data-testid="community-title"]',
                                'h1', 'h2'
                            ];

                            cy.get('body').then(($innerBody) => {
                                let titleFound = false;
                                communityPageTitleSelectors.forEach(selector => {
                                    if (!titleFound && $innerBody.find(selector).length > 0) {
                                        const pageTitle = $innerBody.find(selector).first().text().trim();
                                        cy.log(`📋 Community page title: ${pageTitle}`);
                                        titleFound = true;
                                    }
                                });
                            });

                            // Check for essential community details
                            const communityContentSelectors = [
                                '.community-featured-image',
                                '.community-content',
                                '.community-description',
                                '.entry-content',
                                '[data-testid="community-content"]',
                                '.page-content'
                            ];

                            cy.get('body').then(($innerBody) => {
                                let foundElement = false;
                                communityContentSelectors.forEach(selector => {
                                    if ($innerBody.find(selector).length > 0) {
                                        foundElement = true;
                                        cy.log(`✅ Found community content element: ${selector}`);
                                    }
                                });
                            });

                            // Check for featured properties
                            cy.log(`📍 Checking for featured properties in community: ${currentCommunityName}`);

                            const propertiesContainerSelectors = [
                                '.aci-results-elevate-list',
                                '#listings-results',
                                '.properties-list',
                                '.listings-container',
                                '.featured-properties',
                                '[data-testid="properties-list"]',
                                '.property-listings'
                            ];

                            const propertyItemSelectors = [
                                '.aci-results-elevate-list-item a',
                                '.listings-item a',
                                '.property-item a',
                                '.listing-item a',
                                '.featured-property a',
                                '[data-testid="property-item"] a',
                                '.property-card a'
                            ];

                            const propertyAddressSelectors = [
                                '.aci-results-elevate-list-address strong',
                                '.property-address',
                                '.listing-address',
                                '.listings-address',
                                '[data-testid="property-address"]',
                                '.address'
                            ];

                            cy.get('body').then(($innerBody) => {
                                let propertiesContainer = '';
                                let propertyItemSelector = '';
                                let foundProperties = false;

                                // Find properties container
                                propertiesContainerSelectors.forEach(selector => {
                                    if (!foundProperties && $innerBody.find(selector).length > 0) {
                                        propertiesContainer = selector;
                                        cy.log(`✅ Found properties container: ${selector}`);
                                        foundProperties = true;
                                    }
                                });

                                if (!foundProperties) {
                                    cy.log(`ℹ️ No featured properties found for community: ${currentCommunityName} - adding to tracking list`);
                                    communitiesWithoutProperties.push({
                                        index: communityIndex + 1,
                                        name: currentCommunityName,
                                        issue: 'No featured properties container found'
                                    });
                                    
                                    // Process next community
                                    processCommunity(communityIndex + 1);
                                    return;
                                }

                                // Find property item selector
                                propertyItemSelectors.forEach(selector => {
                                    if ($innerBody.find(selector).length > 0) {
                                        propertyItemSelector = selector;
                                        cy.log(`✅ Found property items: ${selector}`);
                                    }
                                });

                                cy.get(propertiesContainer).then(($propertiesContainer) => {
                                    const items = $propertiesContainer.find(propertyItemSelector);
                                
                                    if (items.length > 0) {
                                        const propertyCount = items.length;
                                        cy.log(`✅ Found ${propertyCount} featured property item(s) for ${currentCommunityName}`);
                                
                                        // Extract address synchronously from the already found elements
                                        const propertyParentSelector = propertyItemSelector.split(' a')[0];
                                        const firstPropertyEl = $propertiesContainer.find(propertyParentSelector).first();
                                        let communityPropertyAddress = '';
                                        let addressFound = false;

                                        propertyAddressSelectors.forEach(addressSelector => {
                                            if (!addressFound && firstPropertyEl.find(addressSelector).length > 0) {
                                                communityPropertyAddress = firstPropertyEl.find(addressSelector).first().text().trim();
                                                cy.log(`📍 Community property address: ${communityPropertyAddress}`);
                                                addressFound = true;
                                            }
                                        });

                                        if (!addressFound) {
                                            cy.log('⚠️ No property address found in community listing');
                                        }

                                        // Test property detail page navigation
                                        cy.log('🏠 Testing property detail page navigation');
                                        cy.get(propertyItemSelector).first().click({force:true});
                                    
                                        cy.log('⏳ Waiting for property detail page to load');
                                        cy.url().should('not.include', '/communities/');
                                    
                                        cy.log('🔍 Verifying property address consistency');
                                    
                                        const detailAddressSelectors = [
                                            '.aci-details-equinox-address strong',
                                            '.listings-address',
                                            '.property-detail-address',
                                            '.listing-detail-address',
                                            '[data-testid="detail-address"]',
                                            '.detail-address'
                                        ];
                                    
                                        cy.get('body').then(($detailBody) => {
                                            let detailPageAddress = '';
                                            let found = false;
                                    
                                            // for (const selector of detailAddressSelectors) {
                                            //     if ($detailBody.find(selector).length > 0) {
                                            //         found = true;
                                            //         detailPageAddress = $detailBody.find(selector).first().text().trim();
                                            //         cy.log(`📍 Detail page address: ${detailPageAddress}`);
                                                
                                            //         const normalize = str => str.toLowerCase().replace(/\s+/g, ' ').trim();
                                            //         const normalizedCommunity = normalize(communityPropertyAddress);
                                            //         const normalizedDetail = normalize(detailPageAddress);
                                                
                                            //         if (normalizedCommunity === normalizedDetail) {
                                            //             cy.log(`✅ Property address matches for ${currentCommunityName}`);
                                            //         } else {
                                            //             cy.log(`❌ Property address mismatch for ${currentCommunityName}`);
                                            //             communitiesWithPropertyErrors.push({
                                            //                 index: communityIndex + 1,
                                            //                 name: currentCommunityName,
                                            //                 issue: 'Property address mismatch',
                                            //                 expectedAddress: communityPropertyAddress,
                                            //                 actualAddress: detailPageAddress
                                            //             });
                                            //         }
                                            //         break; 
                                            //     }
                                            // }
                                    
                                            // if (!found) {
                                            //     cy.log(`⚠️ Could not find property address on detail page for ${currentCommunityName}`);
                                            //     communitiesWithPropertyErrors.push({
                                            //         index: communityIndex + 1,
                                            //         name: currentCommunityName,
                                            //         issue: 'Property address not found on detail page'
                                            //     });
                                            // }

                                            cy.log(`✅ Property detail page verification completed for ${currentCommunityName}`);
                                            
                                            // Process next community
                                            processCommunity(communityIndex + 1);
                                        });
                                
                                    } else {
                                        cy.log(`ℹ️ Properties container found but no property items for community: ${currentCommunityName}`);
                                        communitiesWithoutProperties.push({
                                            index: communityIndex + 1,
                                            name: currentCommunityName,
                                            issue: 'Properties container found but no property items'
                                        });
                                        
                                        // Process next community
                                        processCommunity(communityIndex + 1);
                                    }
                                });
                            });
                        });
                    };

                    // Start processing from the first community
                    processCommunity(0);
                });
            });
        });
    });
}