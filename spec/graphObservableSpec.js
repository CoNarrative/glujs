describe('Graph Observable specs', function () {
    var A, B, C, D;
    Given('Given observables A through D', function () {
        var zedCallback;
        Meaning(function () {
            zedCallback = jasmine.createSpy('zedCallback');
            A = new glu.GraphObservable({name : 'A'});
            B = new glu.GraphObservable({name:'B'});
            C = new glu.GraphObservable({name:'C'});
            D = new glu.GraphObservable({name:'D'});
        });
        A = new glu.GraphObservable();
        Given('B listening for event myA.zed and then being attached', function () {
            Meaning(function () {
                B.on('myA.zed', zedCallback);
                B.attach('myA', A);
            });
            When('A fires event Zed', function () {
                Meaning(function () {
                    A.fireEvent('zed');
                });
                ShouldHave('called back to B function', function () {
                    expect(zedCallback).toHaveBeenCalled();
                });
            });
        });
        Given('C listening fo event myB.myA.zed and the three attached',function(){
            Meaning(function () {
                C.on('myB.myA.zed', zedCallback)
                C.attach('myB', B);
                B.attach('myA', A);
            });
            When('A fires event Zed', function () {
                Meaning(function () {
                    A.fireEvent('zed');
                });
                ShouldHave('called back to C function', function () {
                    expect(zedCallback).toHaveBeenCalled();
                });
            });
            When('B is removed from A', function(){
                Meaning(function(){
                    B.detach('myA');
                });
                When('A fires event Zed', function () {
                    Meaning(function () {
                        A.fireEvent('zed');
                    });
                    ShouldHave('NOT called back to C function', function () {
                        expect(zedCallback).not.toHaveBeenCalled();
                    });
                });
            });
            When('C is removed from B', function(){
                Meaning(function(){
                    C.detach('myB');
                });
                When('A fires event Zed', function () {
                    Meaning(function () {
                        A.fireEvent('zed');
                    });
                    ShouldHave('NOT called back to C function', function () {
                        expect(zedCallback).not.toHaveBeenCalled();
                    });
                });
                When('C is re-attached to B', function(){
                    Meaning(function(){
                        C.attach('myB',B);
                    });
                    When('A fires event Zed', function () {
                        Meaning(function () {
                            A.fireEvent('zed');
                        });
                        ShouldHave('called back to C function', function () {
                            expect(zedCallback).toHaveBeenCalled();
                        });
                    });
                })
            })
        });
//        Given('C listening fo event myB.myA.zed with callback on reattach true and the three attached',function(){
//            var APrime, BPrime;
//            Meaning(function () {
//                C.on('myB.myA.zed', zedCallback, C, true)
//                C.attach('myB', B);
//                B.attach('myA', A);
//                APrime = new glu.GraphObservable({name : 'APrime'});
//                BPrime = new glu.GraphObservable({name:'BPrime'});
//                BPrime.attach('myA',APrime);
//            });
//            When('A fires event Zed', function () {
//                Meaning(function () {
//                    A.fireEvent('zed');
//                });
//                ShouldHave('called back to C function', function () {
//                    expect(zedCallback).toHaveBeenCalled();
//                });
//            });
//            When('C is removed from B and attached instead to B Prime (which is attached to A Prime)', function(){
//                Meaning(function(){
//                    C.detach('myB');
//                    C.attach('myB',BPrime);
//                });
//                ShouldHave('called back to C function', function () {
//                    expect(zedCallback).toHaveBeenCalled();
//                });
//                When('A prime fires event Zed', function(){
//                    Meaning(function () {
//                        APrime.fireEvent('zed');
//                    });
//                    ShouldHave('called back to C function', function () {
//                        expect(zedCallback).toHaveBeenCalled();
//                    });
//                });
//            })
//        });

    });
});