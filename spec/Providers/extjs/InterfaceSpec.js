describe('InterfaceSpec', function () {
    // go through all of our glu interfaces and make sure that the ExtJs 3.4.0 provider implements them
    var iModel = glu.IModel;
    var model = new glu.Model();

    it('glu.Model implements IModel Interface', function () {
        for (var k in iModel) {
            if (glu.isFunction(iModel[k])) {
                expect(glu.isFunction(model[k])).toEqual(true);
            }
        }
    });

    it('glu.Model implements IModel Interface and method signitures match in input parameter length', function () {
        for (var k in iModel) {
            if (glu.isFunction(iModel[k]) && glu.isFunction(model[k])) {
                expect(iModel[k].length).toEqual(model[k].length);
            }
        }
    });

});


