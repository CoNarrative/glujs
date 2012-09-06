/*
 * Copyright (C) 2012 by CoNarrative
 */
/*
 * Spec language on top of Jasmine
 */
Given = function (text, fn) {
    describe('Given ' + text, fn)
};
When = function (text, fn) {
    describe('When ' + text, fn)
};
Meaning = function (fn) {
    beforeEach(fn)
};
Shouldve = function (text, fn) {
    it('Should have ' + text, fn)
};
Should = function (text, fn) {
    it('Should ' + text, fn)
};
ShouldHave = Shouldve;