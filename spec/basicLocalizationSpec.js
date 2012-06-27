describe('Basic localization spec', function () {
    describe('given localized text with named substitution parameters', function () {
        testNS = {
            locale:{
                paging:'Viewing page {current} of {total}'
            }};
        var txt = glu.localize({ns:'testNS', key:'paging', params:{current:1, total:20}});
        it('the item text should be localized', function () {
            expect(txt).toBe('Viewing page 1 of 20');
        });
    });
})