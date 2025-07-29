module.exports = (site, baseUrl, pass) => {
    it('🤖 Checks robots.txt', () => {
    const robotsUrl = `${baseUrl}/robots.txt`;
    
    cy.request(robotsUrl).then((response) => {
        // Ensure the response status is 200 OK
        expect(response.status).to.eq(200);

        const bodyText = response.body;
        cy.log('🔍 Analyzing robots.txt content...');

        // Define required lines with flexible regex patterns
        const requiredLines = [
            { text: 'User-agent: *', pattern: /User-agent\s*:\s*\*/ },
            { text: 'Crawl-delay: 5', pattern: /Crawl-delay\s*:\s*5/ },
            { text: 'Disallow: /wp-admin', pattern: /Disallow\s*:\s*\/wp-admin/ },
            { text: 'Disallow: /wp-content/plugins', pattern: /Disallow\s*:\s*\/wp-content\/plugins/ },
            { text: 'Disallow: /wp-includes', pattern: /Disallow\s*:\s*\/wp-includes/ },
            { text: 'Disallow: /wp-content/themes', pattern: /Disallow\s*:\s*\/wp-content\/themes/ },
            { text: 'User-agent: SiteAuditBot', pattern: /User-agent\s*:\s*SiteAuditBot/ },
            { text: 'Disallow: /homes-for-sale-details/', pattern: /Disallow\s*:\s*\/homes-for-sale-details/ },
            { text: 'Disallow: /homes-for-sale-search/', pattern: /Disallow\s*:\s*\/homes-for-sale-search/ },
            { text: 'Disallow: /homes-for-sale-map-search/', pattern: /Disallow\s*:\s*\/homes-for-sale-map-search/ },
            { text: 'Disallow: /homes-for-sale-search-advanced/', pattern: /Disallow\s*:\s*\/homes-for-sale-search-advanced/ },
            { text: 'Disallow: /homes-for-sale-featured/', pattern: /Disallow\s*:\s*\/homes-for-sale-featured/ },
            { text: 'Disallow: /homes-for-sale-toppicks/', pattern: /Disallow\s*:\s*\/homes-for-sale-toppicks/ },
            { text: 'Disallow: /homes-for-sale-sold-details/', pattern: /Disallow\s*:\s*\/homes-for-sale-sold-details/ },
        ];

        // Check for missing lines
        const missingLines = requiredLines
            .filter(({ pattern }) => !pattern.test(bodyText))
            .map(({ text }) => text); // Extract readable missing lines

        if (missingLines.length === 0) {
            cy.log('✅ All required lines are present in robots.txt.');
            expect(true, '✅ robots.txt contains all required directives').to.be.true;
        } else {
            cy.log(`🚨 ${missingLines.length} missing lines in robots.txt:`);
            missingLines.forEach(line => cy.log(`❌ ${line}`));
            
            // Better error message instead of generic assertion
            const errorMessage = `ROBOTS.TXT TEST FAILED - ${missingLines.length} missing required lines:\n${missingLines.join('\n')}`;
            throw new Error(errorMessage);
        }
    });
});
        
it('🗺️ Checks the sitemap.xml', () => {
    cy.log('🔍 Checking sitemap_index.xml...');
    
    const sitemapUrl = `${baseUrl}/sitemap_index.xml`;
    
    cy.request(sitemapUrl).then((response) => {
        // Assert that the request was successful
        if (response.status !== 200) {
            cy.log('❌ Sitemap request failed');
            throw new Error(`SITEMAP TEST FAILED - HTTP ${response.status}: Unable to access sitemap_index.xml`);
        }
        cy.log('✅ Sitemap accessible (HTTP 200)');

        // Assert that the content type is XML
        if (!response.headers['content-type'] || !response.headers['content-type'].includes('xml')) {
            cy.log('❌ Invalid content type');
            throw new Error(`SITEMAP TEST FAILED - Invalid content type: Expected XML, got ${response.headers['content-type']}`);
        }
        cy.log('✅ Content type is XML');
        
        // Optionally, check that the response body contains expected XML structure
        if (!response.body.includes('<sitemapindex')) {
            cy.log('❌ Missing sitemap index structure');
            throw new Error('SITEMAP TEST FAILED - Missing <sitemapindex> structure in XML');
        }
        cy.log('✅ Sitemap index structure present');
        
        cy.log('🎉 Sitemap validation passed');
        expect(true, '✅ Sitemap is valid and accessible').to.be.true;
    });
});

}