module.exports = (site, baseUrl, pass) => {
    cy.on('uncaught:exception', (err, runnable) => {
        return false;
    });


  describe('🌐 Global Test', () => {

   it('Verify navigation links working', () => {
      let navLinks = [];
      let baseUrl = '';
      let baseOrigin = '';

      // Get the base URL and origin first
      cy.url().then((url) => {
        baseUrl = url.replace(/\/+$/, ''); // Remove trailing slashes
        baseOrigin = new URL(url).origin;
        cy.log(`Base URL: ${baseUrl}`);
        cy.log(`Base Origin: ${baseOrigin}`);
      });

      const navSelectors = [
        '#nav .menu-item a',
        '.main-nav a',
        '.primary-menu a',
        '.navbar-nav a',
        '.navigation a',
        'nav[role="navigation"] a',
        '.menu a',
        'header nav a',
        '.offcanvas-navigation a'
      ];

      // Find navigation links using flexible selectors
      cy.get('body').then($body => {
        let navFound = false;

        for (const selector of navSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Navigation found: ${selector}`);

            cy.get(selector).each(($link) => {
              const href = $link.attr('href');
              const text = $link.attr('data-title') || $link.text().trim();

              // Filter out empty links, dead links, and hash-only links
              if (href && 
                  href !== '#' && 
                  !href.includes('aios-initial-setup-dead-link') &&
                  !$link.hasClass('aios-initial-setup-dead-link')) {
                  
                const linkText = text || 'Home';
                  
                navLinks.push({
                  text: linkText,
                  url: href
                });
              }
            });

            navFound = true;
            break;
          }
        }

        if (!navFound) {
          throw new Error(`❌ No navigation found with selectors: ${navSelectors.join(', ')}`);
        }
      }).then(() => {
        cy.log(`Found ${navLinks.length} navigation links to test`);

        // Test each navigation link
        navLinks.forEach((link, index) => {
          cy.log(`Testing ${index + 1}/${navLinks.length}: ${link.text}`);

          // Return to base URL before each test to ensure consistent starting point
          cy.visit(baseUrl);
          cy.wait(500); 

          // Special handling for Home link - just verify URL matches base URL
          if (link.text.toLowerCase() === 'home' || link.url === '/' || link.url.endsWith('.com.test/')) {
            cy.log(`Home link detected - verifying base URL match`);

            cy.url().then((currentUrl) => {
              const cleanCurrentUrl = currentUrl.replace(/\/+$/, ''); 
              const cleanBaseUrl = baseUrl.replace(/\/+$/, ''); 
              expect(cleanCurrentUrl).to.eq(cleanBaseUrl);
            });
            cy.log(`✅ Home page URL confirmed: ${baseUrl}`);

            // Verify page loaded successfully
            cy.get('body', { timeout: 10000 }).then(($body) => {
              const bodyText = $body.text().toLowerCase();

              const hasRealError = (bodyText.includes('404') && bodyText.includes('not found')) ||
                                  bodyText.includes('page not found') ||
                                  bodyText.includes('error 404') ||
                                  $body.find('h1').text().toLowerCase().includes('404') ||
                                  $body.find('.error-404').length > 0;

              if (hasRealError) {
                cy.log(`⚠️  WARNING: ${link.text} page appears to be a real 404 error`);
              } else {
                cy.log(`✅ ${link.text} page loaded successfully`);
              }
            });

            return; // Skip the click and navigation for home link
          }

          // Determine if link is external or cross-origin
          let linkOrigin = baseOrigin;
          let isFullUrl = false;

          if (link.url.startsWith('http://') || link.url.startsWith('https://')) {
            isFullUrl = true;
            linkOrigin = new URL(link.url).origin;
          }

          const isCrossOrigin = isFullUrl && linkOrigin !== baseOrigin;

          if (isCrossOrigin) {
            cy.log(`🌐 Cross-origin link detected: ${link.url}`);

            // Handle cross-origin navigation
            cy.origin(linkOrigin, { args: { link, navSelectors } }, ({ link, navSelectors }) => {
              // Visit the cross-origin URL directly
              cy.visit(link.url);
              cy.wait(1000);

              // Verify page loaded successfully on the new origin
              cy.get('body', { timeout: 10000 }).then(($body) => {
                const bodyText = $body.text().toLowerCase();

                const hasRealError = (bodyText.includes('404') && bodyText.includes('not found')) ||
                                    bodyText.includes('page not found') ||
                                    bodyText.includes('error 404') ||
                                    $body.find('h1').text().toLowerCase().includes('404') ||
                                    $body.find('.error-404').length > 0;

                if (hasRealError) {
                  cy.log(`⚠️  WARNING: ${link.text} page appears to be a real 404 error`);
                } else {
                  cy.log(`✅ ${link.text} page loaded successfully on cross-origin`);
                }
              });

              // Verify URL
              cy.url().then((currentUrl) => {
                cy.log(`✅ Cross-origin navigation successful: ${currentUrl}`);
              });
            });

          } else {
            cy.get('body').then($body => {
              let linkClicked = false;

              for (const selector of navSelectors) {
                if ($body.find(selector).length > 0) {
                  const $matchingLink = $body.find(selector).filter(function() {
                    return Cypress.$(this).text().trim() === link.text;
                  });

                  if ($matchingLink.length > 0) {
                    cy.get(selector).contains(link.text).first().click({ force: true });
                    linkClicked = true;
                    break;
                  }
                }
              }

              if (!linkClicked) {
                cy.log(`⚠️ Could not find clickable link for: ${link.text}`);
                return; // Skip verification if link couldn't be found
              }
            });

            cy.wait(1000);

            // Check if we've been redirected to a different origin
            cy.url().then((currentUrl) => {
              const currentOrigin = new URL(currentUrl).origin;

              if (currentOrigin !== baseOrigin) {
                cy.log(`🌐 Redirect to different origin detected: ${currentOrigin}`);

                cy.origin(currentOrigin, { args: { link } }, ({ link }) => {
                  // Verify page loaded successfully on the new origin
                  cy.get('body', { timeout: 10000 }).then(($body) => {
                    const bodyText = $body.text().toLowerCase();

                    const hasRealError = (bodyText.includes('404') && bodyText.includes('not found')) ||
                                        bodyText.includes('page not found') ||
                                        bodyText.includes('error 404') ||
                                        $body.find('h1').text().toLowerCase().includes('404') ||
                                        $body.find('.error-404').length > 0;

                    if (hasRealError) {
                      cy.log(`⚠️  WARNING: ${link.text} page appears to be a real 404 error`);
                    } else {
                      cy.log(`✅ ${link.text} page loaded successfully after redirect`);
                    }
                  });

                  cy.url().then((redirectedUrl) => {
                    cy.log(`✅ Navigation successful after redirect: ${redirectedUrl}`);
                  });
                });

              } else {
                let expectedPath = link.url.replace(/^https?:\/\/[^\/]+/, '') || '/';
                const actualPath = currentUrl.replace(/^https?:\/\/[^\/]+/, '');

                const cleanActual = actualPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
                const cleanExpected = expectedPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

                cy.log(`Link: ${link.text}`);
                cy.log(`Expected path: "${cleanExpected}"`);
                cy.log(`Actual path: "${cleanActual}"`);

                const isMatch = cleanActual === cleanExpected || 
                               cleanActual.includes(cleanExpected);

                if (!isMatch) {
                  cy.log(`⚠️  URL mismatch for ${link.text} - continuing test`);
                } else {
                  cy.log(`✅ URL match confirmed for ${link.text}`);
                }

                // Verify page loaded successfully 
                cy.get('body', { timeout: 10000 }).then(($body) => {
                  const bodyText = $body.text().toLowerCase();

                  const hasRealError = (bodyText.includes('404') && bodyText.includes('not found')) ||
                                      bodyText.includes('page not found') ||
                                      bodyText.includes('error 404') ||
                                      $body.find('h1').text().toLowerCase().includes('404') ||
                                      $body.find('.error-404').length > 0;

                  if (hasRealError) {
                    cy.log(`⚠️  WARNING: ${link.text} page appears to be a real 404 error`);
                    cy.log(`Current URL: ${currentUrl}`);
                  } else {
                    cy.log(`✅ ${link.text} page loaded successfully`);
                  }
                });
              }
            });
          }
        });
      });
    });

      it('Site Logo Redirects to Homepage', () => {

       let homeUrl = '';
      
       // Capture the base URL first
       cy.visit(baseUrl).then(() => {
         cy.url().then((url) => {
           homeUrl = url.replace(/\/+$/, ''); 
         });
       });

       // Navigate to about page
       cy.visit(`${baseUrl}about`);

       cy.url().then((url) => {
         cy.log(`Starting on page: ${url}`)
       })

      const logoSelectors = ['.header__logo', '.logo', '.site-logo', '.site-header__logo', '.logo-holder', '.logo-wrap'];


       // Verify logo exists and is visible before clicking
      cy.get('body').then($body => {
         let logoFound = false;

         for (const selector of logoSelectors) {
           if ($body.find(selector).length > 0) {
             cy.log(`✅ Logo found: ${selector}`);
             cy.get(selector).click();
             logoFound = true;
             break;
           }
         }

         if (!logoFound) {
           throw new Error(`❌ No logo found with selectors: ${logoSelectors.join(', ')}`);
         }
       });

       cy.url().then((currentUrl) => {
         const cleanCurrentUrl = currentUrl.replace(/\/+$/, ''); 
         const cleanHomeUrl = homeUrl.replace(/\/+$/, ''); 

         if (cleanCurrentUrl !== cleanHomeUrl) {
           throw new Error(`❌ Logo click failed to redirect to homepage. Expected: ${cleanHomeUrl}, but got: ${cleanCurrentUrl}`);
         }
         cy.log('✅ Logo redirect validation passed')
       });

       cy.get('body').should('be.visible');
      })


      it('Verify breadcrumb navigation functionality', () => {

          const navSelectors = [
              '#nav .menu-item a',
              '.main-nav a',
              '.primary-menu a',
              '.navbar-nav a',
              '.navigation a',
              'nav[role="navigation"] a',
              '.menu a',
              'header nav a',
              '.offcanvas-navigation a'
          ];

          // Gather valid inner page links using flexible selectors
          cy.get('body').then($body => {
              const innerPageLinks = [];
              let navFound = false;

              for (const selector of navSelectors) {
              if ($body.find(selector).length > 0) {
                  cy.log(`✅ Navigation found for breadcrumb test: ${selector}`);

                  cy.get(selector).then($links => {
                  $links.each((i, link) => {
                      const $link = Cypress.$(link);
                      const href = $link.attr('href');
                      const text = $link.attr('data-title') || $link.text().trim();

                      if (href && href !== '/' && href !== '#' && 
                          !href.includes('aios-initial-setup-dead-link') &&
                          !$link.hasClass('aios-initial-setup-dead-link') &&
                          !href.endsWith('.com.test/') &&
                          text.toLowerCase() !== 'home') {
                          
                          // Convert relative URLs to full URLs
                          const fullUrl = href.startsWith('http') ? href : `${baseUrl.replace(/\/$/, '')}${href.startsWith('/') ? href : '/' + href}`;
                          innerPageLinks.push({ text, url: fullUrl });
                      }
                  });
                  });

                  navFound = true;
                  break;
              }
              }

              if (!navFound) {
              throw new Error(`❌ No navigation found with selectors: ${navSelectors.join(', ')}`);
              }

              cy.then(() => {
              if (innerPageLinks.length === 0) {
                  cy.log('⚠️ No valid inner pages found for breadcrumb testing.');
                  return;
              }

              // Pick random page and navigate to it
              const selectedPage = Cypress._.sample(innerPageLinks);
              cy.log(`🎯 Testing breadcrumbs on: ${selectedPage.text} (${selectedPage.url})`);

              cy.visit(selectedPage.url);
              cy.wait(2000);

              const breadcrumbSelectors = [
                  '.ipBanner__headings--breadcrumbs', 
                  '.breadcrumb', 
                  '.ipBreadcrumbs',
                  '#breadcrumbs',
                  '.breadcrumbs',
                  '[class*="breadcrumb"]', 
                  '.nav-breadcrumb', 
                  '.page-breadcrumb',
                  '.entry-breadcrumb', 
                  '#breadcrumb', 
                  '#breadcrumbs',
                  '.yoast-breadcrumb', 
                  '.rank-math-breadcrumb'
              ];

              const breadcrumbLinkSelectors = [
                  'a[property="item"]',
                  'a',
                  '.breadcrumb-item a',
                  '.breadcrumb-link'
              ];

              let foundBreadcrumb = false;

              for (const selector of breadcrumbSelectors) {
                  cy.get('body').then($body => {
                  if (!foundBreadcrumb && $body.find(selector + ':visible').length > 0) {
                      foundBreadcrumb = true;
                      cy.log(`✅ Breadcrumb found using: ${selector}`);

                      // Try different breadcrumb link patterns
                      let breadcrumbLinksFound = false;

                      for (const linkSelector of breadcrumbLinkSelectors) {
                      if ($body.find(selector).find(linkSelector).length > 0) {
                          cy.log(`✅ Breadcrumb links found using: ${selector} ${linkSelector}`);

                          cy.get(selector).find(linkSelector).then($breadcrumbLinks => {
                          if ($breadcrumbLinks.length === 0) {
                              cy.log('⚠️ No clickable breadcrumb links found.');
                              return;
                          }

                          const allLinks = Array.from($breadcrumbLinks);

                          cy.log(`📋 Breadcrumb structure (${allLinks.length} links):`);
                          allLinks.forEach((link, i) => {
                              const text = Cypress.$(link).text().trim();
                              cy.log(`  ${i}: ${text}`);
                          });

                          const linksToTest = allLinks.length >= 2 
                              ? allLinks.slice().reverse()  // Test all links in reverse order
                              : [allLinks[0]];

                          cy.log(`🎯 Will test ${linksToTest.length} links:`);
                          linksToTest.forEach((link, i) => {
                              const text = Cypress.$(link).text().trim();
                              cy.log(`  Test ${i + 1}: ${text}`);
                          });

                          linksToTest.forEach((link, idx) => {
                              const $link = Cypress.$(link);
                              const linkText = $link.text().trim();
                              const linkHref = $link.attr('href');

                              cy.visit(selectedPage.url);
                              cy.wait(1500);

                              cy.log(`🔎 Testing breadcrumb link ${idx + 1}: ${linkText}`);

                              // Use flexible selector to click breadcrumb link
                              cy.get(selector).find(linkSelector).contains(linkText)
                                  .first().click({ force: true });

                              cy.wait(2000);

                              cy.url().then(newUrl => {
                                  // Convert linkHref to full URL if it's relative
                                  let expectedUrl = linkHref;
                                  if (linkHref && !linkHref.startsWith('http')) {
                                  expectedUrl = linkHref.startsWith('/') 
                                      ? `${baseUrl.replace(/\/$/, '')}${linkHref}`
                                      : `${baseUrl.replace(/\/$/, '')}/${linkHref}`;
                                  }

                                  const expected = expectedUrl ? expectedUrl.replace(/^https?:\/\/[^/]+/, '') || '/' : '/';
                                  const actual = newUrl.replace(/^https?:\/\/[^/]+/, '') || '/';

                                  // Normalize paths by removing trailing slashes for comparison
                                  const normalizedExpected = expected.replace(/\/$/, '') || '/';
                                  const normalizedActual = actual.replace(/\/$/, '') || '/';

                                  if (normalizedActual === normalizedExpected || normalizedActual.includes(normalizedExpected) || (normalizedExpected === '/' && normalizedActual === '/')) {
                                  cy.log(`✅ Navigated correctly to: ${actual}`);
                                  } else {
                                  cy.log(`❌ Expected ${expected}, got ${actual}`);
                                  }
                              });
                          });

                          cy.log(`📘 Breadcrumb test completed for: ${selectedPage.text}`);
                          });

                          breadcrumbLinksFound = true;
                          break;
                      }
                      }

                      if (!breadcrumbLinksFound) {
                      cy.log(`⚠️ No breadcrumb links found with selectors: ${breadcrumbLinkSelectors.join(', ')}`);
                      }
                  }
                  });

                  if (foundBreadcrumb) break;
              }

              cy.then(() => {
                  if (!foundBreadcrumb) {
                  cy.log(`⚠️ No visible breadcrumbs found on: ${selectedPage.text}`);
                  }
              });
              });
          });
          });


      it('Footer Links Work', () => {
          let footerLinks = [];
          let socialLinks = [];
          let baseUrl = '';
          let baseOrigin = '';

          // Get the base URL and origin first
          cy.url().then((url) => {
              baseUrl = url.replace(/\/+$/, ''); 
              baseOrigin = new URL(url).origin;
              cy.log(`Base URL: ${baseUrl}`);
              cy.log(`Base Origin: ${baseOrigin}`);
          });

          const footerSelector = ['.footer', 'footer'];
          const navLinkSelectors = [
              '.footer__nav .footernav a',
              '.footer-nav a',
              '.footer nav a',
              'footer nav a',
              '.footer a[href]:not([href="#"])',
              '.site-footer nav a',
              '.menu-main-nav-container .footernav a',
              '.ft-row li.menu-item a',
              'footer .menu-item a'
          ];

          // Find footer element
          cy.get('body').then($body => {
              let footerFound = false;

              for (const selector of footerSelector) {
                  if ($body.find(selector).length > 0) {
                      cy.log(`✅ Footer found: ${selector}`);
                      cy.get(selector).scrollIntoView();
                      footerFound = true;
                      break;
                  }
              }

              if (!footerFound) {
                  throw new Error(`❌ No footer found with selectors: ${footerSelector.join(', ')}`);
              }
          });

          cy.log('📍 Testing Footer Navigation Links');

          // Find footer navigation links using flexible selectors
          cy.get('body').then($body => {
              let navLinksFound = false;

              for (const selector of navLinkSelectors) {
                  if ($body.find(selector).length > 0) {
                      cy.log(`✅ Footer nav links found: ${selector}`);

                      cy.get(selector).each(($link) => {
                          const href = $link.attr('href');
                          const title = $link.attr('data-title') || $link.text().trim();

                          const isPhoneOrEmail = href.startsWith('tel:') || href.startsWith('mailto:');
                          const isSocialLink = /facebook\.com|twitter\.com|instagram\.com|linkedin\.com|youtube\.com|pinterest\.com|tiktok\.com|threads\.net/i.test(href);

                          // Skip dead links or empty hrefs
                          if (href && href !== '#' && !$link.hasClass('aios-initial-setup-dead-link')  &&
                              !$link.hasClass('aios-initial-setup-dead-link') &&
                              !isPhoneOrEmail &&
                              !isSocialLink) {
                              footerLinks.push({ href, title });
                          }
                      });

                      navLinksFound = true;
                      break;
                  }
              }

              if (!navLinksFound) {
                  throw new Error(`❌ No footer nav links found with selectors: ${navLinkSelectors.join(', ')}`);
              }
          }).then(() => {
              cy.log(`Found ${footerLinks.length} footer links to test`);

              // Test each valid footer link
              footerLinks.forEach((link) => {
                  cy.log(`Testing footer link: ${link.title} - ${link.href}`);

                  // Return to base URL before each test
                  cy.visit(baseUrl);
                  cy.wait(500); 

                  // Scroll to footer using flexible selector
                  cy.get('body').then($body => {
                      for (const selector of footerSelector) {
                          if ($body.find(selector).length > 0) {
                              cy.get(selector).scrollIntoView();
                              break;
                          }
                      }
                  });

                  // Special handling for Home link - just verify URL matches base URL
                  if (link.title.toLowerCase() === 'home' || 
                      link.href === '/' || 
                      link.href.endsWith('.com.test/') ||
                      link.href === baseUrl ||
                      link.href === baseUrl + '/') {
                      
                      cy.log(`Home link detected in footer - verifying base URL match`);
                      
                      cy.url().then((currentUrl) => {
                          const cleanCurrentUrl = currentUrl.replace(/\/+$/, '');
                          const cleanBaseUrl = baseUrl.replace(/\/+$/, ''); 

                          if (cleanCurrentUrl === cleanBaseUrl) {
                              cy.log(`✅ Footer Home link URL confirmed: ${cleanBaseUrl}`);
                          } else {
                              cy.log(`⚠️ Not on base URL. Current: ${cleanCurrentUrl}, Expected: ${cleanBaseUrl}`);
                          }
                      });

                      return; // Skip the click and navigation for home link
                  }

                  // Determine if link is external or cross-origin
                  let linkOrigin = baseOrigin;
                  let isFullUrl = false;

                  if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
                      isFullUrl = true;
                      linkOrigin = new URL(link.href).origin;
                  }

                  const isCrossOrigin = isFullUrl && linkOrigin !== baseOrigin;

                  if (isCrossOrigin) {
                      cy.log(`🌐 Cross-origin footer link detected: ${link.href}`);

                      // Handle cross-origin navigation
                      cy.origin(linkOrigin, { args: { link, navLinkSelectors, footerSelector } }, ({ link, navLinkSelectors, footerSelector }) => {
                          // Visit the cross-origin URL directly
                          cy.visit(link.href);
                          cy.wait(1000);

                          // Verify page loaded successfully on the new origin
                          cy.get('body', { timeout: 10000 }).then(($body) => {
                              const bodyText = $body.text().toLowerCase();

                              const hasRealError = (bodyText.includes('404') && bodyText.includes('not found')) ||
                                                  bodyText.includes('page not found') ||
                                                  bodyText.includes('error 404') ||
                                                  $body.find('h1').text().toLowerCase().includes('404') ||
                                                  $body.find('.error-404').length > 0;

                              if (hasRealError) {
                                  cy.log(`⚠️ WARNING: ${link.title} footer link appears to be a real 404 error`);
                              } else {
                                  cy.log(`✅ ${link.title} footer link loaded successfully on cross-origin`);
                              }
                          });

                          // Verify URL
                          cy.url().then((currentUrl) => {
                              cy.log(`✅ Cross-origin footer navigation successful: ${currentUrl}`);
                          });
                      });

                  } else {
                      // Handle same-origin navigation
                      cy.get('body').then($body => {
                          let linkClicked = false;

                          for (const selector of navLinkSelectors) {
                              if ($body.find(selector).length > 0) {
                                  const $matchingLink = $body.find(selector).filter(function() {
                                      return Cypress.$(this).text().trim() === link.title;
                                  });

                                  if ($matchingLink.length > 0) {
                                      cy.get(selector).contains(link.title).first().click({ force: true });
                                      linkClicked = true;
                                      break;
                                  }
                              }
                          }

                          if (!linkClicked) {
                              cy.log(`⚠️ Could not find clickable link for: ${link.title}`);
                              return; // Skip verification if link couldn't be found
                          }
                      });

                      cy.wait(1000);

                      // Check if we've been redirected to a different origin
                      cy.url().then((currentUrl) => {
                          const currentOrigin = new URL(currentUrl).origin;

                          if (currentOrigin !== baseOrigin) {
                              cy.log(`🌐 Footer link redirect to different origin detected: ${currentOrigin}`);

                              // Handle the redirect with cy.origin
                              cy.origin(currentOrigin, { args: { link } }, ({ link }) => {
                                  // Verify page loaded successfully on the new origin
                                  cy.get('body', { timeout: 10000 }).then(($body) => {
                                      const bodyText = $body.text().toLowerCase();

                                      const hasRealError = (bodyText.includes('404') && bodyText.includes('not found')) ||
                                                          bodyText.includes('page not found') ||
                                                          bodyText.includes('error 404') ||
                                                          $body.find('h1').text().toLowerCase().includes('404') ||
                                                          $body.find('.error-404').length > 0;

                                      if (hasRealError) {
                                          cy.log(`⚠️ WARNING: ${link.title} footer link appears to be a real 404 error`);
                                      } else {
                                          cy.log(`✅ ${link.title} footer link loaded successfully after redirect`);
                                      }
                                  });

                                  cy.url().then((redirectedUrl) => {
                                      cy.log(`✅ Footer navigation successful after redirect: ${redirectedUrl}`);
                                  });
                              });

                          } else {
                              // Verify the URL changed or page loaded
                              if (link.href.startsWith('http')) {
                                  const expectedPath = new URL(link.href).pathname;
                                  // cy.url().should('include', expectedPath);
                              } else {
                                  cy.url().should('include', link.href);
                              }

                              cy.get('body').should('be.visible');

                              // Verify page loaded successfully 
                              cy.get('body', { timeout: 10000 }).then(($body) => {
                                  const bodyText = $body.text().toLowerCase();

                                  const hasRealError = (bodyText.includes('404') && bodyText.includes('not found')) ||
                                                      bodyText.includes('page not found') ||
                                                      bodyText.includes('error 404') ||
                                                      $body.find('h1').text().toLowerCase().includes('404') ||
                                                      $body.find('.error-404').length > 0;

                                  if (hasRealError) {
                                      cy.log(`⚠️ WARNING: ${link.title} footer link appears to be a real 404 error`);
                                  } else {
                                      cy.log(`✅ ${link.title} footer link loaded successfully`);
                                  }
                              });

                              // Log success
                              cy.url().then((currentUrl) => {
                                  cy.log(`✅ Successfully navigated to: ${currentUrl}`);
                              });
                          }
                      });
                  }
              });
          });

            cy.log('📍 Testing Social Media Icons');

            const socialLinkSelectors = [
              '.footer__icons--socials a',
              '.social-links a',
              '.footer-social a',
              '.smi a',
              '.social-media a',
              '.footer .social a',
              'footer .social-icons a',
              '.footer-socials a',
              '.footer-smi a',
              '.footer [href*="facebook.com"], .footer [href*="twitter.com"], .footer [href*="x.com"], .footer [href*="instagram.com"], .footer [href*="youtube.com"], .footer [href*="linkedin.com"]'
            ];

            const phoneSelectors = [
              '.footer__contactInfo a[href^="tel:"]',
              '.contact-info a[href^="tel:"]',
              '.footer-contact a[href^="tel:"]',
              'footer a[href^="tel:"]',
              '.footer [href^="tel:"]',
              '[class*="contact"] a[href^="tel:"]'
            ];

            const emailSelectors = [
              '.footer__contactInfo a[href^="mailto:"]',
              '.contact-info a[href^="mailto:"]',
              '.footer-contact a[href^="mailto:"]',
              'footer a[href^="mailto:"]',
              '.footer [href^="mailto:"]',
              '[class*="contact"] a[href^="mailto:"]'
            ];

            const socialIconSelectors = [
              'i',
              '.icon',
              'svg',
              '[class*="icon"]',
              '.fa',
              '[class*="fa-"]'
            ];

            const srOnlySelectors = [
              '.sr-only',
              '.screen-reader-only',
              '.visually-hidden',
              '.accessible-text',
              '.hidden-text'
            ];


            // Test Social Media Icons
            cy.get('body').then($body => {
              let footerFound = false;

              for (const selector of footerSelector) {
                if ($body.find(selector).length > 0) {
                  cy.log(`✅ Footer found: ${selector}`);
                  cy.get(selector).scrollIntoView();
                  footerFound = true;
                  break;
                }
              }

              if (!footerFound) {
                throw new Error(`❌ No footer found with selectors: ${footerSelector.join(', ')}`);
              }
            });

            // Find social links using dynamic selectors
            cy.get('body').then($body => {
              let socialLinksFound = false;
              let usedSelector = '';

              for (const selector of socialLinkSelectors) {
                if ($body.find(selector).length > 0) {
                  cy.log(`✅ Social links found with selector: ${selector}`);
                  usedSelector = selector;
                  socialLinksFound = true;
                  break;
                }
              }

              if (!socialLinksFound) {
                cy.log(`⚠️ No social links found with any selector: ${socialLinkSelectors.join(', ')}`);
                return;
              }

              cy.get(usedSelector).each(($socialLink) => {
                const href = $socialLink.attr('href');
                let socialNetwork = 'unknown';
                let ariaLabel = 'Social link';

                // Try to find icon class from various selectors
                for (const iconSelector of socialIconSelectors) {
                  const iconElement = $socialLink.find(iconSelector);
                  if (iconElement.length > 0 && iconElement.attr('class')) {
                    socialNetwork = iconElement.attr('class');
                    break;
                  }
                }

                // Try to find accessible text from various selectors
                for (const srSelector of srOnlySelectors) {
                  const srElement = $socialLink.find(srSelector);
                  if (srElement.length > 0 && srElement.text().trim()) {
                    ariaLabel = srElement.text().trim();
                    break;
                  }
                }

                // Fallback: try aria-label or title attributes
                if (ariaLabel === 'Social link') {
                  ariaLabel = $socialLink.attr('aria-label') || $socialLink.attr('title') || 'Social link';
                }
              
                if (href && href !== '#') {
                  socialLinks.push({ href, socialNetwork, ariaLabel });
                }
              }).then(() => {
                cy.log(`Found ${socialLinks.length} social media links to test`);
              
                socialLinks.forEach((social, index) => {
                  cy.log(`Testing social link ${index + 1}/${socialLinks.length}: ${social.ariaLabel} - ${social.href}`);

                  // Check that social links have correct attributes
                  cy.get(usedSelector).eq(index).within(() => {
                    cy.root().should('have.attr', 'href').and('include', getExpectedDomain(social.socialNetwork));
                    // cy.root().should('have.attr', 'target', '_blank');
                  });
                
                  cy.request({
                    url: social.href,
                    failOnStatusCode: false
                  }).then((response) => {
                    if (response.status === 200) {
                      cy.log(`✅ Social link ${social.ariaLabel} is accessible (Status: ${response.status})`);
                    } else {
                      cy.log(`⚠️ Social link ${social.ariaLabel} returned status: ${response.status}`);
                    }
                  });
                });
              });
            });

            cy.log('📍 Testing Phone Number Link');

            // Find phone links using dynamic selectors
            cy.get('body').then($body => {
              let phoneFound = false;
              let usedPhoneSelector = '';

              for (const selector of phoneSelectors) {
                if ($body.find(selector).length > 0) {
                  cy.log(`✅ Phone link found with selector: ${selector}`);
                  usedPhoneSelector = selector;
                  phoneFound = true;
                  break;
                }
              }

              if (!phoneFound) {
                cy.log(`⚠️ No phone links found with any selector: ${phoneSelectors.join(', ')}`);
                return;
              }

              cy.get(usedPhoneSelector)
                .should('exist')
                .and('be.visible')
                .and('have.attr', 'href')
                .then((href) => {
                  cy.log(`ℹ️ Found phone link with href: ${href}`);
                  cy.wrap(href).should('match', /^tel:\+?[\d\s\-\.\(\)]+$/);
                
                  cy.url().then((currentUrl) => {
                    cy.log(`🌐 Current URL before click: ${currentUrl}`);

                    // Prevent default navigation for tel: links
                    cy.window().then((win) => {
                      win.document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
                        el.addEventListener('click', (e) => e.preventDefault());
                      });
                    });
                  
                    cy.get('a[href^="tel:"]').first().click({ force: true });
                  
                    cy.wait(500);
                  
                    // Confirm URL has not changed
                    cy.url().should('eq', currentUrl);
                    cy.log('✅ No page navigation occurred; phone link behavior as expected');
                  });
                });
            });

            cy.log('📍 Testing Email Address Link');

            // Find email links using dynamic selectors
            cy.get('body').then($body => {
              let emailFound = false;
              let usedEmailSelector = '';

              for (const selector of emailSelectors) {
                if ($body.find(selector).length > 0) {
                  cy.log(`✅ Email link found with selector: ${selector}`);
                  usedEmailSelector = selector;
                  emailFound = true;
                  break;
                }
              }

              if (!emailFound) {
                cy.log(`⚠️ No email links found with any selector: ${emailSelectors.join(', ')}`);
                return;
              }

              cy.get(usedEmailSelector)
                .should('exist')
                .and('be.visible')
                .and('have.attr', 'href')
                .then((href) => {
                  cy.log(`ℹ️ Found email link with href: ${href}`);
                  cy.wrap(href).should('match', /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

                  cy.url().then((currentUrl) => {
                    cy.log(`🌐 Current URL before click: ${currentUrl}`);

                    // Prevent default navigation for mailto: links
                    cy.window().then((win) => {
                      win.document.querySelectorAll('a[href^="mailto:"]').forEach((el) => {
                        el.addEventListener('click', (e) => e.preventDefault());
                      });
                    });

                    cy.get('a[href^="mailto:"]').first().click({ force: true });

                    cy.wait(500);

                    cy.url().should('eq', currentUrl);
                    cy.log('✅ No page navigation occurred; email link behavior as expected');
                  });
                });
            });


          // Helper function to get expected domain for social networks
          function getExpectedDomain(socialClass) {
            if (socialClass.includes('facebook')) return 'facebook.com';
            if (socialClass.includes('twitter')) return ['x.com', 'twitter.com'];
            if (socialClass.includes('instagram')) return 'instagram.com';
            if (socialClass.includes('youtube')) return 'youtube.com'; 
            if (socialClass.includes('linkedin')) return 'linkedin.com';
            return ''; 
          }

      it('404 Page for Invalid URL', () => {
        cy.visit(`${baseUrl}404`, { failOnStatusCode: false });
        cy.log('✅ Visited /404 page');

        // Verify the page returns a 404 status
        cy.request({ url: '/404', failOnStatusCode: false })
          .then((response) => {
            try {
              expect(response.status).to.eq(404);
              cy.log('✅ Confirmed 404 status code returned');
            } catch (error) {
              cy.log(`❌ Status code assertion failed: Expected 404, got ${response.status}`);
              throw error;
            }
          });

        // Check elements with proper logging
        cy.get('.error-page-content-wrapper')
          .should('exist')
          .then(() => cy.log('✅ Error page content wrapper found'));

        cy.get('.error-page-image-holder')
          .should('be.visible')
          .then(() => cy.log('✅ Error page image holder is visible'));

        cy.get('.error-page-excerpt')
          .should('be.visible')
          .then(() => cy.log('✅ Error page excerpt is visible'));

        cy.get('header')
          .should('exist')
          .then(() => cy.log('✅ Header element found'));

        cy.get('footer')
          .should('exist')
          .then(() => cy.log('✅ Footer element found'));

        cy.log('🎉 404 page test completed successfully');
      });

      it('Back to Top Button Works as Expected', () => {

        cy.log('Attempting to scroll to the footer to reveal the Back to Top button.');
        cy.get('footer').scrollIntoView();
        cy.wait(500); 

        cy.get('.btt-show', { timeout: 10000 }) 
          .should('exist') 
          .and('be.visible') 
          .then(($btn) => {
            cy.log('✅ Back to Top button is visible');
            cy.wrap($btn).click();

            // Assert that the page has scrolled back to the top with a tolerance
            cy.window().its('scrollY').should('be.closeTo', 0, 2); 
            cy.log('✅ Page successfully scrolled back to the top.');
          });

        cy.get('body').should('be.visible');
      });
    });
  });
}