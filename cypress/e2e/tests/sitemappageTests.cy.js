module.exports = (site, baseUrl, pass) => {
       
it('🗺️ Sitemap should display all pages in alphabetical order', () => {
    cy.visit(`${baseUrl}sitemap`).wait(1000)

    let failedAssertions = []

    cy.get('.sitemap-list').then(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

        // Normalize title for comparison (used in sorting)
        const cleanTitle = (str) => str.replace(/[^a-zA-Z0-9 ]/g, '').trim().toLowerCase()

        cy.get('.sitemap-list > .page_item').then(($parents) => {
            const parentTexts = $parents
                .map((i, el) => Cypress.$(el).contents().not('.children').text().trim())
                .get()

            let previous = null

            parentTexts.forEach((current, i) => {
                if (/^[^a-zA-Z0-9]/.test(current)) {
                    cy.log(`⚠️ Skipped (starts with special character): "${current}"`)
                    return // skip and don't compare
                }

                if (previous !== null) {
                    const prevClean = cleanTitle(previous)
                    const currClean = cleanTitle(current)
                    const inOrder = collator.compare(prevClean, currClean) <= 0

                    if (!inOrder) {
                        const errorMsg = `❌ "${previous}" should come after "${current}"`
                        failedAssertions.push(errorMsg)
                        cy.log(errorMsg)
                    } else {
                        cy.log(`✅ "${previous}" is correctly before "${current}"`)
                    }
                }

                previous = current
            })
        })
    }).then(() => {
        if (failedAssertions.length > 0) {
            cy.log(`🚨 ${failedAssertions.length} alphabetical order violations found:`)
            failedAssertions.forEach(assertion => cy.log(assertion))
            
            // Create better error message instead of generic assertion
            const errorMessage = `SITEMAP TEST FAILED - ${failedAssertions.length} alphabetical order violations:\n${failedAssertions.join('\n')}`
            throw new Error(errorMessage)
        } else {
            cy.log('🎉 All pages (excluding special-char titles) are in alphabetical order.')
            expect(true, '✅ All pages are in correct alphabetical order').to.be.true
        }
    })
})
    
}