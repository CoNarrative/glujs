describe('string tests', function () {
    it('should capitalized the first letter when humanizing', function () {
        var str = glu.string('myWorld').asTitle();
        expect(str).toEqual('My World');
    });

    it('should do name-based  substitutions', function () {
        var str = glu.string('page {current} out of {total}').format({current:1,total:20});
        expect(str).toEqual('page 1 out of 20');
    });

    it('should do index-based  substitutions', function () {
        var str = glu.string('page {0} out of {1}').format(1,20);
        expect(str).toEqual('page 1 out of 20');
    });

    it('should do name-based substitutions across multiple key sources', function () {
        var str = glu.string('page {current} out of {total} with status of {status}').format({current:1,total:20},{status:'good'});
        expect(str).toEqual('page 1 out of 20 with status of good');
    });

    it('should do name-based substitutions and be able to walk key', function () {
        var str = glu.string('processing {selections.length} selections').format({selections:['foo','bar']});
        expect(str).toEqual('processing 2 selections');
    });

});
