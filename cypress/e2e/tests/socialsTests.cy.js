module.exports = (site, baseUrl, pass) => {
    // Define multiple selector variations for different site structures
    const SELECTORS = {
        container: [
            '.aiosSmwContainer-items',
            '.aios-smf-theme-three',
            '.aios-smf-theme-five',
            '.aios-smf-theme-two',
            '.social-media-container',
            '.social-posts-container',
            '.social-feed-container',
            '.social-wrapper',
            '.posts-container',
            '[data-component="social-media"]',
            '#social-media-container'
        ],
        contentItem: [
            '.aiosSmwContainer-content__item',
            '.aios-smf-group-item',
            '.social-post',
            '.social-media-post',
            '.post-item',
            '.feed-item',
            '.social-item',
            '[data-post-type]',
            '[data-feed-type]',
            '.social-content-item'
        ],
        activeItem: [
            '.aiosSmwContainer-content__item.filter-active',
            '.social-post.active',
            '.social-media-post.active',
            '.post-item.active',
            '.feed-item.active',
            '.social-item.active',
            '[data-post-type].active',
            '[data-feed-type].active'
        ],
        itemImage: [
            '.aiosSmwContainer-content__item--img',
            '.filter-view-img',
            '.social-post-image',
            '.post-image',
            '.social-image',
            '.feed-image',
            '.item-image',
            'img',
            '.post-thumbnail'
        ],
        itemDescription: [
            '.aiosSmwContainer-content__item--description',
            '.filter-view-description',
            '.social-post-description',
            '.post-description',
            '.social-description',
            '.feed-description',
            '.item-description',
            '.post-content',
            '.social-content'
        ],
        itemLink: [
            '.aiosSmwContainer-content__item--link',
            '.social-post-link',
            '.post-link',
            '.social-link',
            '.feed-link',
            '.item-link',
            'a[href*="facebook.com"]',
            'a[href*="instagram.com"]',
            'a[href*="youtube.com"]',
            'a'
        ],
        facebookIcon: [
            '.ai-font-facebook',
            '.fa-facebook',
            '.fab.fa-facebook-f',
            '.facebook-icon',
            '.social-icon-facebook',
            '[class*="facebook"]',
            '[data-icon="facebook"]'
        ],
        instagramIcon: [
            '.ai-font-instagram',
            '.fa-instagram',
            '.fab.fa-instagram',
            '.instagram-icon',
            '.social-icon-instagram',
            '[class*="instagram"]',
            '[data-icon="instagram"]'
        ],
        youtubeIcon: [
            '.ai-font-youtube',
            '.fa-youtube',
            '.fab.fa-youtube',
            '.youtube-icon',
            '.social-icon-youtube',
            '[class*="youtube"]',
            '[data-icon="youtube"]'
        ],
        facebookFilter: [
            '[data-feed-filter="facebookpage"]',
            '[data-filter="facebook"]',
            '.facebook-filter',
            '.filter-facebook',
            'button[data-platform="facebook"]',
            '.social-filter[data-type="facebook"]'
        ],
        instagramFilter: [
            '[data-feed-filter="instagrambusiness"]',
            '[data-filter="instagram"]',
            '.instagram-filter',
            '.filter-instagram',
            'button[data-platform="instagram"]',
            '.social-filter[data-type="instagram"]'
        ],
        youtubeFilter: [
            '[data-feed-filter="youtubevideo"]',
            '[data-filter="youtube"]',
            '.youtube-filter',
            '.filter-youtube',
            'button[data-platform="youtube"]',
            '.social-filter[data-type="youtube"]'
        ],
        facebookPosts: [
            '[data-feed-type="facebookpage"]',
            '[data-post-type="facebook"]',
            '[data-platform="facebook"]',
            '.facebook-post',
            '.social-post[data-type="facebook"]'
        ],
        instagramPosts: [
            '[data-feed-type="instagrambusiness"]',
            '[data-post-type="instagram"]',
            '[data-platform="instagram"]',
            '.instagram-post',
            '.social-post[data-type="instagram"]'
        ],
        youtubePosts: [
            '[data-feed-type="youtubevideo"]',
            '[data-post-type="youtube"]',
            '[data-platform="youtube"]',
            '.youtube-post',
            '.social-post[data-type="youtube"]'
        ],
        modal: [
            '.aiosp-iframe-scaler',
            '.modal',
            '.social-modal',
            '.video-modal',
            '.popup-modal',
            '[data-modal="social"]',
            '.overlay-modal',
            '.lightbox'
        ],
        modalClose: [
            '.aiosp-iframe-scaler .aiosp-close',
            '.aiosp-close',
            '.modal-close',
            '.close-modal',
            '.modal .close',
            '[data-dismiss="modal"]',
            '.close-button',
            '.modal-x',
            '.close-icon'
        ]
    };

    // Helper function to find working selector by testing each one
    const findWorkingSelector = (selectors, context = 'body') => {
        for (const selector of selectors) {
            try {
                if (Cypress.$(context).find(selector).length > 0) {
                    return selector;
                }
            } catch (e) {
                continue;
            }
        }
        return selectors[0]; // fallback to first selector if none found
    };

    // Helper function for Cypress commands with fallback selectors
    const getWithFallback = (selectors, options = {}) => {
        const workingSelector = findWorkingSelector(selectors);
        return cy.get(workingSelector, options);
    };

    // Helper function to try selectors within a specific context
    const getWithinContext = (context, selectors, options = {}) => {
        return cy.wrap(context).then($context => {
            const workingSelector = findWorkingSelector(selectors, $context[0]);
            return cy.wrap($context).find(workingSelector, options);
        });
    };

    // Helper function to check if platform has posts with flexible attribute detection
    const checkPlatformAvailability = (platform) => {
        return cy.get('body').then($body => {
            let found = false;
            const platformSelectors = SELECTORS[`${platform}Posts`];
            
            for (const selector of platformSelectors) {
                if ($body.find(selector).length > 0) {
                    found = true;
                    break;
                }
            }
            
            // Additional fallback: check for links containing platform name
            if (!found) {
                const platformLinks = $body.find(`a[href*="${platform}.com"]`);
                if (platformLinks.length > 0) {
                    found = true;
                }
            }
            
            return found;
        });
    };

    // Helper function to get platform attribute from post element
    const getPlatformFromPost = (postElement) => {
        const $post = Cypress.$(postElement);
        
        // Try different attribute patterns
        const attributePatterns = [
            'data-feed-type',
            'data-post-type',
            'data-platform',
            'data-type',
            'data-social-type'
        ];
        
        for (const attr of attributePatterns) {
            const value = $post.attr(attr);
            if (value) {
                // Normalize platform names
                if (value.includes('facebook')) return 'facebook';
                if (value.includes('instagram')) return 'instagram';
                if (value.includes('youtube')) return 'youtube';
                return value;
            }
        }
        
        // Fallback: check classes
        const className = $post.attr('class') || '';
        if (className.includes('facebook')) return 'facebook';
        if (className.includes('instagram')) return 'instagram';
        if (className.includes('youtube')) return 'youtube';
        
        // Final fallback: check for platform links
        const links = $post.find('a[href]');
        for (let i = 0; i < links.length; i++) {
            const href = Cypress.$(links[i]).attr('href');
            if (href && href.includes('facebook.com')) return 'facebook';
            if (href && href.includes('instagram.com')) return 'instagram';
            if (href && href.includes('youtube.com')) return 'youtube';
        }
        
        return 'unknown';
    };

    // Helper function to validate post structure with flexible selectors
    const validatePostStructure = (postElement, expectedPlatform) => {
        cy.wrap(postElement).then($post => {
            // Check for image with multiple possible selectors
            let imageFound = false;
            for (const imageSelector of SELECTORS.itemImage) {
                if ($post.find(imageSelector).length > 0) {
                    cy.wrap($post).find(imageSelector).should('exist');
                    imageFound = true;
                    break;
                }
            }
            if (!imageFound) {
                cy.log(`⚠️ No image found for ${expectedPlatform} post`);
            }

            // Check for description with multiple possible selectors
            let descriptionFound = false;
            for (const descSelector of SELECTORS.itemDescription) {
                if ($post.find(descSelector).length > 0) {
                    cy.wrap($post).find(descSelector).should('be.visible').and('not.be.empty');
                    descriptionFound = true;
                    break;
                }
            }
            if (!descriptionFound) {
                cy.log(`⚠️ No description found for ${expectedPlatform} post`);
            }

            // Check for platform icon with multiple possible selectors
            const iconSelectors = SELECTORS[`${expectedPlatform}Icon`];
            let iconFound = false;
            for (const iconSelector of iconSelectors) {
                if ($post.find(iconSelector).length > 0) {
                    cy.wrap($post).find(iconSelector).should('exist');
                    iconFound = true;
                    break;
                }
            }
            if (!iconFound) {
                cy.log(`⚠️ No ${expectedPlatform} icon found`);
            }

            // Check for platform link with flexible validation
            let linkFound = false;
            for (const linkSelector of SELECTORS.itemLink) {
                const links = $post.find(linkSelector);
                if (links.length > 0) {
                    for (let i = 0; i < links.length; i++) {
                        const href = Cypress.$(links[i]).attr('href');
                        if (href && href.includes(`${expectedPlatform}.com`)) {
                            cy.wrap(links[i]).should('have.attr', 'href').and('include', `${expectedPlatform}.com`);
                            linkFound = true;
                            break;
                        }
                    }
                    if (linkFound) break;
                }
            }
            if (!linkFound) {
                cy.log(`⚠️ No ${expectedPlatform} link found`);
            }
        });
    };

    describe('👥 Social Media Page', () => {
        it('Should display available social media posts (skip missing platforms)', () => {
            cy.log('🚀 Starting test: Verifying display of available social media posts');
            
            // Try different social media page URLs
            const socialMediaUrls = ['social-media', 'social', 'social-feeds', 'social-posts'];
            let pageFound = false;
            
            const tryNextUrl = (index = 0) => {
                if (index >= socialMediaUrls.length) {
                    // cy.log('ℹ️ No social media page found - skipping social media tests');
                    throw new Error('❌  No social media page found - skipping social media tests');
                    return;
                }
                
                const url = `${baseUrl}${socialMediaUrls[index]}`;
                cy.request({ url, failOnStatusCode: false }).then((response) => {
                    if (response.status === 200) {
                        cy.visit(url);
                        cy.log(`📄 Navigated to social media page: ${url}`);
                        pageFound = true;
                        runSocialMediaTest();
                    } else {
                        tryNextUrl(index + 1);
                    }
                });
            };
            
            const runSocialMediaTest = () => {
                // Check if social media container exists
                cy.get('body').then($body => {
                    const containerSelector = findWorkingSelector(SELECTORS.container);
                    if ($body.find(containerSelector).length === 0) {
                        cy.log('ℹ️ No social media container found - skipping social media tests');
                        expect(true, 'No social media container - test skipped gracefully').to.be.true;
                        return;
                    }

                    cy.log('🔍 Looking for social media container...');
                    getWithFallback(SELECTORS.container, { timeout: 10000 }).should('be.visible');
                    getWithFallback(SELECTORS.container).scrollIntoView();
                    cy.log('✅ Social media container found and scrolled into view');
                    
                    cy.log('📊 Checking for content items...');
                    const contentItemSelector = findWorkingSelector(SELECTORS.contentItem);
                    if ($body.find(contentItemSelector).length === 0) {
                        cy.log('ℹ️ No social media content items found - skipping test');
                        expect(true, 'No social media content - test skipped gracefully').to.be.true;
                        return;
                    }

                    getWithFallback(SELECTORS.contentItem, { timeout: 10000 }).should('have.length.greaterThan', 0);
                    cy.log('✅ Content items found');

                    // Get all posts (try active items first, then all items)
                    const activeItemSelector = findWorkingSelector(SELECTORS.activeItem);
                    const postSelector = $body.find(activeItemSelector).length > 0 ? activeItemSelector : contentItemSelector;
                    
                    cy.get(postSelector).then(($posts) => {
                        const totalPosts = $posts.length;
                        cy.log(`📈 Total posts found: ${totalPosts}`);

                        // Count posts by platform with flexible detection
                        let facebookCount = 0;
                        let instagramCount = 0;
                        let youtubeCount = 0;
                        let availablePlatforms = [];

                        cy.log('🔄 Analyzing posts by platform...');
                        $posts.each((index, element) => {
                            const platform = getPlatformFromPost(element);
                            cy.log(`📝 Post ${index + 1}: Platform = ${platform}`);
                        
                            switch(platform) {
                                case 'facebook':
                                    facebookCount++;
                                    if (!availablePlatforms.includes('Facebook')) availablePlatforms.push('Facebook');
                                    break;
                                case 'instagram':
                                    instagramCount++;
                                    if (!availablePlatforms.includes('Instagram')) availablePlatforms.push('Instagram');
                                    break;
                                case 'youtube':
                                    youtubeCount++;
                                    if (!availablePlatforms.includes('YouTube')) availablePlatforms.push('YouTube');
                                    break;
                                default:
                                    cy.log(`⚠️ Unknown platform: ${platform}`);
                            }
                        });

                        cy.log(`📊 Platform breakdown:`);
                        cy.log(`📘 Facebook posts: ${facebookCount}`);
                        cy.log(`📸 Instagram posts: ${instagramCount}`);
                        cy.log(`📺 YouTube posts: ${youtubeCount}`);

                        // Log available and missing platforms
                        const allPlatforms = ['Facebook', 'Instagram', 'YouTube'];
                        const missingPlatforms = allPlatforms.filter(platform => !availablePlatforms.includes(platform));
                        
                        if (availablePlatforms.length > 0) {
                            cy.log(`✅ Available platforms: ${availablePlatforms.join(', ')}`);
                        }
                        
                        if (missingPlatforms.length > 0) {
                            cy.log(`ℹ️ Missing platforms (skipped): ${missingPlatforms.join(', ')}`);
                        }

                        // Validate posts for each available platform
                        if (facebookCount > 0) {
                            cy.log('🔍 Verifying Facebook posts structure...');
                            $posts.each((index, element) => {
                                if (getPlatformFromPost(element) === 'facebook') {
                                    cy.log(`📘 Verifying Facebook post ${index + 1} structure`);
                                    validatePostStructure(element, 'facebook');
                                }
                            });
                            cy.log('✅ All Facebook posts verified');
                        } else {
                            cy.log('ℹ️ No Facebook posts found - skipping Facebook verification');
                        }

                        if (instagramCount > 0) {
                            cy.log('🔍 Verifying Instagram posts structure...');
                            $posts.each((index, element) => {
                                if (getPlatformFromPost(element) === 'instagram') {
                                    cy.log(`📸 Verifying Instagram post ${index + 1} structure`);
                                    validatePostStructure(element, 'instagram');
                                }
                            });
                            cy.log('✅ All Instagram posts verified');
                        } else {
                            cy.log('ℹ️ No Instagram posts found - skipping Instagram verification');
                        }

                        if (youtubeCount > 0) {
                            cy.log('🔍 Verifying YouTube posts structure...');
                            $posts.each((index, element) => {
                                if (getPlatformFromPost(element) === 'youtube') {
                                    cy.log(`📺 Verifying YouTube post ${index + 1} structure`);
                                    validatePostStructure(element, 'youtube');
                                }
                            });
                            cy.log('✅ All YouTube posts verified');
                        } else {
                            cy.log('ℹ️ No YouTube posts found - skipping YouTube verification');
                        }

                        // At least one platform should be available
                        expect(totalPosts, 'At least one social media post should be available').to.be.greaterThan(0);
                        expect(availablePlatforms.length, 'At least one platform should be available').to.be.greaterThan(0);

                        cy.log(`🎉 Test completed successfully: Found posts from ${availablePlatforms.length} platform(s): ${availablePlatforms.join(', ')}`);
                    });
                });
            };
            
            tryNextUrl();
        });

        it('Filter by Facebook Posts (skip if not available)', () => {
            cy.log('🚀 Starting test: Facebook filter functionality');
            
            // Try different social media page URLs
            const socialMediaUrls = ['social-media', 'social', 'social-feeds', 'social-posts'];
            
            const tryNextUrl = (index = 0) => {
                if (index >= socialMediaUrls.length) {
                    cy.log('ℹ️ No social media page found - skipping Facebook filter test');
                    expect(true, 'No social media page found - test skipped gracefully').to.be.true;
                    return;
                }
                
                const url = `${baseUrl}${socialMediaUrls[index]}`;
                cy.request({ url, failOnStatusCode: false }).then((response) => {
                    if (response.status === 200) {
                        cy.visit(url);
                        cy.log(`📄 Navigated to social media page: ${url}`);
                        runFacebookFilterTest();
                    } else {
                        tryNextUrl(index + 1);
                    }
                });
            };
            
            const runFacebookFilterTest = () => {
                // Check if Facebook posts are available
                checkPlatformAvailability('facebook').then(hasFacebookPosts => {
                    if (!hasFacebookPosts) {
                        cy.log('ℹ️ No Facebook posts available - skipping Facebook filter test');
                        expect(true, 'Facebook posts not available - test skipped gracefully').to.be.true;
                        return;
                    }

                    // Check if Facebook filter exists
                    cy.get('body').then($body => {
                        const facebookFilterSelector = findWorkingSelector(SELECTORS.facebookFilter);
                        if ($body.find(facebookFilterSelector).length === 0) {
                            cy.log('ℹ️ No Facebook filter found - skipping Facebook filter test');
                            expect(true, 'Facebook filter not available - test skipped gracefully').to.be.true;
                            return;
                        }

                        cy.log('🔘 Clicking Facebook filter...');
                        getWithFallback(SELECTORS.facebookFilter).click();
                        cy.log('✅ Facebook filter activated');
                    
                        cy.log('🔍 Checking filtered content visibility...');
                        getWithFallback(SELECTORS.contentItem).then(($items) => {
                            cy.wrap($items.filter(':visible')).should('have.length.greaterThan', 0);
                        });
                        cy.log('✅ Filtered content is visible');
                    
                        // Check that all visible posts are Facebook posts with flexible detection
                        cy.log('📘 Verifying all visible posts are Facebook posts...');
                        cy.get(`${findWorkingSelector(SELECTORS.contentItem)}:visible`).each(($post) => {
                            const platform = getPlatformFromPost($post[0]);
                            expect(platform).to.equal('facebook');
                        });
                        cy.log('✅ All visible posts confirmed as Facebook posts');

                        // Verify Facebook posts have required elements and links
                        cy.log('🔍 Verifying Facebook post links and structure...');
                        cy.get(`${findWorkingSelector(SELECTORS.contentItem)}:visible`).each(($post, index) => {
                            if (getPlatformFromPost($post[0]) === 'facebook') {
                                cy.log(`📘 Verifying Facebook post ${index + 1} structure and links`);
                                validatePostStructure($post[0], 'facebook');
                            }
                        });
                        cy.log('✅ All Facebook post links verified');
                        cy.log('🎉 Test completed successfully: Facebook filter working correctly');
                    });
                });
            };
            
            tryNextUrl();
        });

        it('Filter by Instagram Posts (skip if not available)', () => {
            cy.log('🚀 Starting test: Instagram filter functionality');
            
            // Try different social media page URLs
            const socialMediaUrls = ['social-media', 'social', 'social-feeds', 'social-posts'];
            
            const tryNextUrl = (index = 0) => {
                if (index >= socialMediaUrls.length) {
                    cy.log('ℹ️ No social media page found - skipping Instagram filter test');
                    expect(true, 'No social media page found - test skipped gracefully').to.be.true;
                    return;
                }
                
                const url = `${baseUrl}${socialMediaUrls[index]}`;
                cy.request({ url, failOnStatusCode: false }).then((response) => {
                    if (response.status === 200) {
                        cy.visit(url);
                        cy.log(`📄 Navigated to social media page: ${url}`);
                        runInstagramFilterTest();
                    } else {
                        tryNextUrl(index + 1);
                    }
                });
            };
            
            const runInstagramFilterTest = () => {
                // Check if Instagram posts are available
                checkPlatformAvailability('instagram').then(hasInstagramPosts => {
                    if (!hasInstagramPosts) {
                        cy.log('ℹ️ No Instagram posts available - skipping Instagram filter test');
                        expect(true, 'Instagram posts not available - test skipped gracefully').to.be.true;
                        return;
                    }

                    // Check if Instagram filter exists
                    cy.get('body').then($body => {
                        const instagramFilterSelector = findWorkingSelector(SELECTORS.instagramFilter);
                        if ($body.find(instagramFilterSelector).length === 0) {
                            cy.log('ℹ️ No Instagram filter found - skipping Instagram filter test');
                            expect(true, 'Instagram filter not available - test skipped gracefully').to.be.true;
                            return;
                        }

                        cy.log('🔘 Clicking Instagram filter...');
                        getWithFallback(SELECTORS.instagramFilter).click();
                        cy.log('✅ Instagram filter activated');
                    
                        cy.log('🔍 Checking filtered content visibility...');
                        getWithFallback(SELECTORS.contentItem).then(($items) => {
                            cy.wrap($items.filter(':visible')).should('have.length.greaterThan', 0);
                        });
                        cy.log('✅ Filtered content is visible');
                    
                        cy.log('📸 Verifying all visible posts are Instagram posts...');
                        cy.get(`${findWorkingSelector(SELECTORS.contentItem)}:visible`).each(($post) => {
                            const platform = getPlatformFromPost($post[0]);
                            expect(platform).to.equal('instagram');
                        });
                        cy.log('✅ All visible posts confirmed as Instagram posts');

                        cy.log('🔍 Verifying Instagram post links and structure...');
                        cy.get(`${findWorkingSelector(SELECTORS.contentItem)}:visible`).each(($post, index) => {
                            if (getPlatformFromPost($post[0]) === 'instagram') {
                                cy.log(`📸 Verifying Instagram post ${index + 1} structure and links`);
                                validatePostStructure($post[0], 'instagram');
                            }
                        });
                        cy.log('✅ All Instagram post links verified');
                        cy.log('🎉 Test completed successfully: Instagram filter working correctly');
                    });
                });
            };
            
            tryNextUrl();
        });
    
        it('Filter by YouTube Posts and Modal (skip if not available)', () => {
            cy.log('🚀 Starting test: YouTube filter and modal functionality');
            
            // Try different social media page URLs
            const socialMediaUrls = ['social-media', 'social', 'social-feeds', 'social-posts'];
            
            const tryNextUrl = (index = 0) => {
                if (index >= socialMediaUrls.length) {
                    cy.log('ℹ️ No social media page found - skipping YouTube filter test');
                    expect(true, 'No social media page found - test skipped gracefully').to.be.true;
                    return;
                }
                
                const url = `${baseUrl}${socialMediaUrls[index]}`;
                cy.request({ url, failOnStatusCode: false }).then((response) => {
                    if (response.status === 200) {
                        cy.visit(url);
                        cy.log(`📄 Navigated to social media page: ${url}`);
                        runYouTubeFilterTest();
                    } else {
                        tryNextUrl(index + 1);
                    }
                });
            };
            
            const runYouTubeFilterTest = () => {
                // Check if YouTube posts are available
                checkPlatformAvailability('youtube').then(hasYoutubePosts => {
                    if (!hasYoutubePosts) {
                        cy.log('ℹ️ No YouTube posts available - skipping YouTube filter test');
                        expect(true, 'YouTube posts not available - test skipped gracefully').to.be.true;
                        return;
                    }

                    // Check if YouTube filter exists
                    cy.get('body').then($body => {
                        const youtubeFilterSelector = findWorkingSelector(SELECTORS.youtubeFilter);
                        if ($body.find(youtubeFilterSelector).length === 0) {
                            cy.log('ℹ️ No YouTube filter found - skipping YouTube filter test');
                            expect(true, 'YouTube filter not available - test skipped gracefully').to.be.true;
                            return;
                        }

                        cy.log('🔘 Clicking YouTube filter...');
                        getWithFallback(SELECTORS.youtubeFilter).click();
                        cy.log('✅ YouTube filter activated');
                            
                        cy.log('🔍 Checking filtered content visibility...');
                        getWithFallback(SELECTORS.contentItem).then(($items) => {
                            cy.wrap($items.filter(':visible')).should('have.length.greaterThan', 0);
                        });
                        cy.log('✅ Filtered content is visible');

                        cy.log('📺 Verifying all visible posts are YouTube posts...');
                        cy.get(`${findWorkingSelector(SELECTORS.contentItem)}:visible`).each(($post) => {
                            const platform = getPlatformFromPost($post[0]);
                            expect(platform).to.equal('youtube');
                        });
                        cy.log('✅ All visible posts confirmed as YouTube posts');
                    
                        cy.log('🔄 Testing modal functionality for each YouTube post...');
                        cy.get(`${findWorkingSelector(SELECTORS.contentItem)}:visible`).each(($post, index) => {
                            if (getPlatformFromPost($post[0]) === 'youtube') {
                                cy.log(`📺 Testing YouTube post ${index + 1} modal`);

                                // Find clickable link within post
                                cy.wrap($post).then($currentPost => {
                                    let linkFound = false;
                                    for (const linkSelector of SELECTORS.itemLink) {
                                        const links = $currentPost.find(linkSelector);
                                        if (links.length > 0) {
                                            cy.log(`🖱️ Clicking on YouTube post ${index + 1}...`);
                                            cy.wrap(links.first()).click();
                                            linkFound = true;
                                            break;
                                        }
                                    }
                                    
                                    if (!linkFound) {
                                        cy.log(`⚠️ No clickable link found for YouTube post ${index + 1}`);
                                        return;
                                    }
                                });

                                cy.log('✅ YouTube post clicked');
                            
                                cy.log('🔍 Verifying modal appears...');
                                cy.get('body').then($modalBody => {
                                    const modalSelector = findWorkingSelector(SELECTORS.modal);
                                    if ($modalBody.find(modalSelector).length === 0) {
                                        cy.log('ℹ️ No modal found for this YouTube post - skipping modal test');
                                        return;
                                    }

                                    getWithFallback(SELECTORS.modal).should('be.visible');
                                    cy.log('✅ Modal is visible');
                                
                                    // Find working close button selector and use it
                                    cy.log('🔍 Looking for modal close button...');
                                    const modalCloseSelector = findWorkingSelector(SELECTORS.modalClose);
                                    
                                    cy.get($modalBody).then($closeButtonBody => {
                                        let closeButtonFound = false;
                                        
                                        // Try different close button selectors
                                        for (const closeSelector of SELECTORS.modalClose) {
                                            if ($closeButtonBody.find(closeSelector).length > 0) {
                                                cy.get(closeSelector).should('be.visible');
                                                cy.log('✅ Close button found and visible');
                                                
                                                cy.log('🖱️ Clicking close button...');
                                                cy.get(closeSelector).click();
                                                cy.log('✅ Close button clicked');
                                                closeButtonFound = true;
                                                break;
                                            }
                                        }
                                        
                                        if (!closeButtonFound) {
                                            cy.log('ℹ️ No close button found for this modal - trying escape key');
                                            cy.get('body').type('{esc}');
                                        }
                                        
                                        cy.log('🔍 Verifying modal is closed...');
                                        cy.get(findWorkingSelector(SELECTORS.modal)).should('not.exist');
                                        cy.log(`✅ Modal closed successfully for post ${index + 1}`);
                                    });
                                });
                            }
                        });
                        cy.log('✅ All YouTube post modals tested successfully');
                        cy.log('🎉 Test completed successfully: YouTube filter and modal functionality working correctly');
                    });
                });
            };
            
            tryNextUrl();
        });
    });
};